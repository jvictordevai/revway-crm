# revway/

Everything specific to RevWay CRM (the white-label of Twenty) lives here. Edits
inside `packages/` are kept minimal and listed in [`TOUCHPOINTS.md`](./TOUCHPOINTS.md),
so upstream merges stay reviewable. The plan is in [`PLANO.md`](./PLANO.md).

| Path | What it is |
|---|---|
| `brand/` | Brand sources (SVG symbol, lockup, wordmark; PNG favicons, OG image, e-mail lockup). |
| `scripts/icons.mjs` | Regenerates every PNG in `packages/twenty-front/public/images/icons/{android,ios,windows11}` from `brand/svg/RevWay-icone.svg` (same filenames and pixel sizes) and copies the web assets to `public/images/revway/`. |
| `scripts/blue-scale.mjs` | Writes `packages/twenty-ui/design-tokens/color/blue.ts` (RevWay blue, blue9 `#154BD4` light / `#5C84FF` dark). |
| `scripts/check-branding.mjs` | Fails when upstream branding (`Twenty`, `twenty.com`, `twentyhq`, `app.twenty`) shows up in user-facing surfaces. |
| `scripts/branding-allowlist.txt` | Justified exceptions for the check (hidden pages, internal identifiers). |
| `TOUCHPOINTS.md` | Every upstream file RevWay modifies, and why. Read it on every upstream merge. |

## Commands (repo root)

Root `package.json` is upstream-owned, so there are no yarn scripts; run the files directly.

```bash
# After an upstream merge, or when brand assets change
node revway/scripts/icons.mjs

# After changing the blue scale, then regenerate the theme (never hand-edit theme-*.css)
node revway/scripts/blue-scale.mjs
npx nx generateTokens twenty-ui

# Branding guard (CI and before every merge to main). Exit 1 with a file:line report.
node revway/scripts/check-branding.mjs
```

`icons.mjs` needs `sharp` from `node_modules` (`yarn install` first). `check-branding.mjs`
has no dependencies.

## check-branding scope

- Full scan (non-comment lines): `twenty-front/src`, `twenty-front/index.html`,
  `twenty-front/public/manifest.json`, `twenty-emails/src`.
- `twenty-server/src`: every lingui message line (`msg\``, `t\``, `msg(`, `i18n._(`), plus full
  scans of AI system prompts, `.well-known` documents, OAuth discovery metadata, the OpenAPI base
  schema and the e-mail sending services.
- `msgstr` values of the three `pt-BR.po` catalogs; an entry is skipped only when every `#:` source
  reference is allowlisted.
- Tests, stories, mocks and code comments are ignored.

Allowlist syntax: `path:<glob>` skips files, `line:<regex>` skips lines. Add an entry only with a
comment explaining why the string is not user-visible.

## After an upstream merge

1. Resolve conflicts in the files listed in `TOUCHPOINTS.md`.
2. `node revway/scripts/icons.mjs` (upstream may have replaced icons).
3. Run `lingui:extract` for twenty-front, twenty-server and twenty-emails, translate any new
   pt-BR `msgstr`, then `lingui:compile`.
4. `node revway/scripts/check-branding.mjs` must pass.

## Open items

- Help center: `DOCUMENTATION_BASE_URL` points to `https://revway.com.br/ajuda`. The site must
  serve or path-preserving redirect `/ajuda/*` (including the `/ajuda/pt/...` locale prefix) to
  the upstream docs until RevWay has its own help pages.
- DPA (Settings > Legal) still uses Twenty's legal template; it is unreachable from the UI and
  allowlisted pending legal review.
