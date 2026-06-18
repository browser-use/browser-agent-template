# Customization

Browser Agent Template is a starting point. Here's how to make it yours.

## Rename your agent

- **Persona / behavior:** edit [`agent/instructions.md`](../agent/instructions.md) —
  this is the always-on system prompt.
- **Display name:** `AGENT_NAME` in `app/_components/agent-chat.tsx`.
- **App name:** `name` in `package.json`.

## Change the model

`agent/agent.ts` sets the model. By default it uses a gateway model id:

```ts
import { defineAgent } from "eve";

export default defineAgent({
  model: "anthropic/claude-opus-4.8",
});
```

Use any [AI Gateway model id](https://vercel.com/ai-gateway/models) (e.g.
`anthropic/claude-sonnet-4.6` for a faster, cheaper agent). To call a provider
directly, pass a provider-authored model:

```ts
import { defineAgent } from "eve";
import { anthropic } from "@ai-sdk/anthropic";

export default defineAgent({
  model: anthropic("claude-opus-4-8"), // reads ANTHROPIC_API_KEY
});
```

## Add tools and skills

The agent's capabilities are files under `agent/`:

- A **tool** is one TypeScript file in `agent/tools/` (`defineTool` from `eve/tools`,
  with a Zod input schema).
- A **skill** is a markdown procedure in `agent/skills/` the model loads on demand.

The browsing capability ships as thin re-exports of
[`@browser_use/eve`](https://www.npmjs.com/package/@browser_use/eve) — see its README
for re-running `npx browser-use-eve add`.

## Configure the cloud browser

`@browser_use/eve` supports per-session options (proxy country, a logged-in profile,
timeouts). See the [package docs](https://www.npmjs.com/package/@browser_use/eve).

## Auth (for a public deployment)

`agent/channels/eve.ts` ships with a placeholder that **blocks browser requests in
production** — so a fresh deploy won't let strangers spend your credits. To open it up:

- **Public demo:** use `none()` — anyone can use it (and your keys). Be careful.
- **Real users:** add an auth provider (Auth.js, Clerk) and wire it into the channel.

## Deploy your fork

It's a standard Next.js app — push to GitHub and import into Vercel, or use the
**Deploy with Vercel** button in the README. Set `BROWSER_USE_API_KEY` and a model
credential (see [ENVIRONMENT.md](./ENVIRONMENT.md)).
