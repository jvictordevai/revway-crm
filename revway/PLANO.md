# RevWay CRM: plano de implantação

Base: Twenty `v2.62.0` (upstream `twentyhq/twenty`, tag fixada). Produto: RevWay CRM, multi-tenant, em `crm.revway.com.br`, no Fly.io (org `personal`, região `gru`).

Estado em 2026-11-23:
- Repo com snapshot raso do Twenty v2.62.0 na `main` (remote `upstream` = twentyhq, `origin` = jvictordevai/revway-crm). Nada commitado nem enviado por nós ainda.
- Marca RevWay copiada de `revplataform/assets/marca` para `revway/brand/` (SVG oficiais, favicons, PWA, OG, PNG de e-mail).
- flyctl v0.5.15 instalado e autenticado. Apps existentes: `revway-app` (app.revway.com.br), `revway-worker`, `revway-redis`. Nenhum Managed Postgres.
- DNS de revway.com.br na Hostinger. `crm.revway.com.br` hoje já tem A → 66.241.124.160, sem app Fly com certificado para esse nome. Precisa ser reapontado.

---

## 0. Bloqueadores de decisão (resolver antes da Fase 3)

### 0.1 Licença AGPLv3 (obrigatório)
- O Twenty é AGPLv3. Oferecer versão **modificada** a clientes via rede obriga a disponibilizar o código-fonte dessa versão a esses usuários (seção 13).
  - Ação: manter `jvictordevai/revway-crm` público (ou publicar espelho) e colocar link "Código-fonte" em Configurações › Sobre.
  - Manter `LICENSE` e avisos de copyright do Twenty. Trocar a **marca** é permitido e recomendado, porque a licença não cobre a marca "Twenty".
  - Integrações nossas via API/webhook/SDK ficam fora da AGPL (exceção "Twenty Application Exception" no LICENSE). **Regra de arquitetura:** lógica proprietária da RevWay vai em app/serviço externo via API. No fork entra só o branding.

### 0.2 Código Enterprise (commercial license)
- Cerca de 900 arquivos `/* @license Enterprise */` **não** são AGPL: Billing/Stripe, SSO, row-level permissions, access groups, audit logs, custom domains, validation rules, custom roles.
- Com `IS_BILLING_ENABLED=false`, `hasEntitlement` libera tudo tecnicamente. **Usar esses recursos em produção sem licença comercial viola a licença.**
- Decisão necessária (escolher uma):
  - **A (recomendado agora):** operar só com o núcleo AGPL. Nada de SSO, RLS, audit logs ou domínio customizado. Cobrança fica na plataforma RevWay (já existe `lib/server/cobranca`).
  - **B:** negociar licença Enterprise/parceria com a Twenty (contato comercial deles). Libera SSO com a plataforma RevWay, RLS e domínio próprio de cliente.
- Ação técnica em ambos os casos: script de CI que acusa uso de feature enterprise ligada sem `ENTERPRISE_KEY`.

### 0.3 Versão
- v2.62.0 saiu hoje (2026-11-23). As releases são quase diárias. Antes do go-live, fixar a release mais recente com ≥7 dias sem hotfix.

---

## 1. Arquitetura alvo (Fly.io, gru)

```
                 Hostinger DNS
   crm.revway.com.br  ─┐
 *.crm.revway.com.br  ─┼─► Fly app  revway-crm   (imagem própria, target "twenty")
                       │     ├─ process "app"    node dist/main   (2 máquinas, serve front + API)
                       │     └─ process "worker" yarn worker:prod (1–2 máquinas)
                       │     release_command: migrações (upgrade) 1x por deploy
                       │
   rede privada 6PN ───┼─► Fly Managed Postgres  revway-crm-db  (PG 16+)
                       ├─► revway-crm-redis  (Redis 7, volume, maxmemory-policy noeviction)
                       └─► Tigris bucket  revway-crm-files  (STORAGE_TYPE=s3)
   SMTP transacional (Resend/SES) · Sentry · backup pg_dump → Tigris
   Staging: revway-crm-staging (mesma topologia, MPG Developer)
```

Decisões:
- **Um app, dois process groups** (`app`, `worker`), mesma imagem. Worker com `DISABLE_DB_MIGRATIONS=true` e `DISABLE_CRON_JOBS_REGISTRATION=true`.
- **Migrações fora do boot:** o `entrypoint.sh` roda `upgrade` em todo boot, o que dá corrida com 2+ máquinas. Usar `DISABLE_DB_MIGRATIONS=true` em todos os processos e `[deploy] release_command` com `yarn database:init:prod` (só na 1ª vez) e depois `command:prod upgrade`.
- **Redis dedicado**, sem reaproveitar `revway-redis`. BullMQ exige `noeviction`, e misturar filas com a plataforma é risco. Upstash não recomendado, porque o polling do BullMQ fica caro.
- **Storage Tigris** (`fly storage create`). Assim não há volume local e o app escala horizontalmente.
- **Build no GitHub Actions** (o front pede heap de 8 GB e o builder remoto do Fly pode estourar). Push para `registry.fly.io/revway-crm`, depois `fly deploy --image`.
- Tamanho inicial: `app` 2× shared-cpu-2x 2 GB, `worker` 1× shared-cpu-1x 1–2 GB. Ajustar por métricas.
- MPG produção: plano Basic ou superior, com failover e backups. Developer só no staging.

