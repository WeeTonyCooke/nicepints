import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import toIco from 'to-ico';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const brandDir = join(root, 'public', 'brand');
const publicDir = join(root, 'public');

const silhouetteSvg = readFileSync(join(brandDir, 'pint-silhouette.svg'));
const onBlackSvg = readFileSync(join(brandDir, 'icon-on-black.svg'));

async function renderPng(svg, size, outPath, fit = 'contain', background = { r: 0, g: 0, b: 0, alpha: 0 }) {
  await sharp(svg, { density: 512 })
    .resize(size, size, { fit, background })
    .png()
    .toFile(outPath);
}

async function main() {
  writeFileSync(join(publicDir, 'favicon.svg'), silhouetteSvg);

  await renderPng(silhouetteSvg, 16, join(publicDir, 'favicon-16x16.png'));
  await renderPng(silhouetteSvg, 32, join(publicDir, 'favicon-32x32.png'));

  const favicon16 = readFileSync(join(publicDir, 'favicon-16x16.png'));
  const favicon32 = readFileSync(join(publicDir, 'favicon-32x32.png'));
  writeFileSync(join(publicDir, 'favicon.ico'), await toIco([favicon16, favicon32]));

  await renderPng(onBlackSvg, 180, join(publicDir, 'apple-touch-icon.png'), 'contain', { r: 10, g: 10, b: 10, alpha: 1 });
  await renderPng(onBlackSvg, 192, join(publicDir, 'icon-192.png'), 'contain', { r: 10, g: 10, b: 10, alpha: 1 });
  await renderPng(onBlackSvg, 512, join(publicDir, 'icon-512.png'), 'contain', { r: 10, g: 10, b: 10, alpha: 1 });
  await renderPng(onBlackSvg, 1024, join(brandDir, 'app-icon-1024.png'), 'contain', { r: 10, g: 10, b: 10, alpha: 1 });

  writeFileSync(join(publicDir, 'apple-touch-icon.svg'), onBlackSvg);
  writeFileSync(join(publicDir, 'icon.svg'), onBlackSvg);

  console.log('Brand icons generated in public/');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
