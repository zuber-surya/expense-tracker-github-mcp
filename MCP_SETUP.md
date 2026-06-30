# GitHub MCP Setup

This repo includes `.mcp.json`, a shared MCP server config that any MCP-compatible
AI editor (Claude Code, Cursor, VS Code + MCP extension, etc.) auto-detects when
you open this project. It connects your editor to GitHub's MCP server, exposing
tools like `create_branch`, `create_pull_request`, `get_pull_request_diff`,
`create_pull_request_review`, and `merge_pull_request`.

## 1. Create a GitHub Personal Access Token

Go to https://github.com/settings/personal-access-tokens and create a
fine-grained token scoped to **this repo only**, with:
- Contents: Read and write
- Pull requests: Read and write
- (Optional) Workflows: Read and write, if you want it able to trigger Actions

## 2. Set the token as a local environment variable

Never commit your token. Export it in your shell profile or a local `.env.mcp`
(already git-ignored):

```bash
export GITHUB_PAT=ghp_xxxxxxxxxxxxxxxxxxxx
```

Or copy `.env.mcp.example` to `.env.mcp`, fill in the value, and load it
(`source .env.mcp`) before starting your editor — exact loading mechanism
depends on your shell/editor.

## 3. Open the project in your editor

Most MCP-aware editors detect `.mcp.json` automatically on open and will
prompt you to approve the server connection. Editor-specific notes:

- **Claude Code**: detects `.mcp.json` in the project root automatically;
  approve the connection when prompted, or run `claude mcp list` to confirm
  it picked it up.
- **Cursor**: supports project `.mcp.json` the same way; check
  Settings → MCP to confirm the `github` server shows as connected.
- **VS Code**: requires the MCP extension; it reads `.mcp.json` from the
  workspace root, or you may need to mirror it into `.vscode/mcp.json`
  depending on extension version.

## 4. Use it

Once connected, just describe the task in plain language, e.g.:

> "Create a branch `feat/recurring-expenses`, implement recurring expense
> support, push it, and open a PR against `main`."

> "Review PR #12 and leave comments on anything that looks off."

> "Merge PR #12 once checks pass."

The editor will call the appropriate GitHub MCP tools (branch, commit/push via
your local git, open PR, comment, merge) without you needing to touch GitHub's
UI directly.

## Notes

- `.mcp.json` only stores *how to connect* — no secrets are stored in it.
  The `${GITHUB_PAT}` reference is resolved from your local environment.
- Anyone cloning this repo gets the same MCP server config automatically;
  they just need their own token.
- If you don't want GitHub MCP active for a given session, most editors let
  you disable individual servers from project config without editing the file.
