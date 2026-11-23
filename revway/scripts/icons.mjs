#!/usr/bin/env node
// Regenerates every PNG under packages/twenty-front/public/images/icons/{android,ios,windows11}
// from revway/brand/svg/RevWay-icone.svg, keeping the exact filenames and pixel sizes
// already present (so upstream manifest.json / index.html references keep working).
// Also copies the web assets served from public/images/revway/.
//
// Usage (repo root, after `yarn install`): node revway/scripts/icons.mjs
import { copyFile, mkdir, readdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BRAND_DIR = path.join(ROOT, 'revway/brand');
const PUBLIC_DIR = path.join(ROOT, 'packages/twenty-front/public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'images/icons');
const ICON_SUBDIRS = ['android', 'ios', 'windows11'];
const SYMBOL_SVG = path.join(BRAND_DIR, 'svg/RevWay-icone.svg');

// Share of the shortest side the symbol occupies (rest is transparent padding).
const SQUARE_SYMBOL_RATIO = 0.84;
const WIDE_SYMBOL_RATIO = 0.6;
const SVG_RENDER_DENSITY = 600;

const renderIcon = async (svgBuffer, width, height) => {
  const isSquare = width === height;
  const ratio = isSquare ? SQUARE_SYMBOL_RATIO : WIDE_SYMBOL_RATIO;
  const symbolSize = Math.max(1, Math.round(Math.min(width, height) * ratio));

  const symbol = await sharp(svgBuffer, { density: SVG_RENDER_DENSITY })
    .resize(symbolSize, symbolSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: symbol, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

const regenerateIcons = async (svgBuffer) => {
  let count = 0;

  for (const subdir of ICON_SUBDIRS) {
    const dir = path.join(ICONS_DIR, subdir);
    const files = (await readdir(dir)).filter((file) => file.endsWith('.png'));

    for (const file of files) {
      const target = path.join(dir, file);
      const { width, height } = await sharp(target).metadata();

      if (!width || !height) {
        throw new Error(`Could not read size of ${target}`);
      }

      const output = await renderIcon(svgBuffer, width, height);

      await sharp(output).toFile(target);
      count += 1;
    }
  }

  return count;
};

const copyWebAssets = async () => {
  const revwayDir = path.join(PUBLIC_DIR, 'images/revway');

  await mkdir(revwayDir, { recursive: true });

  const copies = [
    ['svg/RevWay-icone.svg', 'logo.svg'],
    ['svg/RevWay-icone-nome.svg', 'logo-full.svg'],
    ['png/opengraph-image.png', 'og.png'],
    ['png/revway-completa@2x.png', 'email-logo.png'],
    ['png/icon-512.png', 'workspace-logo.png'],
  ];

  for (const [source, destination] of copies) {
    await copyFile(
      path.join(BRAND_DIR, source),
      path.join(revwayDir, destination),
    );
  }

  return copies.length;
};

const main = async () => {
  const svgBuffer = await readFile(SYMBOL_SVG);
  const iconCount = await regenerateIcons(svgBuffer);
  const assetCount = await copyWebAssets();

  console.log(
    `Regenerated ${iconCount} icons and copied ${assetCount} brand assets.`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
