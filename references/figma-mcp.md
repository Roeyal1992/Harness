# Figma MCP — Connection Reference

**Config file:** `C:\Users\roalfassi\.claude\mcp.json`

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"]
    }
  }
}
```

**Auth model:** OAuth (browser-based). No API key required or asked for. Token stored locally after first auth.

**Auth cache:** `C:\Users\roalfassi\.claude\mcp-needs-auth-cache.json`

**Tools appear as:** `mcp__figma__*` in the deferred tool list when connected.

## When Figma MCP is missing from a session

The server initializes at session start. If `mcp__figma__*` tools don't appear:

1. Open a new chat in VS Code
2. Run `/harness`
3. Figma tools will be available in the new session

No config change needed. Do not ask for an API key.