### 1.1 Domínios e multi-tenant
| Var | Valor |
|---|---|
| `SERVER_URL` / `FRONTEND_URL` | `https://crm.revway.com.br` |
| `IS_MULTIWORKSPACE_ENABLED` | `true`, cada cliente em `<cliente>.crm.revway.com.br` |
| `DEFAULT_SUBDOMAIN` | ver abaixo |
| `IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS` | `true` (a RevWay provisiona clientes, sem self-signup no início) |
| `ADDITIONAL_RESERVED_SUBDOMAINS` | `www,api,admin,app,status,docs,staging` |

- `getBaseUrl()` monta `DEFAULT_SUBDOMAIN.crm.revway.com.br`. Padrão `app` dá login em `app.crm.revway.com.br`. Validar no staging se `DEFAULT_SUBDOMAIN` vazio faz o login ficar em `crm.revway.com.br` (preferido). Se não ficar, manter `app` e redirecionar o apex.
- DNS (Hostinger):
  - `crm` e `*.crm`: A/AAAA para os IPs do app (`fly ips allocate-v4` dedicado + v6).
  - `_acme-challenge.crm`: CNAME conforme `fly certs add "*.crm.revway.com.br"` (DNS-01 para o wildcard).
  - `fly certs add crm.revway.com.br`.
- Domínio próprio do cliente (crm.cliente.com.br) depende de Cloudflare for SaaS **e** é código enterprise. Fica para a Fase 7, condicionado à decisão 0.2.

### 1.2 Variáveis (todas via `fly secrets`, nunca no fly.toml)
- Núcleo: `PG_DATABASE_URL` (via `fly mpg attach`, mapear `DATABASE_URL` para `PG_DATABASE_URL`), `REDIS_URL`, `ENCRYPTION_KEY` (`openssl rand -base64 32`, com cofre e procedimento de rotação via `FALLBACK_ENCRYPTION_KEY`).
- Storage: `STORAGE_TYPE=s3`, `STORAGE_S3_{REGION,NAME,ENDPOINT,ACCESS_KEY_ID,SECRET_ACCESS_KEY}`.
- E-mail: `EMAIL_DRIVER=smtp`, `EMAIL_SMTP_*`, `EMAIL_FROM_ADDRESS=crm@revway.com.br`, `EMAIL_FROM_NAME="RevWay CRM"`. Configurar SPF/DKIM/DMARC no domínio.
- Privacidade: `TELEMETRY_ENABLED=false` (o padrão é true e envia para twenty-telemetry.com), `ANALYTICS_ENABLED=false`, `SIGN_IN_PREFILLED=false`, `IS_EMAIL_VERIFICATION_REQUIRED=true`.
- Integrações (Fase 6): `AUTH_GOOGLE_*`, `MESSAGING_PROVIDER_GMAIL_ENABLED`, `CALENDAR_PROVIDER_GOOGLE_ENABLED`, `AUTH_MICROSOFT_*`. Callbacks em `https://crm.revway.com.br/auth/...`.
- Observabilidade: `SENTRY_DSN`, `SENTRY_FRONT_DSN`, `SENTRY_ENVIRONMENT`.
- `TRUST_PROXY` conforme o proxy do Fly.

---

## 2. Estratégia do fork (manter upstream atualizável)
- `main` = Twenty fixado + commits `revway:` pequenos e isolados. Atualização: `git fetch upstream tag twenty/vX` e merge num branch `upgrade/vX`, depois CI, staging e prod. Fetch raso hoje; aprofundar (`git fetch --deepen`/`--unshallow`) antes do 1º merge de upstream.
- Tudo o que é nosso fica em `revway/` (marca, scripts, fly.toml, docs). Edições dentro de `packages/` só onde não há config, listadas em `revway/TOUCHPOINTS.md` (a criar).
- `revway/scripts/check-branding.mjs` (CI): falha se aparecer "Twenty", `twenty.com`, `twentyhq` ou `app.twenty.com` em strings de UI, e-mails, `index.html`, `manifest.json` ou nos `pt-BR.po`. Allowlist para LICENSE, nomes de pacote e código interno. É o guarda contra regressão de marca a cada upgrade.

---

