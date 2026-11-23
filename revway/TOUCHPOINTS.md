# Upstream touchpoints

Every upstream file RevWay modifies, one line each. On an upstream merge, re-check each entry,
then run `node revway/scripts/check-branding.mjs`. Added files under
`packages/twenty-front/public/images/revway/` are RevWay-owned and not listed.

## Regenerated (re-run the generator, do not merge by hand)

- `packages/twenty-front/public/images/icons/{android,ios,windows11}/*.png` (112 files): RevWay symbol, same names/sizes; `node revway/scripts/icons.mjs`.
- `packages/twenty-ui/design-tokens/color/blue.ts`: RevWay blue scale; `node revway/scripts/blue-scale.mjs`.
- `packages/twenty-ui/src/theme/{theme-light.css,theme-dark.css,constants/ThemeLight.ts,constants/ThemeDark.ts,constants/ThemeCommon.ts}`: output of `npx nx generateTokens twenty-ui` (blue scale + font).
- `packages/*/locales/*.po` and `locales/generated/*.ts` (front, server, emails, all locales): `lingui:extract` + `lingui:compile` after msgid changes; pt-BR `msgstr` hand-translated.

## twenty-front

- `index.html`: title, pt-BR description, OG/Twitter tags to `/images/revway/og.png`, theme-color `#154BD4`, `lang="pt-BR"`, favicon type png. Config marker untouched.
- `public/manifest.json`: name "RevWay CRM", short_name "RevWay", theme_color.
- `src/index.css`: body font uses `--t-font-family` (system stack) instead of Inter.
- `src/utils/title-utils.ts`: default page title "RevWay CRM".
- `src/utils/i18n/initialI18nActivate.ts`: fallback UI locale pt-BR.
- `src/pages/not-found/NotFound.tsx`: page title "| RevWay CRM".
- `src/pages/auth/SignInUp.tsx`: "Welcome to RevWay CRM".
- `src/modules/auth/sign-in-up/components/FooterNote.tsx`: "By using RevWay CRM".
- `src/modules/auth/utils/getTwentyWebsiteUrl.ts`: terms/privacy go to revway.com.br/termos and /privacidade.
- `src/modules/ui/navigation/navigation-drawer/constants/DefaultWorkspaceLogo.ts`: local RevWay workspace logo.
- `src/modules/applications/components/AppConnectionHeader.tsx`: RevWay logo asset.
- `src/modules/getting-started/components/GettingStartedBookCallSummary.tsx`: RevWay logo; "RevWay team".
- `src/modules/getting-started/components/step-preview/GettingStartedImportPreview.tsx`: RevWay logo; "RevWay CRM fields".
- `src/modules/onboarding/components/OnboardingHeader.tsx`: RevWay logo asset.
- `src/modules/onboarding/components/OnboardingPulsingLogo.tsx`: RevWay logo asset.
- `src/modules/onboarding/components/import-contacts/OnboardingImportPreviewSyncBadge.tsx`: RevWay logo asset.
- `src/modules/onboarding/constants/CalLink.ts`: "Book a call" fallback goes to mailto suporte@revway.com.br.
- `src/modules/onboarding/components/OnboardingInviteTeamSkipDialog.tsx`: copy "RevWay CRM".
- `src/pages/onboarding/SyncEmails.tsx`: copy "RevWay CRM".
- `src/modules/getting-started/components/GettingStartedKeepPlanButton.tsx`: "Keep RevWay CRM".
- `src/modules/getting-started/constants/GettingStartedImportPrompt.ts`: AI import prompt names RevWay CRM.
- `src/modules/settings/hooks/useSettingsNavigationItems.tsx`: Community item hidden; new "Source code" item (AGPL section 13) to the RevWay repo.
- `src/modules/settings/privacy/constants/TwentyRepositoryUrl.ts`: RevWay GitHub repository.
- `src/modules/settings/privacy/components/SettingsPrivacy.tsx`: Twenty Cloud safeguards section not rendered.
- `src/modules/settings/privacy/components/SettingsPrivacySharingWithTwenty.tsx`: "Sharing with RevWay" copy (keeps support-access switch).
- `src/modules/settings/experience/components/SettingsExperienceNotificationsSection.tsx`: copy "RevWay CRM".
- `src/modules/settings/workspace/components/ClickTrackingSwitch.tsx`: copy "RevWay CRM".
- `src/modules/settings/mcp/constants/McpSetup.ts`: MCP server display name "RevWay CRM".
- `src/modules/settings/mcp/utils/mcpSetup.ts`: copy "RevWay CRM".
- `src/modules/settings/mcp/utils/buildMcpSetupCategories.tsx`: copy "RevWay CRM"; Twenty Cloud ChatGPT app card removed.
- `src/modules/settings/applications/components/SettingsApplicationIframeMediaPermissionsSection.tsx`: copy "RevWay CRM".
- `src/modules/settings/billing/constants/SettingsBillingPlanComparisonRows.ts`: subdomain example `yourco.crm.revway.com.br`.
- `src/modules/settings/billing/components/SettingsBillingPartnerCodeForm.tsx`: "RevWay partner".
- `src/modules/settings/billing/components/AddPaymentMethodForm.tsx`: "contact RevWay support".
- `src/modules/settings/billing/hooks/useBillingPortalSession.ts`: "contact RevWay support".
- `src/modules/settings/billing/hooks/useEndSubscriptionTrialPeriod.ts`: "contact RevWay support".
- `src/modules/settings/billing/hooks/useHandleCheckoutSession.ts`: "contact RevWay support".
- `src/modules/settings/billing/hooks/useSubmitSubscriptionPayment.ts`: "contact RevWay support".
- `src/modules/settings/data-model/constants/SettingsCompositeFieldTypeConfigs.ts`: example emails/links on revway.com.br.
- `src/modules/marketplace/components/SettingsApplicationInstallPermissionValidationModal.tsx`: "reviewed by RevWay".
- `src/pages/settings/applications/SettingsAvailableApplicationDetails.tsx`: "reviewed by RevWay".
- `src/pages/settings/applications/tabs/SettingsApplicationsAvailableTab.tsx`: "reviewed by RevWay".
- `src/modules/applications/components/AuthorizeClientIdentityNotice.tsx`: copy "RevWay CRM".
- `src/modules/applications/utils/getStandardApplicationDescription.ts`: copy "RevWay CRM".
- `src/modules/applications/utils/getStandardApplicationReadme.ts`: copy "RevWay CRM".
- `src/modules/applications/utils/getCustomApplicationReadme.ts`: copy "RevWay CRM".
- `src/modules/activities/timeline-activities/utils/getTimelineActivityAuthorFullName.ts`: system author "RevWay CRM".
- `src/modules/navigation-menu-item/edit/hooks/useNavigationMenuItemAddOptions.tsx`: default new link is RevWay site.
- `src/modules/spreadsheet-import/steps/components/MatchColumnsStep/components/ColumnGrid.tsx`: "RevWay CRM fields".
- `src/modules/workflow/workflow-steps/workflow-actions/form-action/components/WorkflowEditActionFormBuilder.tsx`: "Learn more" to RevWay help center.
- `src/pages/settings/ai/components/SettingsAiModelsTab.tsx`: copy "RevWay CRM".
- `src/pages/settings/ai/components/SettingsAiModelTiersPreview.tsx`: copy "RevWay CRM".
- `src/pages/settings/communications/SettingsWorkspaceCommunicationGroupChannelDetail.tsx`: copy "RevWay CRM".
- `src/pages/settings/developers/tabs/SettingsDevelopersCliTab.tsx`: CLI reference link to the RevWay repo.
- Tests/stories updated to the new copy: `utils/__tests__/title-utils.test.ts`, `activities/.../__tests__/getTimelineActivityAuthorFullName.test.ts`, `auth/utils/__tests__/getTwentyWebsiteUrl.test.ts`, `settings/hooks/__tests__/useSettingsNavigationItems.test.tsx`, `settings/mcp/utils/__tests__/mcpSetup.test.ts`, `settings/privacy/components/__tests__/SettingsPrivacy.test.tsx`, `pages/settings/applications/__tests__/SettingsAvailableApplicationDetails.test.tsx`, `pages/settings/applications/tabs/__tests__/SettingsApplicationsAvailableTab.test.tsx`, `getting-started/components/__stories__/GettingStartedSidebarCard.stories.tsx`, `onboarding/components/__stories__/OnboardingSkipDialog.stories.tsx`, `pages/auth/__stories__/Authorize.stories.tsx`.

