# Environment Variables

Copy `.env.example` to `.env.local` and fill these in. On Vercel, set them in your
project's **Settings → Environment Variables**.

## Required

### `BROWSER_USE_API_KEY`

Your [Browser Use](https://browser-use.com) cloud key (`bu_...`). Used server-side to
provision and tear down cloud browsers. Never exposed to the model or the sandbox.
Get one at [browser-use.com](https://browser-use.com).

### A model credential

The default model `anthropic/claude-opus-4.8` is served through the
[Vercel AI Gateway](https://vercel.com/docs/ai-gateway). Pick one path:

**Option A — AI Gateway (the default).** Provide one of:

- **Link a Vercel project** — the gateway authenticates via OIDC, no key to manage
  (easiest on Vercel; run `vercel link` locally).
- **`AI_GATEWAY_API_KEY`** — a gateway key from
  [vercel.com/dashboard/ai/api-keys](https://vercel.com/dashboard/ai/api-keys).

> ⚠️ **The AI Gateway needs paid credits.** A gateway account with no paid balance
> returns _"Free tier users do not have access to this model"_ at request time — the
> app deploys fine but can't browse until you
> [add credits](https://vercel.com/docs/ai-gateway/pricing). If you'd rather not use
> the gateway, use Option B.

**Option B — call a provider directly (no gateway).** Set the provider's key (e.g.
`ANTHROPIC_API_KEY`) and use a provider-authored model in `agent/agent.ts` — a
one-line change shown in
[CUSTOMIZATION.md → Change the model](./CUSTOMIZATION.md#change-the-model). This skips
the gateway entirely, so no gateway credits are required.

## Example `.env.local`

```bash
BROWSER_USE_API_KEY=bu_your_key_here
AI_GATEWAY_API_KEY=your_gateway_key_here
```

## Notes

- `.env.local` is gitignored — never commit secrets.
- A cloud browser bills until it is stopped or times out; the agent stops it when a
  task completes.
