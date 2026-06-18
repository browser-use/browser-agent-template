# Contributing to Browser Agent Template

Thank you for your interest in contributing!

## Reporting Bugs

- Search [existing issues](https://github.com/browser-use/browser-agent-template/issues) before opening a new one
- Include steps to reproduce, expected behavior, and actual behavior
- Include your environment (Node version, OS, browser)
- Use the [bug report template](https://github.com/browser-use/browser-agent-template/issues/new?template=bug-report.yml)

## Suggesting Features

- Open a [feature request](https://github.com/browser-use/browser-agent-template/issues/new?template=feature-request.yml)
- Describe the use case and why it would be valuable for a **template** (reusable by many forks)
- If possible, outline a proposed implementation

## Development Setup

```bash
git clone https://github.com/browser-use/browser-agent-template.git
cd browser-agent-template

npm install
cp .env.example .env.local
npm run dev
```

Set real values in `.env.local`. Never commit secrets.

## Project Structure

```
browser-agent-template/
├── agent/          # Eve agent: channels, tools, skills, sandbox
├── app/            # Next.js UI (chat + live browser panel)
├── components/     # UI components (ai-elements + shadcn/ui)
├── lib/            # Shared utilities
└── docs/           # Documentation (architecture, env, customization)
```

## Making Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Make your changes
4. Run checks:
   ```bash
   npm run typecheck
   ```
5. Commit with a [Conventional Commits](https://www.conventionalcommits.org/) message
6. Open a pull request

## Pull Request Process

1. Ensure `npm run typecheck` passes
2. Update documentation if your change affects user-facing behavior
3. Add a clear description of what changed and why
4. Link related issues when applicable

PR titles must follow Conventional Commits (enforced by CI). Scopes: `app`, `agent`, `docs`, `deps`.

## Customizing the Template

If you are forking for your own agent (not contributing upstream), see [docs/CUSTOMIZATION.md](./docs/CUSTOMIZATION.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