## twenty-shared

- `src/constants/DocumentationBaseUrl.ts`: help center base `https://revway.com.br/ajuda` (site must redirect paths to upstream docs).

## twenty-ui

- `design-tokens/font.ts`: font family token is the system stack (DM Mono kept for code).

## twenty-emails

- `src/components/Logo.tsx`: RevWay lockup from crm.revway.com.br, 130x28.
- `src/components/Footer.tsx`: RevWay footer (site, support e-mail, source code link).
- `src/components/WhatIsTwenty.tsx`: deleted (Twenty pitch block).
- `src/components/BaseHead.tsx`: document title "RevWay CRM email".
- `src/common-style.ts`: link blue `#154BD4`, CTA button ink `#0B1B33`.
- `src/constants/DefaultWorkspaceLogo.ts`: RevWay workspace logo URL.
- `src/emails/send-invite-link.email.tsx`: "Join your team on RevWay CRM", WhatIsTwenty removed.
- `src/emails/send-email-verification-link.email.tsx`: copy "RevWay CRM".
- `src/emails/password-update-notify.email.tsx`: "Connect to RevWay CRM".
- `src/emails/clean-suspended-workspace.email.tsx`: copy and restart link to crm.revway.com.br.
- `src/emails/billing-trial-converting.email.tsx`: copy "RevWay CRM".
- `src/emails/{billing-subscription-renewing,billing-trial-ending,password-reset-link,validate-approved-access-domain,warn-suspended-workspace}.email.tsx`: preview-only URLs on crm.revway.com.br.