## 3. Branding completo (inventário mapeado)

Quase todo o branding é **hardcoded**. Por env, só remetente de e-mail, chat de suporte, Sentry, telemetria e link de billing.

### 3.1 Front (`packages/twenty-front`)
- `index.html:15-31`: title, description, `og:*`/`twitter:*` (hoje apontam para o social-card do GitHub do Twenty), `theme-color`, favicon. **Não mexer** no marcador `<!-- BEGIN: Twenty Config -->`, que o server substitui por regex (`render-frontend-html.util.ts:20`).
- `public/manifest.json`: name/short_name "RevWay CRM", `theme_color`. Regenerar `public/images/icons/{android,ios,windows11}/` a partir de `revway/brand/svg/RevWay-icone.svg` (script com Sharp em `revway/scripts/icons.mjs`).
- Logo: `public/images/integrations/twenty-logo.svg` (onboarding, app connection, getting started), `modules/auth/components/Logo.tsx:63`, `DefaultWorkspaceLogo.ts:2` (hoje busca em twentyhq.github.io; servir localmente).
- Títulos: `src/utils/title-utils.ts:66`, `NotFound.tsx:45`, `SignInUp.tsx:125` ("Boas-vindas ao RevWay CRM").
- Rodapé de login `FooterNote.tsx:70` + `getTwentyWebsiteUrl.ts:7`: termos e privacidade da RevWay.
- Links externos: `twenty-shared/.../DocumentationBaseUrl.ts` (central de ajuda RevWay ou ocultar), `SettingsCommunity.tsx`, `TwentyTrustCenterUrls.ts`, `TwentyRepositoryUrl.ts` (apontar para o nosso repo, o que atende a AGPL), `CalLink.ts` (agenda RevWay), `useNavigationMenuItemAddOptions.tsx:212`, `SettingsBillingPlanComparisonRows.ts:472`.
- Copy com "Twenty": privacidade, billing toasts, onboarding, MCP setup, timeline. ~50 entradas no catálogo pt-BR do front.
- Ocultar seções sem sentido no white-label: "Community", "Sharing with Twenty", CLI/Developers que citam twenty.com (feature flag via env própria, um patch pequeno).

### 3.2 Design system (`packages/twenty-ui`)
- Acento: reescrever a escala `design-tokens/color/blue.ts` (blue1–12, claro e escuro) com **blue9 = #154BD4** (claro) e **#5C84FF** (escuro), conforme `revplataform/DESIGN.md`. Depois `npx nx generateTokens twenty-ui`. Não editar `theme-*.css` à mão (são gerados).
- Neutros: aproximar `gray` de tinta `#0B1B33` / janela `#FFFFFF` / apoio `#F3F6FB` / linha `#E1E7F1`. Validar contraste WCAG AA nos dois temas.
- Fonte: o DESIGN da RevWay proíbe Inter. Trocar `--t-font-family` (`font.ts`, `theme-light.css:185`) para a pilha do sistema; Familjen Grotesk 600 só em display.
- Efeito colateral: a cor de tag "blue" muda junto. Aceitável. Se não for, criar escala `brand` e repontar `accent.ts`/`mainColors.ts:44`, mas ~100 arquivos usam `color.blue*` direto.

### 3.3 E-mails (`packages/twenty-emails`)
- `Logo.tsx:15` (hoje carrega de app.twenty.com): `https://crm.revway.com.br/brand/revway-completa@2x.png`.
- `Footer.tsx` (Twenty PBC, SF/Paris, GitHub): rodapé RevWay. Remover `WhatIsTwenty.tsx`. `BaseHead.tsx:13`.
- Corpo: invite, verificação, password update, clean-suspended (link app.twenty.com), trial.
- `common-style.ts`: cor brand e fonte.
- Server: `"(via Twenty)"` em `workspace-invitation.service.ts:415` e `approved-access-domain.service.ts:128`. Assuntos em `email-verification.service.ts:107` e `workspace-invitation.service.ts:410`.

### 3.4 Server (`packages/twenty-server`)
- `oauth-discovery` (`client_name 'Twenty'`), `well-known/build-mcp-server-card`, `open-api/base-schema.util.ts:163`, `search-help-center-tool.ts`, `prefill-workflows.util.ts:474`, `compute-my-first-dashboard-widgets.util.ts:141`.
- Prompts de IA (`metadata-modules/ai/*/constants`): assistente se apresenta como RevWay.
- `dpa-template.constant.ts`: DPA da RevWay (validar com o jurídico) ou ocultar.
- `ALLOW_REQUESTS_TO_TWENTY_ICONS`: avaliar `false` (privacidade, evita chamadas a serviço Twenty).

