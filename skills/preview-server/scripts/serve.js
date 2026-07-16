#!/usr/bin/env node
// Generic static preview server with a live-updating, tree-view mockup index.
// Usage: node serve.js <target-dir> [port]
//
// <target-dir> is the folder to serve and scan for .html mockups (relative paths
// resolve against the current working directory Node was launched from).
// [port] defaults to 5555.

const http = require('http');
const fs = require('fs');
const path = require('path');

const [, , targetDirArg, portArg] = process.argv;
if (!targetDirArg) {
  console.error('Usage: node serve.js <target-dir> [port]');
  process.exit(1);
}

const root = path.resolve(targetDirArg);
const port = parseInt(portArg, 10) || parseInt(process.env.PORT, 10) || 5555;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

function findMockups(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(findMockups(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(path.relative(root, full).split(path.sep).join('/'));
    }
  }
  return results;
}

function titleize(segment) {
  const hasHebrew = /[֐-׿]/.test(segment);
  if (hasHebrew) return segment;
  return segment
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

function buildTree(paths) {
  const tree = {};
  for (const p of paths) {
    const parts = p.split('/');
    let node = tree;
    for (let i = 0; i < parts.length - 1; i++) {
      node.children = node.children || {};
      node.children[parts[i]] = node.children[parts[i]] || { children: {} };
      node = node.children[parts[i]];
    }
    node.files = node.files || [];
    node.files.push({ name: parts[parts.length - 1], path: p });
  }
  return tree;
}

function renderNode(node, depth) {
  const dirs = node.children
    ? Object.keys(node.children).sort().map(name => `
      <details ${depth < 1 ? 'open' : ''}>
        <summary>${titleize(name)}</summary>
        <div class="branch">${renderNode(node.children[name], depth + 1)}</div>
      </details>`).join('')
    : '';
  const files = (node.files || [])
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(f => {
      const preview = `/__preview?src=${encodeURIComponent(f.path)}`;
      const raw = `/${f.path}`;
      return `<li><a href="${preview}">${titleize(f.name.replace(/\.html$/, ''))}</a> <a class="raw" href="${raw}">raw</a></li>`;
    })
    .join('');
  return `${dirs}${files ? `<ul>${files}</ul>` : ''}`;
}

function renderIndex() {
  const tree = buildTree(findMockups(root));
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Mockup index</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 760px; margin: 3rem auto; padding: 0 1.5rem;
    background: #ffffff; color: #1a1a1a; }
  h1 { font-size: 1.4rem; font-weight: 600; margin-bottom: 1.5rem; }
  details { margin: 0.15rem 0; }
  summary { cursor: pointer; font-weight: 600; padding: 0.3rem 0; color: #1a1a1a; }
  summary::marker { color: #6b6b6b; }
  .branch { margin-left: 1.1rem; border-left: 1px solid #e2e2e2; padding-left: 1rem; }
  ul { list-style: none; margin: 0.2rem 0 0.4rem; padding: 0; }
  li { margin: 0.25rem 0; }
  a { color: #0057b8; text-decoration: none; font-size: 0.95rem; }
  a:hover { text-decoration: underline; }
  a.raw { color: #8a8a8a; font-size: 0.78rem; margin-right: 0.4rem; }
  @media (prefers-color-scheme: dark) {
    body { background: #16181c; color: #e6e6e6; }
    summary { color: #e6e6e6; }
    summary::marker { color: #9a9a9a; }
    .branch { border-left-color: #33363c; }
    a { color: #6db3ff; }
    a.raw { color: #7a7a7a; }
  }
</style>
</head><body><h1>Mockups</h1>${renderNode(tree, 0)}</body></html>`;
}

const DEVICE_PRESETS = [
  { label: 'Desktop', width: 1440, height: 900 },
  { label: 'Tablet', width: 1024, height: 768 },
  { label: 'Mobile', width: 390, height: 844 },
];

function renderToolbar(src) {
  const rawUrl = `/${src}`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Preview — ${src}</title>
<style>
  :root { color-scheme: light dark; }
  html, body { margin: 0; padding: 0; height: 100%; overflow: hidden;
    font-family: -apple-system, Segoe UI, Roboto, sans-serif; background: #eceef1; color: #1a1a1a; }
  #toolbar { display: flex; align-items: center; gap: 0.75rem; height: 44px; padding: 0 0.75rem;
    background: #fff; border-bottom: 1px solid #ddd; }
  #toolbar select, #toolbar input { font-size: 0.85rem; padding: 0.25rem 0.4rem; border: 1px solid #ccc; border-radius: 4px; }
  #toolbar input[type="number"] { width: 4.2rem; }
  #toolbar label { font-size: 0.8rem; color: #555; display: flex; align-items: center; gap: 0.3rem; }
  #toolbar a { font-size: 0.8rem; color: #0057b8; text-decoration: none; }
  #toolbar a:hover { text-decoration: underline; }
  #toolbar a.push { margin-right: auto; }
  #home { font-size: 1.05rem; line-height: 1; }
  #stage { position: absolute; top: 44px; left: 0; right: 0; bottom: 0;
    display: flex; align-items: center; justify-content: center; overflow: hidden; background: #eceef1; }
  #frame-wrap { background: #000; box-shadow: 0 0 0 1px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.25); }
  #frame { border: 0; display: block; }
  @media (prefers-color-scheme: dark) {
    html, body { background: #1c1e22; color: #e6e6e6; }
    #toolbar { background: #23262b; border-bottom-color: #34373d; }
    #stage { background: #1c1e22; }
    #toolbar select, #toolbar input { background: #2b2e34; color: #e6e6e6; border-color: #444; }
    #toolbar label { color: #aaa; }
    #toolbar a { color: #6db3ff; }
  }
</style>
</head><body>
<div id="toolbar">
  <a id="home" href="/" title="Back to mockup index">⌂</a>
  <a class="push" href="${rawUrl}" target="_blank">Open raw</a>
  <label>Device
    <select id="preset">
      ${DEVICE_PRESETS.map((p, i) => `<option value="${i}">${p.label} (${p.width}×${p.height})</option>`).join('')}
      <option value="custom">Custom</option>
    </select>
  </label>
  <label>W <input id="w" type="number" min="200" step="10"></label>
  <label>H <input id="h" type="number" min="200" step="10"></label>
</div>
<div id="stage">
  <div id="frame-wrap"><iframe id="frame" src="${rawUrl}"></iframe></div>
</div>
<script>
  var PRESETS = ${JSON.stringify(DEVICE_PRESETS)};
  var presetEl = document.getElementById('preset');
  var wEl = document.getElementById('w');
  var hEl = document.getElementById('h');
  var frameWrap = document.getElementById('frame-wrap');
  var frame = document.getElementById('frame');
  var stage = document.getElementById('stage');

  function currentSize() {
    if (presetEl.value === 'custom') return { width: +wEl.value || 1440, height: +hEl.value || 900 };
    var p = PRESETS[+presetEl.value];
    return { width: p.width, height: p.height };
  }

  function apply() {
    var size = currentSize();
    wEl.value = size.width;
    hEl.value = size.height;
    frame.style.width = size.width + 'px';
    frame.style.height = size.height + 'px';
    frameWrap.style.width = size.width + 'px';
    frameWrap.style.height = size.height + 'px';
    var availW = stage.clientWidth - 32;
    var availH = stage.clientHeight - 32;
    var scale = Math.min(availW / size.width, availH / size.height, 1);
    frameWrap.style.transform = 'scale(' + scale + ')';
  }

  presetEl.addEventListener('change', apply);
  wEl.addEventListener('input', function () { presetEl.value = 'custom'; apply(); });
  hEl.addEventListener('input', function () { presetEl.value = 'custom'; apply(); });
  window.addEventListener('resize', apply);
  apply();
</script>
</body></html>`;
}

http.createServer((req, res) => {
  const [rawPathname, rawQuery] = req.url.split('?');
  const safePath = decodeURIComponent(rawPathname).replace(/\.\./g, '');
  if (safePath === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderIndex());
    return;
  }
  if (safePath === '/__preview') {
    const src = ((new URLSearchParams(rawQuery || '')).get('src') || '').replace(/\.\./g, '');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderToolbar(src));
    return;
  }
  const file = path.join(root, safePath);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not found: ' + safePath); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'text/plain; charset=utf-8' });
    res.end(data);
  });
}).listen(port, () => console.log(`ready — serving ${root} on http://localhost:${port}`));