## twenty-server

- `src/engine/core-modules/workspace-invitation/services/workspace-invitation.service.ts`: sender "(via RevWay CRM)"; subject.
- `src/engine/core-modules/approved-access-domain/services/approved-access-domain.service.ts`: sender "(via RevWay CRM)".
- `src/engine/core-modules/email-verification/services/email-verification.service.ts`: welcome subject.
- `src/engine/core-modules/billing/reminders/services/billing-reminder.service.ts`: reminder subjects.
- `src/engine/core-modules/billing/billing.exception.ts`: partner code message.
- `src/engine/core-modules/application/application.exception.ts`: server version message.
- `src/engine/core-modules/application/application-registration/application-registration.exception.ts`: server version message.
- `src/engine/core-modules/getting-started/constants/getting-started-step-content.constant.ts`: step copy.
- `src/engine/metadata-modules/index-metadata/services/index-metadata.service.ts`: system index message.
- `src/engine/api/common/common-args-processors/data-arg-processor/validator-utils/validate-links-field-or-throw.util.ts`: domain example revway.com.br.
- `src/engine/core-modules/application/connection-provider/oauth-discovery/utils/build-oauth-discovery-client-metadata.util.ts`: client_name "RevWay CRM", client_uri revway.com.br.
- `src/engine/core-modules/well-known/utils/build-mcp-server-card.util.ts`: MCP server card identity, site and repo.
- `src/engine/core-modules/open-api/utils/base-schema.util.ts`: API title, contact, license, terms and external docs.
- `src/engine/metadata-modules/ai/ai-chat/constants/chat-system-prompts.const.ts`: assistant identity "RevWay CRM".
- `src/engine/metadata-modules/ai/ai-chat/constants/workspace-setup-system-prompt.constant.ts`: assistant identity "RevWay CRM".
- `src/engine/metadata-modules/ai/ai-chat/constants/workspace-setup-alternative-system-prompt.constant.ts`: assistant identity "RevWay CRM".
- `src/engine/metadata-modules/ai/ai-agent/constants/agent-run-base-system-prompt.const.ts`: agent identity "RevWay CRM".
- `src/engine/metadata-modules/ai/ai-agent-trigger/constants/agent-trigger-base-system-prompt.const.ts`: agent identity "RevWay CRM".
- `src/engine/core-modules/user/user.entity.ts`: column default locale pt-BR (DB default only changes via a migration; sign-up sets it explicitly).
- `src/engine/core-modules/auth/services/sign-in-up.service.ts`: sign-up locale fallback pt-BR.
- `src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-workspace-member-standard-flat-field-metadata.util.ts`: workspace member locale default pt-BR.
- `src/engine/workspace-manager/twenty-standard-application/utils/page-layout-widget/compute-my-first-dashboard-widgets.util.ts`: "our documentation" link to RevWay help center.
- `src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-workflows.util.ts`: sample workflow output URL revway.com.br.
- Specs updated: `well-known/utils/__tests__/build-mcp-server-card.util.spec.ts`, `well-known/utils/__tests__/build-api-catalog.util.spec.ts`, `ai/ai-chat/utils/__tests__/build-full-system-prompt.util.spec.ts`, `ai/ai-chat/constants/__tests__/workspace-setup-system-prompt.constant.spec.ts`.
