# Chrome DevTools MCP & Browser Verification Guide

Comprehensive reference guide for automating UI interaction tests, assertions, and visual evidence generation using Chrome DevTools MCP.

---

## Tool Reference & Usage Patterns

### 1. Page Navigation & Viewport Configuration
- **`navigate_page`**: Navigates Chrome to the target application URL.
  ```json
  {
    "type": "url",
    "url": "http://127.0.0.1:8000/farmer/products/create/"
  }
  ```
- **`resize_page`**: Sets explicit viewport dimensions.
  - Desktop: `1920 x 1080`
  - Mobile: `390 x 844` (iPhone 14)

---

### 2. Form Automation & File Uploads
- **`fill_form`**: Populates inputs using CSS selectors or field names.
- **`click`**: Simulates element clicks (e.g. submit buttons, checkboxes).
- **`upload_file`**: Binds sample test files to file inputs.
  ```json
  {
    "filePath": "/path/to/test_sample_image.png",
    "selector": "input[type='file']"
  }
  ```

---

### 3. Automated Quality Assertions

#### Console Exception Audit
Execute `list_console_messages` after completing user interactions. Verify:
- No `type: "error"` messages.
- No uncaught `TypeError` or `ReferenceError` tracebacks.

#### Network Payload Audit
Execute `list_network_requests` to inspect HTTP status codes:
- Verify API form submissions return `200 OK`, `201 Created`, or `302 Found`.
- Assert no `500 Internal Server Error` responses.

---

### 4. Visual Snapshot & Artifact Rules

1. Always save high-resolution screenshots to `<appDataDir>\brain\<conversation-id>/`.
2. Name files descriptively:
   - `before_fix_<scenario_name>.png`
   - `after_fix_<scenario_name>.png`
3. Always embed screenshots in `walkthrough.md` using absolute `file:///` scheme links.
