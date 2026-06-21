import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import toIco from 'to-ico';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const brandDir = join(root, 'public', 'brand');
const publicDir = join(root, 'public');

function extractSilhouetteMarkup(svgString) {
  const match = svgString.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  if (!match?.[1]) {
    throw new Error('Could not parse pint-silhouette.svg');
  }
  return match[1].trim();
}

function buildOnBlackSvg(innerMarkup) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Nice Pints">
  <rect width="512" height="512" fill="#0A0A0A"/>
  <g transform="translate(156 56) scale(2)">
    ${innerMarkup}
  </g>
</svg>`;
}

async function renderPng(svg, size, outPath, fit = 'contain', background = { r: 0, g: 0, b: 0, alpha: 0 }) {
  const input = Buffer.isBuffer(svg) ? svg : Buffer.from(svg);
  await sharp(input, { density: 512 })
    .resize(size, size, { fit, background })
    .png()
    .toFile(outPath);
}

async function main() {
  const silhouetteSvg = readFileSync(join(brandDir, 'pint-silhouette.svg'), 'utf8');
  const innerMarkup = extractSilhouetteMarkup(silhouetteSvg);
  const onBlackSvg = buildOnBlackSvg(innerMarkup);

  writeFileSync(join(brandDir, 'icon-on-black.svg'), onBlackSvg);
  writeFileSync(join(publicDir, 'favicon.svg'), silhouetteSvg);

  await renderPng(silhouetteSvg, 16, join(publicDir, 'favicon-16x16.png'));
  await renderPng(silhouetteSvg, 32, join(publicDir, 'favicon-32x32.png'));

  const favicon16 = readFileSync(join(publicDir, 'favicon-16x16.png'));
  const favicon32 = readFileSync(join(publicDir, 'favicon-32x32.png'));
  writeFileSync(join(publicDir, 'favicon.ico'), await toIco([favicon16, favicon32]));

  const blackBackground = { r: 10, g: 10, b: 10, alpha: 1 };
  await renderPng(onBlackSvg, 180, join(publicDir, 'apple-touch-icon.png'), 'contain', blackBackground);
  await renderPng(onBlackSvg, 192, join(publicDir, 'icon-192.png'), 'contain', blackBackground);
  await renderPng(onBlackSvg, 512, join(publicDir, 'icon-512.png'), 'contain', blackBackground);
  await renderPng(onBlackSvg, 1024, join(brandDir, 'app-icon-1024.png'), 'contain', blackBackground);

  writeFileSync(join(publicDir, 'apple-touch-icon.svg'), onBlackSvg);
  writeFileSync(join(publicDir, 'icon.svg'), onBlackSvg);

  console.log('Brand icons generated from public/brand/pint-silhouette.svg');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
