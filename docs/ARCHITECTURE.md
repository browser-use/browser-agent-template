# Architecture

Browser Agent Template is a single [Next.js](https://nextjs.org) service with a
[Vercel eve](https://eve.dev) agent mounted into it. The chat UI and the agent
deploy together — there's no separate backend.

```
┌─────────────────────────────────────────────────────────────┐
│                      Web chat (Next.js)                      │
│            app/ — useEveAgent() + ai-elements UI             │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            eve agent (instructions, skill, tools)            │
│              mounted into Next.js via withEve()              │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  @browser_use/eve — provisions a Browser Use cloud browser   │
│       (key stays server-side; agent drives it via CDP)       │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
                     Browser Use cloud browser
```

## The web app (`app/`)

The UI is eve's built-in Web Chat. [`next.config.ts`](../next.config.ts) wraps the
Next config in `withEve()`, which mounts eve's HTTP API into the same app — so the
agent is reachable at `/eve/v1/*` and deploys with the frontend.

- `app/page.tsx` renders `AgentChat`.
- `app/_components/agent-chat.tsx` — the chat, via `useEveAgent()` (`eve/react`). It
  also extracts the latest cloud-browser **liveUrl** from the conversation and shows
  it in a split layout.
- `app/_components/browser-panel.tsx` — a thin `<iframe src={liveUrl}>` live view.
- `components/ai-elements/*` — streaming message, tool-call, and reasoning UI.

## The agent (`agent/`)

A standard eve agent:

- `agent/agent.ts` — the model (`anthropic/claude-opus-4.8` via the AI Gateway).
- `agent/instructions.md` — the always-on system prompt (a web-browsing agent).
- `agent/channels/eve.ts` — the Web Chat channel + auth.
- `agent/sandbox/sandbox.ts`, `agent/skills/browser-use.ts`,
  `agent/tools/{open,stop}_cloud_browser.ts` — thin re-exports of
  [`@browser_use/eve`](https://www.npmjs.com/package/@browser_use/eve).

## Browsing (`@browser_use/eve`)

Hardened by default — the API key never leaves the app runtime:

1. `open_cloud_browser` (app runtime) provisions a Browser Use cloud browser via
   `browser-use-sdk` and resolves its WebSocket URL.
2. Only that scoped URL is handed to eve's sandbox.
3. The agent drives the browser with `browser-harness-js` (raw, typed Chrome
   DevTools Protocol).
4. `stop_cloud_browser` ends the cloud browser to stop billing.

## Deploy

On Vercel it's a plain Next.js deploy — `withEve` handles the eve build, and the
sandbox runs on Vercel Sandbox automatically. No `vercel.json` needed.
