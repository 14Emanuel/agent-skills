#!/usr/bin/env node
/**
 * CodeRabbit PR Loop CLI Helper (cr-loop.mjs)
 *
 * Cross-platform Node.js CLI for orchestrating the autonomous
 * Issue -> PR -> CodeRabbit Review -> Fix -> Human Handoff loop via `gh` CLI.
 *
 * Subcommands:
 *   node scripts/cr-loop.mjs status  --pr <number> [--owner <o>] [--repo <r>]
 *   node scripts/cr-loop.mjs trigger --pr <number> [--full] [--owner <o>] [--repo <r>]
 *   node scripts/cr-loop.mjs wait    --pr <number> [--sha <oid>] [--since <iso>] [--timeout-sec 600] [--poll-sec 15]
 *   node scripts/cr-loop.mjs threads --pr <number> [--all]
 *   node scripts/cr-loop.mjs reply   --pr <number> --thread <threadNodeId> --body <text> [--resolve | --no-resolve]
 *   node scripts/cr-loop.mjs handoff --pr <number> [--reviewer <login>] [--ready]
 */

import { execFileSync } from 'node:child_process';

// ---------------------------------------------------------------------------
// Argument Parser
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args[0] && !args[0].startsWith('-') ? args.shift() : 'help';
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    }
  }
  return { command, flags };
}

// ---------------------------------------------------------------------------
// GH CLI Execution Helpers
// ---------------------------------------------------------------------------
function runGh(ghArgs, { allowFailure = false } = {}) {
  try {
    const stdout = execFileSync('gh', ghArgs, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 20 * 1024 * 1024,
    });
    return { ok: true, stdout: stdout.trim(), stderr: '' };
  } catch (err) {
    const stdout = err.stdout ? String(err.stdout).trim() : '';
    const stderr = err.stderr ? String(err.stderr).trim() : err.message;
    if (allowFailure) {
      return { ok: false, stdout, stderr, status: err.status ?? 1 };
    }
    throw new Error(`gh ${ghArgs.slice(0, 3).join(' ')} failed: ${stderr || stdout}`);
  }
}

function runGhJson(ghArgs, { allowPartialGraphql = false } = {}) {
  const res = runGh(ghArgs, { allowFailure: allowPartialGraphql });
  if (res.stdout) {
    try {
      const parsed = JSON.parse(res.stdout);
      if (res.ok || (allowPartialGraphql && parsed?.data)) {
        return parsed;
      }
    } catch {
      // Fall through to error below
    }
  }
  throw new Error(
    `gh ${ghArgs.slice(0, 3).join(' ')} failed: ${res.stderr || res.stdout}`
  );
}

function assertGhReady() {
  const auth = runGh(['auth', 'status'], { allowFailure: true });
  if (!auth.ok) {
    throw new Error(
      `Prerequisite missing — gh CLI is not authenticated. Details: ${auth.stderr || auth.stdout}`
    );
  }
}

function resolveRepoCoords(flags) {
  if (flags.owner && flags.repo) {
    return { owner: String(flags.owner), repo: String(flags.repo) };
  }
  const data = runGhJson(['repo', 'view', '--json', 'owner,name']);
  return {
    owner: flags.owner ? String(flags.owner) : data.owner.login,
    repo: flags.repo ? String(flags.repo) : data.name,
  };
}

function getAuthenticatedUser() {
  const res = runGh(['api', 'user', '--jq', '.login']);
  return res.stdout.trim();
}

function isCodeRabbitAuthor(login) {
  if (!login) return false;
  const lower = login.toLowerCase();
  return lower === 'coderabbitai' || lower === 'coderabbitai[bot]';
}

