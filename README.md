<p align="center">
  <a href="https://browser-use.com" target="_blank">
    <img src="https://avatars.githubusercontent.com/u/192012301?v=4" alt="Browser Use" width="120" height="120">
  </a>
</p>

# Browser Agent Template

**Template.** Fork it, deploy it, and you have an AI agent that browses the real web.

A [Vercel **eve**](https://eve.dev) agent with a web chat UI and a [Browser Use](https://browser-use.com)
**cloud browser**. Ask it to look something up, scrape a page, fill a form, or
take a screenshot — and watch it work live.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbrowser-use%2Fbrowser-agent-template&env=BROWSER_USE_API_KEY,AI_GATEWAY_API_KEY&envDescription=BROWSER_USE_API_KEY%20from%20browser-use.com%20%7C%20a%20model%20credential%20for%20the%20AI%20Gateway&project-name=browser-agent&repository-name=browser-agent)

---

## Features

- **Web chat UI** — a Next.js chat app (streaming responses, tool calls rendered inline).
- **Cloud browser** — the agent opens a real [Browser Use](https://browser-use.com) browser to navigate, scrape, click, and screenshot the live web.
- **Watch it work** — every browsing session returns a **liveUrl** you can open to watch the browser in real time.
- **Hardened** — your `BROWSER_USE_API_KEY` stays in the app runtime, never in the agent's sandbox.

Browsing is powered by [`@browser_use/eve`](https://www.npmjs.com/package/@browser_use/eve).

## Quick Start

### Deploy to Vercel

Click the button above. You'll be asked for:

- `BROWSER_USE_API_KEY` — from [browser-use.com](https://browser-use.com)
- a **model credential** — link the Vercel project for the AI Gateway, or set `AI_GATEWAY_API_KEY`

### Run locally

**Requirements:** Node 24+

```bash
git clone https://github.com/browser-use/browser-agent-template
cd browser-agent-template
npm install
cp .env.example .env.local   # fill in BROWSER_USE_API_KEY + a model credential
npm run dev
```

Open the app, and ask: *"Go to news.ycombinator.com and give me the top 5 posts."*

## How it works

- The chat UI is [eve](https://eve.dev)'s built-in Web Chat (Next.js), mounted via `withEve()` in `next.config.ts`.
- The agent's browsing comes from `@browser_use/eve` — four thin files under `agent/` (`sandbox`, `skills/browser-use`, `tools/open_cloud_browser`, `tools/stop_cloud_browser`).
- On a browse request: `open_cloud_browser` provisions a cloud browser (key stays app-side) → the agent drives it with `browser-harness-js` → `stop_cloud_browser` ends it.

## Customize

- **Identity / behavior:** `agent/instructions.md`
- **Model:** `agent/agent.ts`
- **Auth:** `agent/channels/eve.ts` ships with a placeholder that blocks browser requests in production. For an open public demo use `none()` (anyone can use your keys/credits — be careful); for real users add an auth provider (Auth.js, Clerk).
- **More browser config** (proxy country, profile, timeouts): see [`@browser_use/eve`](https://www.npmjs.com/package/@browser_use/eve).
