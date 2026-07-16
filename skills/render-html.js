#!/usr/bin/env node
// render-html.js — produce a fully self-contained HTML file
// Usage: node render-html.js <source.html> [output-base-dir]
//   output-base-dir: directory where rendered/ will be created (defaults to source dir)

'use strict';
const fs   = require('fs');
const path = require('path');
const https = require('https');
const http  = require('http');

const srcArg  = process.argv[2];
const baseArg = process.argv[3];
if (!srcArg) { console.error('Usage: node render-html.js <source.html> [output-base-dir]'); process.exit(1); }

const srcPath = path.resolve(srcArg);
const srcDir  = path.dirname(srcPath);
const outBase = baseArg ? path.resolve(baseArg) : srcDir;
const outDir  = path.join(outBase, 'rendered');
const outPath = path.join(outDir, path.basename(srcPath));

if (path.resolve(outPath) === path.resolve(srcPath)) {
  console.error('Output path would overwrite source — provide a different output-base-dir');
  process.exit(1);
}

// ── Network helpers ─────────────────────────────────────────────────────────

function fetch(url, binary) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { headers: { 'User-Agent': 'render-html/1.0' } }, res => {
      const loc = res.headers.location;
      if ((res.statusCode === 301 || res.statusCode === 302) && loc) {
        return fetch(loc, binary).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        resolve(binary ? buf : buf.toString('utf8'));
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

// ── MIME types ───────────────────────────────────────────────────────────────

const MIME = {
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.js': 'text/javascript', '.css': 'text/css',
};

function extOf(ref) {
  try { return path.extname(new URL(ref).pathname).toLowerCase(); } catch { return path.extname(ref).toLowerCase(); }
}

function mimeOf(ref) { return MIME[extOf(ref)] || 'application/octet-stream'; }

function escapeForRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// ── Resource resolution ──────────────────────────────────────────────────────

async function toDataURI(ref, baseDir) {
  if (!ref || ref.startsWith('data:') || ref.startsWith('#')) return ref;
  let buf;
  try {
    if (/^https?:\/\//.test(ref)) {
      buf = await fetch(ref, true);
    } else {
      const p = path.resolve(baseDir, ref);
      if (!fs.existsSync(p)) { console.warn(`  ! Not found: ${p}`); return ref; }
      buf = fs.readFileSync(p);
    }
  } catch (e) {
    console.warn(`  ! Failed to resolve ${ref}: ${e.message}`);
    return ref;
  }
  return `data:${mimeOf(ref)};base64,${buf.toString('base64')}`;
}

// Replace all url() references in a CSS string with data URIs.
// baseDir is a filesystem path (for local refs) or '' (skip local, only absolute URLs).
async function inlineURLsInCSS(css, baseDir) {
  const refs = new Set();
  css.replace(/url\(\s*['"]?([^'")\s]+)['"]?\s*\)/g, (_, ref) => {
    if (!ref.startsWith('data:') && !ref.startsWith('#')) refs.add(ref);
  });
  for (const ref of refs) {
    // For relative refs, only resolve when we have a real baseDir
    if (!/^https?:\/\//.test(ref) && !baseDir) continue;
    const uri = await toDataURI(ref, baseDir);
    if (uri === ref) continue;
    // Replace all forms: url(ref), url('ref'), url("ref")
    css = css.replace(new RegExp(`url\\(\\s*['"]?${escapeForRegex(ref)}['"]?\\s*\\)`, 'g'), `url(${uri})`);
  }
  return css;
}

// Fetch a CSS resource and return it with all url() refs inlined.
async function fetchAndInlineCSS(href, baseDir) {
  let css;
  try {
    if (/^https?:\/\//.test(href)) {
      console.log(`  Fetching CSS: ${href}`);
      css = await fetch(href, false);
      // For CDN CSS, inline absolute url() refs; relative refs can't be resolved without knowing the CSS file's origin path
      const cssBase = href.replace(/\/[^/]*$/, ''); // strip filename, keep origin+path
      css = await inlineURLsInCSS(css, cssBase);
    } else {
      const p = path.resolve(baseDir, href);
      if (!fs.existsSync(p)) { console.warn(`  ! CSS not found: ${p}`); return `/* not found: ${href} */`; }
      console.log(`  Reading CSS: ${p}`);
      css = fs.readFileSync(p, 'utf8');
      css = await inlineURLsInCSS(css, path.dirname(p));
    }
  } catch (e) {
    console.warn(`  ! Failed to inline CSS ${href}: ${e.message}`);
    return `/* failed: ${href} */`;
  }
  return css;
}

// ── HTML transformations ─────────────────────────────────────────────────────

// Collect all matches (workaround for no lookbehind in older Node).
function allMatches(re, str) {
  const results = [];
  let m;
  re.lastIndex = 0;
  while ((m = re.exec(str)) !== null) results.push(m);
  return results;
}

async function inlineStylesheets(html) {
  const re = /<link\b([^>]*)\brel=["']stylesheet["']([^>]*)>/gi;
  const matches = allMatches(re, html);
  for (const m of matches) {
    const attrs = m[1] + m[2];
    const hm = attrs.match(/\bhref=["']([^"']+)["']/i);
    if (!hm) continue;
    const css = await fetchAndInlineCSS(hm[1], srcDir);
    html = html.replace(m[0], `<style>\n${css}\n</style>`);
  }
  return html;
}

async function inlineStyleBlocks(html) {
  // Process <style> blocks sequentially — regex with async needs careful handling
  const parts = [];
  const re = /(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi;
  let last = 0, m;
  re.lastIndex = 0;
  while ((m = re.exec(html)) !== null) {
    parts.push(html.slice(last, m.index));
    const inlined = await inlineURLsInCSS(m[2], srcDir);
    parts.push(m[1] + inlined + m[3]);
    last = m.index + m[0].length;
  }
  parts.push(html.slice(last));
  return parts.join('');
}

async function inlineScripts(html) {
  const re = /<script\b([^>]*)\bsrc=["']([^"']+)["']([^>]*)><\/script>/gi;
  const matches = allMatches(re, html);
  for (const m of matches) {
    const src = m[2];
    // Skip module scripts — inlining changes semantics
    if ((m[1] + m[3]).includes('module')) continue;
    let js;
    try {
      if (/^https?:\/\//.test(src)) {
        console.log(`  Fetching JS: ${src}`);
        js = await fetch(src, false);
      } else {
        const p = path.resolve(srcDir, src);
        if (!fs.existsSync(p)) { console.warn(`  ! JS not found: ${p}`); continue; }
        console.log(`  Reading JS: ${p}`);
        js = fs.readFileSync(p, 'utf8');
      }
    } catch (e) {
      console.warn(`  ! Failed to inline script ${src}: ${e.message}`);
      continue;
    }
    html = html.replace(m[0], `<script>\n${js.replace(/<\/script>/gi, '<\\/script>')}\n</script>`);
  }
  return html;
}

async function inlineImages(html) {
  const re = /<img\b([^>]*)\bsrc=["']([^"']+)["']([^>]*)>/gi;
  const matches = allMatches(re, html);
  for (const m of matches) {
    const src = m[2];
    if (src.startsWith('data:')) continue;
    console.log(`  Inlining image: ${src}`);
    const uri = await toDataURI(src, srcDir);
    if (uri !== src) {
      html = html.replace(m[0], m[0].replace(src, uri));
    }
  }
  return html;
}

// ── Entry point ──────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(srcPath)) { console.error(`Source not found: ${srcPath}`); process.exit(1); }
  console.log(`Source:  ${srcPath}`);
  console.log(`Output:  ${outPath}`);
  console.log('');

  let html = fs.readFileSync(srcPath, 'utf8');

  html = await inlineStylesheets(html);
  html = await inlineStyleBlocks(html);
  html = await inlineScripts(html);
  html = await inlineImages(html);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');

  console.log('');
  console.log(`✓ Done: ${outPath}`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
