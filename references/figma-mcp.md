# Figma MCP — Connection Reference

**Config file:** `C:\Users\roalfassi\.claude\mcp.json`

```json
{
  "mcpServers": {
    "figma": {
      "command": "C:\\Users\\roalfassi\\AppData\\Local\\node\\figma-developer-mcp.cmd",
      "args": ["--stdio"]
    }
  }
}
```

> **Why the full path:** VS Code's extension environment doesn't inherit the user PATH that includes `C:\Users\roalfassi\AppData\Local\node`, so the bare binary name fails in VS Code even though it works in the desktop app. The `.cmd` wrapper at the absolute path resolves this.

**Auth model:** OAuth (browser-based). No API key required. Token stored locally after first auth — but the VS Code extension does not reliably persist or share the token across sessions. Re-auth is commonly required.

**Auth cache:** `C:\Users\roalfassi\.claude\mcp-needs-auth-cache.json`

**Tools appear as:** `mcp__figma__*` in the deferred tool list when connected.

---

## When Figma MCP is missing from a session

Run these checks in order. Execute each step yourself — do not hand the steps to the user until you reach a point that requires browser interaction.

### Step 1 — Check if the package is installed globally

Run:
```powershell
npm list -g figma-developer-mcp
```

- If the result is `(empty)` → go to Step 2.
- If the package is listed → go to Step 3.

### Step 2 — Install globally and update config

Run:
```powershell
npm install -g figma-developer-mcp
```

Then read `C:\Users\roalfassi\.claude\mcp.json` and confirm it uses the full absolute path. Update it to:

```json
{
  "mcpServers": {
    "figma": {
      "command": "C:\\Users\\roalfassi\\AppData\\Local\\node\\figma-developer-mcp.cmd",
      "args": ["--stdio"]
    }
  }
}
```

Tell the user to open a new chat for the fix to take effect.

### Step 3 — Check the config

Read `C:\Users\roalfassi\.claude\mcp.json`. Confirm `command` is the full absolute path `"C:\\Users\\roalfassi\\AppData\\Local\\node\\figma-developer-mcp.cmd"` — not a bare name and not `"npx"`. If it's wrong, fix it to the full path, then tell the user to open a new chat.

### Step 4 — Check the auth cache

Read `C:\Users\roalfassi\.claude\mcp-needs-auth-cache.json`.

- If `plugin:figma:figma` is **absent** → the token was never set or was already cleared. Tell the user to open a new chat; Claude Code will trigger browser re-auth on startup.
- If `plugin:figma:figma` is **present**, check its `timestamp`. Convert to a date. If it is more than ~4 weeks old, the token is likely stale.
  - Remove just the `plugin:figma:figma` entry from the file (leave all other entries intact).
  - Tell the user to open a new chat — Claude Code will prompt browser re-auth on startup.
- If the timestamp is recent, the token should be valid. Tell the user to open a new chat as a last transient-state reset.

---

## Root cause (resolved 2026-07-19)

The original config used `npx -y figma-developer-mcp --stdio`. On Deloitte's corporate network, `npx` downloads the package fresh on each session start. If the download is slow or blocked, the MCP server never initializes within Claude Code's startup window — and the tools silently disappear.

**Fix applied:** `figma-developer-mcp` installed globally (`npm install -g`), `mcp.json` updated to invoke the binary directly.

## Root cause (resolved 2026-07-19) — VS Code extension PATH

Figma MCP connected in the Claude Code desktop app but not in the VS Code extension, even with reloads.

**Cause:** VS Code's extension host runs with a restricted environment that does not inherit the user's PATH. The npm global bin directory (`C:\Users\roalfassi\AppData\Local\node`) was on the user PATH but not visible to VS Code — so `figma-developer-mcp` couldn't be resolved by name.

**Fix applied:** `mcp.json` updated to use the full absolute path to the `.cmd` wrapper: `C:\Users\roalfassi\AppData\Local\node\figma-developer-mcp.cmd`. This works in both environments without relying on PATH.

## Persistent issue — VS Code OAuth token not retained

Even with the correct config, Figma MCP frequently shows as "connecting" but never completes in VS Code sessions. The `mcp-needs-auth-cache.json` file shows no `plugin:figma:figma` entry, meaning the OAuth token from a previous session (including desktop app sessions) does not carry over.

**Status:** Not fully resolved as of 2026-07-19. The desktop app connects reliably; VS Code does not.

**Current workaround:** Open a new chat in VS Code — this triggers a fresh browser-based OAuth flow. Re-auth may be needed at the start of each VS Code session or after an extended gap.
