# Environment Variables

Copy `.env.example` to `.env.local` and fill these in. On Vercel, set them in your
project's **Settings → Environment Variables**.

## Required

### `BROWSER_USE_API_KEY`

Your [Browser Use](https://browser-use.com) cloud key (`bu_...`). Used server-side to
provision and tear down cloud browsers. Never exposed to the model or the sandbox.
Get one at [browser-use.com](https://browser-use.com).

### A model credential

The agent's model (`anthropic/claude-opus-4.8`) routes through the
[Vercel AI Gateway](https://vercel.com/docs/ai-gateway). Provide **one** of:

- **Link a Vercel project** — the gateway authenticates via OIDC, no key to manage
  (easiest on Vercel; run `vercel link` locally).
- **`AI_GATEWAY_API_KEY`** — a gateway key from
  [vercel.com/dashboard/ai/api-keys](https://vercel.com/dashboard/ai/api-keys).

To call a provider directly instead of the gateway, set that provider's key and use
a provider-authored model in `agent/agent.ts` (see
[CUSTOMIZATION.md](./CUSTOMIZATION.md#change-the-model)).

## Example `.env.local`

```bash
BROWSER_USE_API_KEY=bu_your_key_here
AI_GATEWAY_API_KEY=your_gateway_key_here
```

## Notes

- `.env.local` is gitignored — never commit secrets.
- A cloud browser bills until it is stopped or times out; the agent stops it when a
  task completes.