// ---------------------------------------------------------------------------
// Parse CodeRabbit Nitpicks / Actionable Items Embedded in Review Body
// ---------------------------------------------------------------------------
function extractEmbeddedReviewItems(reviewBody) {
  if (!reviewBody) return [];
  const items = [];
  const detailsRegex =
    /<details>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi;
  let match;
  while ((match = detailsRegex.exec(reviewBody)) !== null) {
    const summary = match[1].replace(/<[^>]+>/g, '').trim();
    const content = match[2].trim();
    if (
      /nitpick|outside diff range|actionable|caution|duplicate/i.test(summary) &&
      content.length > 0
    ) {
      items.push({
        category: summary,
        excerpt: content.slice(0, 1200) + (content.length > 1200 ? '…' : ''),
      });
    }
  }
  return items;
}

// ---------------------------------------------------------------------------
// Detect CodeRabbit Rate Limit, In-Progress Walkthrough, or Skip Notices
// ---------------------------------------------------------------------------
function detectCodeRabbitNotice(issueComments, sinceIso) {
  const crComments = issueComments.filter(c => isCodeRabbitAuthor(c.author?.login));
  const recent = sinceIso
    ? crComments.filter(c => new Date(c.updatedAt || c.createdAt) >= new Date(sinceIso))
    : crComments.slice(-5);

  for (let i = recent.length - 1; i >= 0; i--) {
    const c = recent[i];
    const body = c.body || '';
    if (/rate limit exceeded/i.test(body)) {
      const waitMatch = body.match(
        /wait\s+(?:(\d+)\s+minutes?\s+and\s+)?(\d+)\s+seconds?/i
      );
      const waitSeconds = waitMatch
        ? parseInt(waitMatch[1] || '0', 10) * 60 + parseInt(waitMatch[2] || '0', 10) + 15
        : 120;
      return {
        type: 'RATE_LIMITED',
        createdAt: c.createdAt,
        waitSeconds,
        excerpt: body.slice(0, 300),
      };
    }
    if (/currently processing new changes in this pr/i.test(body)) {
      return {
        type: 'IN_PROGRESS',
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        excerpt:
          'CodeRabbit walkthrough comment indicates review is currently in progress.',
      };
    }
    if (/review skipped|auto review.*disabled|draft.*skipped/i.test(body)) {
      return {
        type: 'REVIEW_SKIPPED',
        createdAt: c.createdAt,
        excerpt: body.slice(0, 300),
      };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Fetch Full PR Snapshot (GraphQL with graceful statusCheckRollup fallback)
// ---------------------------------------------------------------------------
function fetchPrSnapshot({ owner, repo, prNumber, me }) {
  const query = `
    query($owner: String!, $repo: String!, $pr: Int!) {
      repository(owner: $owner, name: $repo) {
        pullRequest(number: $pr) {
          id
          number
          title
          url
          state
          isDraft
          reviewDecision
          headRefName
          baseRefName
          headRefOid
          commits(last: 1) {
            nodes {
              commit {
                oid
                committedDate
                statusCheckRollup {
                  state
                  contexts(first: 50) {
                    nodes {
                      __typename
                      ... on CheckRun {
                        name
                        status
                        conclusion
                        completedAt
                      }
                      ... on StatusContext {
                        context
                        state
                        description
                        createdAt
                      }
                    }
                  }
                }
              }
            }
          }
          reviews(last: 50) {
            nodes {
              id
              author { login }
              state
              body
              submittedAt
              commit { oid }
            }
          }
          comments(last: 30) {
            nodes {
              id
              author { login }
              body
              createdAt
              updatedAt
            }
          }
          reviewThreads(first: 100) {
            nodes {
              id
              isResolved
              isOutdated
              path
              line
              comments(first: 30) {
                nodes {
                  id
                  databaseId
                  author { login }
                  body
                  createdAt
                }
              }
            }
          }
        }
      }
    }
  `;

  // Use allowPartialGraphql=true so tokens without `checks:read` still receive
  // the full pullRequest data even if `statusCheckRollup` returns FORBIDDEN.
  const raw = runGhJson(
    [
      'api',
      'graphql',
      '-f',
      `query=${query}`,
      '-f',
      `owner=${owner}`,
      '-f',
      `repo=${repo}`,
      '-F',
      `pr=${prNumber}`,
    ],
    { allowPartialGraphql: true }
  );

  const pr = raw?.data?.repository?.pullRequest;
  if (!pr) {
    throw new Error(`Pull request #${prNumber} not found in ${owner}/${repo}`);
  }

  const headOid = pr.headRefOid;
  const lastCommitNode = pr.commits?.nodes?.[0]?.commit;
  const lastCommitDate = lastCommitNode?.committedDate || null;
  const rollup = lastCommitNode?.statusCheckRollup;
  const checksPermissionAvailable = Boolean(rollup !== null || !raw?.errors?.length);
  const ciState =
    rollup?.state || (checksPermissionAvailable ? 'PENDING' : 'UNAVAILABLE_VIA_TOKEN');

  // Inspect check runs / statuses for CodeRabbit and CI (when accessible)
  const checkNodes = rollup?.contexts?.nodes || [];
  let coderabbitCheck = null;
  const ciChecks = [];

  for (const node of checkNodes) {
    const name = node.__typename === 'CheckRun' ? node.name : node.context;
    const status = node.__typename === 'CheckRun' ? node.status : node.state;
    const conclusion = node.__typename === 'CheckRun' ? node.conclusion : node.state;
    if (/coderabbit/i.test(name || '')) {
      coderabbitCheck = {
        name,
        status,
        conclusion,
        inProgress:
          status === 'IN_PROGRESS' || status === 'QUEUED' || status === 'PENDING',
      };
    } else if (name) {
      ciChecks.push({ name, status, conclusion });
    }
  }

  // Reviews from CodeRabbit
  const allReviews = pr.reviews?.nodes || [];
  const crReviews = allReviews.filter(r => isCodeRabbitAuthor(r.author?.login));
  const latestCrReview = crReviews.length > 0 ? crReviews[crReviews.length - 1] : null;
  const crReviewsAtHead = crReviews.filter(r => r.commit?.oid === headOid);
  const latestCrReviewAtHead =
    crReviewsAtHead.length > 0 ? crReviewsAtHead[crReviewsAtHead.length - 1] : null;

  const reviewAtHead = Boolean(latestCrReviewAtHead);

  // Embedded nitpicks from latest CodeRabbit review at HEAD (or latest overall)
  const activeReviewForBody = latestCrReviewAtHead || latestCrReview;
  const embeddedNitpicks = extractEmbeddedReviewItems(activeReviewForBody?.body || '');

  // Open threads analysis
  const allThreads = pr.reviewThreads?.nodes || [];
  const openThreads = [];

  for (const t of allThreads) {
    if (t.isResolved) continue;
    const comments = t.comments?.nodes || [];
    if (comments.length === 0) continue;
    const first = comments[0];
    const last = comments[comments.length - 1];
    const firstAuthor = first.author?.login || 'unknown';
    const lastAuthor = last.author?.login || 'unknown';

    const awaitingReply = lastAuthor.toLowerCase() !== me.toLowerCase();

    openThreads.push({
      threadId: t.id,
      commentDatabaseId: first.databaseId,
      author: firstAuthor,
      isCodeRabbit: isCodeRabbitAuthor(firstAuthor),
      path: t.path,
      line: t.line,
      isOutdated: Boolean(t.isOutdated),
      awaitingReply,
      lastCommentAuthor: lastAuthor,
      lastCommentAt: last.createdAt,
      createdAt: first.createdAt,
      body: first.body,
      replyCount: comments.length - 1,
      latestReplyBody: comments.length > 1 ? last.body : null,
    });
  }

  const openThreadsAwaitingReply = openThreads.filter(t => t.awaitingReply).length;
  const openCodeRabbitThreads = openThreads.filter(t => t.isCodeRabbit);
  const notice = detectCodeRabbitNotice(pr.comments?.nodes || [], lastCommitDate);

  const checkInProgress =
    Boolean(coderabbitCheck?.inProgress) || notice?.type === 'IN_PROGRESS';
  const converged =
    !checkInProgress &&
    reviewAtHead &&
    openThreadsAwaitingReply === 0 &&
    latestCrReviewAtHead?.state !== 'CHANGES_REQUESTED';

  return {
    owner,
    repo,
    prNumber: pr.number,
    title: pr.title,
    url: pr.url,
    state: pr.state,
    isDraft: pr.isDraft,
    reviewDecision: pr.reviewDecision,
    headRefName: pr.headRefName,
    baseRefName: pr.baseRefName,
    headOid,
    lastCommitDate,
    ciState,
    ciChecks,
    coderabbitCheck,
    coderabbitNotice: notice,
    latestCodeRabbitReview: latestCrReview
      ? {
          id: latestCrReview.id,
          state: latestCrReview.state,
          submittedAt: latestCrReview.submittedAt,
          commitOid: latestCrReview.commit?.oid || null,
          bodyExcerpt: (latestCrReview.body || '').slice(0, 600),
        }
      : null,
    reviewAtHead,
    openThreadCount: openThreads.length,
    openCodeRabbitThreadCount: openCodeRabbitThreads.length,
    openThreadsAwaitingReply,
    embeddedNitpickCount: embeddedNitpicks.length,
    embeddedNitpicks,
    threads: openThreads,
    converged,
  };
}

// ---------------------------------------------------------------------------
// Subcommands
// ---------------------------------------------------------------------------
function cmdStatus(flags) {
  const prNumber = parseInt(flags.pr, 10);
  if (!prNumber) throw new Error('Missing required flag: --pr <number>');
  const { owner, repo } = resolveRepoCoords(flags);
  const me = getAuthenticatedUser();
  const snap = fetchPrSnapshot({ owner, repo, prNumber, me });
  console.log(JSON.stringify(snap, null, 2));
}

function cmdThreads(flags) {
  const prNumber = parseInt(flags.pr, 10);
  if (!prNumber) throw new Error('Missing required flag: --pr <number>');
  const { owner, repo } = resolveRepoCoords(flags);
  const me = getAuthenticatedUser();
  const snap = fetchPrSnapshot({ owner, repo, prNumber, me });
  const list = flags.all ? snap.threads : snap.threads.filter(t => t.awaitingReply);
  console.log(
    JSON.stringify(
      {
        prNumber: snap.prNumber,
        headOid: snap.headOid,
        reviewAtHead: snap.reviewAtHead,
        totalOpenThreads: snap.openThreadCount,
        openThreadsAwaitingReply: snap.openThreadsAwaitingReply,
        embeddedNitpicks: snap.embeddedNitpicks,
        threads: list,
      },
      null,
      2
    )
  );
}

function cmdTrigger(flags) {
  const prNumber = parseInt(flags.pr, 10);
  if (!prNumber) throw new Error('Missing required flag: --pr <number>');
  const { owner, repo } = resolveRepoCoords(flags);
  const me = getAuthenticatedUser();
  const snap = fetchPrSnapshot({ owner, repo, prNumber, me });

  if (
    (snap.coderabbitCheck?.inProgress || snap.coderabbitNotice?.type === 'IN_PROGRESS') &&
    !flags.force
  ) {
    console.log(
      JSON.stringify(
        {
          triggered: false,
          reason: 'CodeRabbit review is already in progress on HEAD',
          headOid: snap.headOid,
          coderabbitCheck: snap.coderabbitCheck,
        },
        null,
        2
      )
    );
    return;
  }

  const commandText = flags.full ? '@coderabbitai full review' : '@coderabbitai review';
  const triggeredAt = new Date().toISOString();
  runGh([
    'pr',
    'comment',
    String(prNumber),
    '--repo',
    `${owner}/${repo}`,
    '--body',
    commandText,
  ]);

  console.log(
    JSON.stringify(
      {
        triggered: true,
        command: commandText,
        triggeredAt,
        prNumber,
        headOid: snap.headOid,
      },
      null,
      2
    )
  );
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function cmdWait(flags) {
  const prNumber = parseInt(flags.pr, 10);
  if (!prNumber) throw new Error('Missing required flag: --pr <number>');
  const timeoutSec = parseInt(flags['timeout-sec'] || '600', 10);
  const pollSec = parseInt(flags['poll-sec'] || '15', 10);
  const sinceIso = flags.since || null;
  const targetSha = flags.sha ? String(flags.sha) : null;

  const { owner, repo } = resolveRepoCoords(flags);
  const me = getAuthenticatedUser();
  const deadline = Date.now() + timeoutSec * 1000;
  let rateLimitRetriggered = false;

  while (Date.now() < deadline) {
    const snap = fetchPrSnapshot({ owner, repo, prNumber, me });

    // 1. Handle CodeRabbit rate-limit cooldown automatically
    if (snap.coderabbitNotice?.type === 'RATE_LIMITED' && !rateLimitRetriggered) {
      const waitSec = Math.min(snap.coderabbitNotice.waitSeconds || 90, 240);
      console.error(
        `[cr-loop] CodeRabbit rate limit detected. Sleeping ${waitSec}s then re-triggering @coderabbitai review...`
      );
      await sleep(waitSec * 1000);
      runGh([
        'pr',
        'comment',
        String(prNumber),
        '--repo',
        `${owner}/${repo}`,
        '--body',
        '@coderabbitai review',
      ]);
      rateLimitRetriggered = true;
      await sleep(pollSec * 1000);
      continue;
    }

    // 2. Check if CodeRabbit has reviewed HEAD (or targetSha if specified)
    const shaMatches = !targetSha || snap.headOid.startsWith(targetSha);
    const reviewTimeOk =
      !sinceIso ||
      (snap.latestCodeRabbitReview?.submittedAt &&
        new Date(snap.latestCodeRabbitReview.submittedAt) >= new Date(sinceIso));

    const checkCompletedOnHead =
      snap.coderabbitCheck &&
      !snap.coderabbitCheck.inProgress &&
      (snap.coderabbitCheck.conclusion === 'SUCCESS' ||
        snap.coderabbitCheck.conclusion === 'NEUTRAL' ||
        snap.coderabbitCheck.status === 'COMPLETED');

    const inProgress =
      Boolean(snap.coderabbitCheck?.inProgress) ||
      snap.coderabbitNotice?.type === 'IN_PROGRESS';

    if (
      shaMatches &&
      !inProgress &&
      ((snap.reviewAtHead && reviewTimeOk) || checkCompletedOnHead)
    ) {
      console.log(JSON.stringify({ waitStatus: 'REVIEW_READY', ...snap }, null, 2));
      return;
    }

    console.error(
      `[cr-loop] Waiting for CodeRabbit on PR #${prNumber} (HEAD ${snap.headOid.slice(0, 7)})... ` +
        `notice=${snap.coderabbitNotice?.type || 'none'} reviewAtHead=${snap.reviewAtHead}`
    );
    await sleep(pollSec * 1000);
  }

  const finalSnap = fetchPrSnapshot({ owner, repo, prNumber, me });
  console.log(JSON.stringify({ waitStatus: 'TIMEOUT', ...finalSnap }, null, 2));
}

function cmdReply(flags) {
  const prNumber = parseInt(flags.pr, 10);
  const threadId = flags.thread;
  const body = flags.body;

  if (!threadId || !body) {
    throw new Error(
      'Usage: node scripts/cr-loop.mjs reply [--pr <number>] --thread <threadNodeId> --body "<text>" [--resolve | --no-resolve]'
    );
  }

  const replyMutation = `
    mutation($threadId: ID!, $body: String!) {
      addPullRequestReviewThreadReply(input: { pullRequestReviewThreadId: $threadId, body: $body }) {
        comment {
          id
          url
          createdAt
        }
      }
    }
  `;

  const replyRes = runGhJson([
    'api',
    'graphql',
    '-f',
    `query=${replyMutation}`,
    '-f',
    `threadId=${threadId}`,
    '-f',
    `body=${body}`,
  ]);

  const shouldResolve = flags.resolve === true && !flags['no-resolve'];
  let resolved = false;

  if (shouldResolve) {
    const resolveMutation = `
      mutation($threadId: ID!) {
        resolveReviewThread(input: { threadId: $threadId }) {
          thread {
            id
            isResolved
          }
        }
      }
    `;
    const resolveRes = runGhJson([
      'api',
      'graphql',
      '-f',
      `query=${resolveMutation}`,
      '-f',
      `threadId=${threadId}`,
    ]);
    resolved = Boolean(resolveRes?.data?.resolveReviewThread?.thread?.isResolved);
  }

  console.log(
    JSON.stringify(
      {
        replied: true,
        prNumber: prNumber || null,
        threadId,
        commentUrl: replyRes?.data?.addPullRequestReviewThreadReply?.comment?.url || null,
        resolved,
      },
      null,
      2
    )
  );
}

function cmdHandoff(flags) {
  const prNumber = parseInt(flags.pr, 10);
  if (!prNumber) throw new Error('Missing required flag: --pr <number>');
  const { owner, repo } = resolveRepoCoords(flags);
  const me = getAuthenticatedUser();
  const snap = fetchPrSnapshot({ owner, repo, prNumber, me });

  let markedReady = false;
  if (snap.isDraft && flags.ready !== 'false') {
    const readyRes = runGh(
      ['pr', 'ready', String(prNumber), '--repo', `${owner}/${repo}`],
      {
        allowFailure: true,
      }
    );
    markedReady = readyRes.ok;
  }

  let reviewerAdded = null;
  if (flags.reviewer) {
    const revRes = runGh(
      [
        'pr',
        'edit',
        String(prNumber),
        '--repo',
        `${owner}/${repo}`,
        '--add-reviewer',
        String(flags.reviewer),
      ],
      { allowFailure: true }
    );
    reviewerAdded = revRes.ok ? String(flags.reviewer) : null;
  }

  console.log(
    JSON.stringify(
      {
        handoffComplete: true,
        prNumber,
        url: snap.url,
        headOid: snap.headOid,
        markedReady,
        reviewerAdded,
        converged: snap.converged,
        openThreadCount: snap.openThreadCount,
      },
      null,
      2
    )
  );
}

function printHelp() {
  console.log(`
CodeRabbit PR Loop CLI (scripts/cr-loop.mjs)

Commands:
  status   --pr <num>
           Fetch JSON snapshot of PR HEAD, CodeRabbit review state, and open threads.

  trigger  --pr <num> [--full] [--force]
           Trigger '@coderabbitai review' on the PR if not already running.

  wait     --pr <num> [--sha <oid>] [--since <iso>] [--timeout-sec 600] [--poll-sec 15]
           Wait in the background until CodeRabbit completes its review of HEAD, then print JSON snapshot and exit.

  threads  --pr <num> [--all]
           List unresolved review threads awaiting agent action (plus embedded review-body nitpicks).

  reply    [--pr <num>] --thread <threadNodeId> --body "<text>" [--resolve | --no-resolve]
           Reply directly to a review thread via GraphQL and optionally resolve it.

  handoff  --pr <num> [--reviewer <github_login>] [--ready]
           Mark Draft PR as ready for review and assign the human reviewer.
`);
}

// ---------------------------------------------------------------------------
// Entrypoint
// ---------------------------------------------------------------------------
async function main() {
  const { command, flags } = parseArgs(process.argv);
  if (command === 'help' || flags.help) {
    printHelp();
    return;
  }

  assertGhReady();

  switch (command) {
    case 'status':
      cmdStatus(flags);
      break;
    case 'threads':
      cmdThreads(flags);
      break;
    case 'trigger':
      cmdTrigger(flags);
      break;
    case 'wait':
      await cmdWait(flags);
      break;
    case 'reply':
      cmdReply(flags);
      break;
    case 'handoff':
      cmdHandoff(flags);
      break;
    default:
      throw new Error(`Unknown subcommand '${command}'. Run with --help for usage.`);
  }
}

main().catch(err => {
  console.error(JSON.stringify({ error: true, message: err.message }));
  process.exit(1);
});