### 3.5 Idioma pt-BR padrão
- O catálogo pt-BR já existe e está quase completo (front 6.169 msgids, 4 pendentes).
- Padrão pt-BR: `user.entity.ts:92` e `compute-workspace-member-standard-flat-field-metadata.util.ts:279` (`'en'` → `'pt-BR'`). Front `initialI18nActivate.ts:11` com fallback pt-BR. Fuso padrão `America/Sao_Paulo`, moeda BRL.
- Alterar copy em `en` regenera msgids no `lingui:extract`. **Retraduzir manualmente** as msgstr pt-BR afetadas e rodar `lingui:compile`.

---

## 4. Testes (gate de cada fase)
- Unit: script de marca, util de URLs RevWay, defaults de locale.
- **E2E Playwright** (`packages/twenty-e2e-testing`) contra staging real:
  1. login em `crm.revway.com.br` sem "Twenty" visível, com logo, título e favicon RevWay;
  2. admin cria workspace `acme` e o login acontece em `acme.crm.revway.com.br`;
  3. convite por e-mail chega via SMTP real com marca RevWay (caixa de teste);
  4. upload de anexo grava no Tigris e baixa de volta;
  5. job de worker roda (ex.: import CSV);
  6. UI em pt-BR por padrão para usuário novo.
- Isolamento multi-tenant: usuário do workspace A não acessa dados nem subdomínio de B.
- Falhas: Redis ou S3 fora do ar devem dar erro visível, nunca lista vazia silenciosa.

---

## 5. Fases e entregáveis

| Fase | Entrega | Critério de pronto |
|---|---|---|
| **0. Decisões** | Respostas para 0.1 (repo público?), 0.2 (A ou B), provedor SMTP, plano MPG | Decisões registradas aqui |
| **1. Base local** | `yarn` + `docker compose` (packages/twenty-docker) rodando local; `revway/TOUCHPOINTS.md` | App sobe em localhost |
| **2. Branding** | Seções 3.1–3.5 + `check-branding.mjs` + ícones gerados | `check-branding` verde; revisão visual claro/escuro, desktop e 390 px |
| **3. Infra staging** | `revway-crm-staging`: MPG Developer, Redis, Tigris, secrets, `revway/fly/fly.staging.toml`, Dockerfile próprio (target `twenty` + assets RevWay) | Deploy verde, `/healthz` ok, e2e 1–6 verdes em `*.staging` (ou `revway-crm-staging.fly.dev`) |
| **4. CI/CD** | GitHub Actions: lint, typecheck, check-branding, testes, build e push da imagem, deploy staging automático, prod manual com aprovação | PR → staging sem intervenção |
| **5. Produção** | App `revway-crm`, MPG Basic, IPs, certs `crm` + `*.crm`, DNS Hostinger, SPF/DKIM/DMARC, Sentry, backup diário pg_dump → Tigris com **teste de restore** | e2e verdes em prod; restore testado; rollback (`fly deploy --image <anterior>`) ensaiado |
| **6. Integrações** | Google/Microsoft OAuth, Gmail/Calendar sync (verificação de app OAuth do Google), API keys por workspace | Sync funcionando num workspace piloto |
| **7. Produto RevWay** | Provisionamento de cliente a partir da plataforma RevWay (cria workspace + admin via API e cobrança na plataforma), link no hub app.revway.com.br, runbook de onboarding, termos e DPA | 1º cliente piloto ativo |
| **8. Opcional (depende de 0.2-B)** | SSO com a plataforma RevWay, domínio próprio de cliente (Cloudflare for SaaS), RLS e audit logs | Licença comercial assinada |

### Rotina contínua
- Upgrade upstream mensal (ou imediato em CVE): branch `upgrade/vX`, CI com check-branding, staging, e2e, prod.
- Monitorar: Sentry, `fly logs`, uptime externo em `/healthz`, alerta de disco/conexões do MPG, fila do BullMQ.
- Rotação de segredos documentada (`FALLBACK_ENCRYPTION_KEY`).

---

## 6. Riscos
| Risco | Mitigação |
|---|---|
| Uso indevido de código enterprise | Decisão 0.2 + bloqueio no CI |
| MPG sem permissão para extensões/schemas que o `database:init` exige | Validar na Fase 3 (staging) antes de contratar o plano prod; plano B: Postgres do Supabase/Neon |
| Upgrade upstream reintroduz marca Twenty | `check-branding.mjs` bloqueante |
| Build do front estoura memória | Build no GitHub Actions (runner 16 GB) |
| Wildcard TLS na Hostinger | DNS-01 via CNAME `_acme-challenge`; se travar, migrar a zona `crm` para Cloudflare |
| Migração concorrente em múltiplas máquinas | `release_command` + `DISABLE_DB_MIGRATIONS=true` |
| Telemetria para terceiros | `TELEMETRY_ENABLED=false` testado (sem tráfego para twenty-telemetry.com) |
