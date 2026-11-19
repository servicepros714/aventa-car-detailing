// Runs after `vite build` + the SSR build (see package.json "build").
// Writes one HTML file per route with its own <head> tags and, for marketing
// pages, the fully rendered page, then writes sitemap.xml.
//
// Cloudflare Pages serves dist/foo.html at /foo, so every route stays
// extensionless with no trailing slash, matching the canonical URLs.
// dist/404.html (the NotFound page) is served with a 404 status for unknown URLs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const serverEntry = path.join(root, 'dist-ssr', 'entry-server.js');

const { render, ROUTES, pageMeta, headTags, SITE_URL } = await import(pathToFileURL(serverEntry).href);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf-8');
const SEO_BLOCK = /<!--seo-->[\s\S]*?<!--\/seo-->/;
if (!SEO_BLOCK.test(template)) throw new Error('index.html is missing the <!--seo--> … <!--/seo--> block');
if (!template.includes('<div id="root"></div>')) throw new Error('index.html is missing <div id="root"></div>');

const problems = [];
const seenTitles = new Map();
for (const route of ROUTES) {
  const meta = pageMeta(route.path);
  if (meta.title.length > 60) problems.push(`${route.path}: title is ${meta.title.length} chars (max 60)`);
  if (meta.description.length > 160) problems.push(`${route.path}: description is ${meta.description.length} chars (max 160)`);
  if (seenTitles.has(meta.title)) problems.push(`${route.path}: same title as ${seenTitles.get(meta.title)}`);
  seenTitles.set(meta.title, route.path);

  let html = template.replace(SEO_BLOCK, headTags(meta));
  if (route.ssr) html = html.replace('<div id="root"></div>', `<div id="root">${render(route.path)}</div>`);

  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`;
  fs.writeFileSync(path.join(dist, file), html);
  console.log(`  prerendered ${route.path.padEnd(40)} → dist/${file}${route.ssr ? '' : ' (head only)'}`);
}

const today = new Date().toISOString().slice(0, 10);
const urls = ROUTES.filter((r) => r.sitemap).map((r) => [
  '  <url>',
  `    <loc>${SITE_URL}${r.path}</loc>`,
  `    <lastmod>${today}</lastmod>`,
  `    <priority>${r.priority}</priority>`,
  '  </url>',
].join('\n'));
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
);
console.log(`  wrote dist/sitemap.xml (${urls.length} URLs)`);

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });

if (problems.length) {
  console.error('\nSEO check failed:\n  ' + problems.join('\n  '));
  process.exit(1);
}
