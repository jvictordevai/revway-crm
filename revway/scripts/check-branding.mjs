#!/usr/bin/env node
// RevWay branding guard: fails when upstream Twenty branding leaks into
// user-facing surfaces (front, emails, server user-facing strings, pt-BR catalogs).
//
// Usage (repo root): node revway/scripts/check-branding.mjs
// Allowlist: revway/scripts/branding-allowlist.txt
//   path:<glob>   skip every file matching the glob (repo-relative, ** and * supported)
//   line:<regex>  skip any source line (or .po msgstr) matching the regex
//   # comment
// Exit code 1 with a file:line report when something is found. No dependencies.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ALLOWLIST_FILE = path.join(ROOT, 'revway/scripts/branding-allowlist.txt');
const BRAND_PATTERN = /\bTwenty\b|twenty\.com|twentyhq|app\.twenty/;
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);
const SKIPPED_DIRECTORIES = new Set(['node_modules', 'dist', 'build', '.nx']);

// Files scanned in full (every non-comment line).
const FULL_SCAN_TARGETS = [
  { dir: 'packages/twenty-front/src', skip: [/\/locales\//] },
  { dir: 'packages/twenty-emails/src', skip: [/\/locales\//] },
  { file: 'packages/twenty-front/index.html' },
  { file: 'packages/twenty-front/public/manifest.json' },
];

// Server: only user-facing strings. Every lingui message line, plus these
// files in full (system prompts, discovery documents, email senders).
const SERVER_DIR = 'packages/twenty-server/src';
const SERVER_I18N_LINE = /\bmsg`|\bt`|\bmsg\(|\bi18n\._\(/;
const SERVER_FULL_SCAN_GLOBS = [
  'packages/twenty-server/src/engine/metadata-modules/ai/*/constants/*prompt*.ts',
  'packages/twenty-server/src/engine/core-modules/well-known/utils/*.ts',
  'packages/twenty-server/src/engine/core-modules/application/connection-provider/oauth-discovery/utils/*.ts',
  'packages/twenty-server/src/engine/core-modules/open-api/utils/base-schema.util.ts',
  'packages/twenty-server/src/engine/core-modules/workspace-invitation/services/*.ts',
  'packages/twenty-server/src/engine/core-modules/approved-access-domain/services/*.ts',
  'packages/twenty-server/src/engine/core-modules/email-verification/services/*.ts',
];

const PT_BR_CATALOGS = [
  'packages/twenty-front/src/locales/pt-BR.po',
  'packages/twenty-emails/src/locales/pt-BR.po',
  'packages/twenty-server/src/engine/core-modules/i18n/locales/pt-BR.po',
];

// Test and story files never ship to users.
const ALWAYS_SKIPPED_FILES = [
  /\/__tests__\//,
  /\/__stories__\//,
  /\/__mocks__\//,
  /\.(test|spec|stories)\.[jt]sx?$/,
  /\/testing\//,
];

const escapeRegex = (text) => text.replace(/[.+^${}()|[\]\\]/g, '\\$&');

const globToRegex = (glob) =>
  new RegExp(
    `^${glob
      .split('**')
      .map((part) =>
        part
          .split('*')
          .map((piece) => escapeRegex(piece).replace(/\?/g, '[^/]'))
          .join('[^/]*'),
      )
      .join('.*')}$`,
  );

const loadAllowlist = () => {
  const pathRules = [];
  const lineRules = [];

  if (!existsSync(ALLOWLIST_FILE)) {
    return { pathRules, lineRules };
  }

  for (const rawLine of readFileSync(ALLOWLIST_FILE, 'utf8').split('\n')) {
    const line = rawLine.trim();

    if (line === '' || line.startsWith('#')) continue;

    if (line.startsWith('path:')) {
      pathRules.push(globToRegex(line.slice('path:'.length).trim()));
    } else if (line.startsWith('line:')) {
      lineRules.push(new RegExp(line.slice('line:'.length).trim()));
    } else {
      throw new Error(`Invalid allowlist entry (use path: or line:): ${line}`);
    }
  }

  return { pathRules, lineRules };
};

const walk = (directory) => {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (SKIPPED_DIRECTORIES.has(entry.name)) continue;

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
};

const toRepoPath = (fullPath) =>
  path.relative(ROOT, fullPath).split(path.sep).join('/');

// Drops comment-only lines and trailing `// ...` comments (keeps `https://`).
const stripComment = (line) => {
  const trimmed = line.trim();

  if (
    trimmed.startsWith('//') ||
    trimmed.startsWith('*') ||
    trimmed.startsWith('/*') ||
    trimmed.startsWith('{/*') ||
    trimmed.startsWith('<!--')
  ) {
    return '';
  }

  return line.replace(/(^|\s)\/\/.*$/, '$1');
};

const createChecker = ({ pathRules, lineRules }) => {
  const findings = [];

  const isPathAllowed = (repoPath) =>
    ALWAYS_SKIPPED_FILES.some((rule) => rule.test(`/${repoPath}`)) ||
    pathRules.some((rule) => rule.test(repoPath));

  const isLineAllowed = (text) => lineRules.some((rule) => rule.test(text));

  const scanLines = (repoPath, content, shouldScanLine = () => true) => {
    content.split('\n').forEach((line, index) => {
      if (!shouldScanLine(line)) return;

      const code = stripComment(line);

      if (BRAND_PATTERN.test(code) && !isLineAllowed(line)) {
        findings.push(`${repoPath}:${index + 1}: ${line.trim().slice(0, 160)}`);
      }
    });
  };

  const scanFile = (fullPath, shouldScanLine) => {
    const repoPath = toRepoPath(fullPath);

    if (isPathAllowed(repoPath)) return;

    scanLines(repoPath, readFileSync(fullPath, 'utf8'), shouldScanLine);
  };

  // A .po entry is ignored when every source reference is allowlisted.
  const scanCatalog = (repoPath) => {
    const fullPath = path.join(ROOT, repoPath);

    if (!existsSync(fullPath)) {
      findings.push(`${repoPath}:0: catalog not found`);
      return;
    }

    const lines = readFileSync(fullPath, 'utf8').split('\n');
    let references = [];
    let inMsgstr = false;

    lines.forEach((line, index) => {
      if (line.startsWith('#: ')) {
        references.push(line.slice(3).trim());
        inMsgstr = false;
        return;
      }

      if (line.startsWith('msgstr ')) {
        inMsgstr = true;
      } else if (!line.startsWith('"')) {
        inMsgstr = false;
      }

      if (line.trim() === '') {
        references = [];
        return;
      }

      if (!inMsgstr || !BRAND_PATTERN.test(line) || isLineAllowed(line)) {
        return;
      }

      const packageRoot = repoPath.slice(0, repoPath.indexOf('/src/'));
      const allReferencesAllowed =
        references.length > 0 &&
        references.every((reference) =>
          isPathAllowed(`${packageRoot}/${reference}`),
        );

      if (!allReferencesAllowed) {
        findings.push(`${repoPath}:${index + 1}: ${line.trim().slice(0, 160)}`);
      }
    });
  };

  return { findings, scanFile, scanCatalog };
};

const main = () => {
  const checker = createChecker(loadAllowlist());

  for (const target of FULL_SCAN_TARGETS) {
    if (target.file) {
      checker.scanFile(path.join(ROOT, target.file));
      continue;
    }

    for (const file of walk(path.join(ROOT, target.dir))) {
      if (target.skip.some((rule) => rule.test(toRepoPath(file)))) continue;

      checker.scanFile(file);
    }
  }

  const serverFullScan = SERVER_FULL_SCAN_GLOBS.map(globToRegex);

  for (const file of walk(path.join(ROOT, SERVER_DIR))) {
    const repoPath = toRepoPath(file);
    const isFullScan = serverFullScan.some((rule) => rule.test(repoPath));

    checker.scanFile(
      file,
      isFullScan ? undefined : (line) => SERVER_I18N_LINE.test(line),
    );
  }

  PT_BR_CATALOGS.forEach(checker.scanCatalog);

  if (checker.findings.length > 0) {
    console.error(
      `check-branding: ${checker.findings.length} upstream branding reference(s) found:\n`,
    );
    checker.findings.forEach((finding) => console.error(`  ${finding}`));
    console.error(
      '\nReplace with RevWay branding, or allowlist in revway/scripts/branding-allowlist.txt.',
    );
    process.exit(1);
  }

  console.log('check-branding: OK, no upstream branding in user-facing surfaces.');
};

if (!statSync(ROOT).isDirectory()) {
  throw new Error(`Repository root not found: ${ROOT}`);
}

main();
