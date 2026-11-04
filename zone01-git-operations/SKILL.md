---
name: zone01-git-operations
description: Perform Git operations (clone, pull, push, fetch) on Zone01 Gitea repositories (e.g. learn.zone01kisumu.ke) by overriding Git Credential Manager (GCM) using -c credential.helper= or host-specific configuration.
---

# Zone01 Gitea Git Operations

Guide and commands for performing Git operations (`clone`, `pull`, `push`, `fetch`) on Zone01 Gitea platform repositories.

> [!IMPORTANT]
> Zone01 Gitea servers (e.g., `learn.zone01kisumu.ke`) do not support Git Credential Manager (GCM) browser OAuth authentication (`/login/oauth/authorize` returns 404). 
> Standard `git` commands trigger GCM and fail. You MUST override `credential.helper` when performing operations over HTTPS or set host-specific Git configuration.

---

## 1. Core Command Syntax

Always prefix `git` commands with `-c credential.helper=` to disable GCM for the request:

### Clone Repository
```bash
git -c credential.helper= clone <REPO_URL>
```
*Example:*
```bash
git -c credential.helper= clone https://learn.zone01kisumu.ke/git/emanueokoth/groupie-tracker.git
```

### Pull Changes
```bash
git -c credential.helper= pull origin main
```

### Push Changes
```bash
git -c credential.helper= push origin main
```

### Fetch Remote
```bash
git -c credential.helper= fetch origin
```

---

## 2. Non-Interactive / Script Authentication

When running automated non-interactive tasks or scripts, credentials can be embedded into the remote URL:

```bash
git -c credential.helper= clone https://<USERNAME>:<PASSWORD_OR_PAT>@learn.zone01kisumu.ke/git/<USERNAME>/<REPO_NAME>.git
```

---

## 3. Global Git Config Fix (Permanent Bypass per Host)

To avoid typing `-c credential.helper=` for every command, configure Git globally to bypass GCM specifically for your Zone01 domain:

```bash
# In CMD or Bash:
git config --global credential.https://learn.zone01kisumu.ke.helper ""

# In PowerShell:
cmd /c 'git config --global credential.https://learn.zone01kisumu.ke.helper ""'
```

To verify the configuration:
```bash
git config --global --get-regexp "credential\."
```

Once configured, standard commands like `git clone`, `git pull`, and `git push` against `learn.zone01kisumu.ke` will bypass GCM automatically.

---

## 4. Alternative Authentication: SSH

If HTTPS authentication is restricted or you prefer key-based authentication:
1. Generate an SSH key (if not already existing):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
2. Add your public key (`~/.ssh/id_ed25519.pub`) in Zone01 Gitea under **Settings -> SSH / GPG Keys**.
3. Use the SSH clone URL directly (no credential helper flags needed):
   ```bash
   git clone git@learn.zone01kisumu.ke:emanueokoth/groupie-tracker.git
   ```
