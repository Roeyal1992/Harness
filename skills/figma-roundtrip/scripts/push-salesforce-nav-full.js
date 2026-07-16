// Push: salesforce-top-nav (full component) → Figma
// Source: Projects/Poalim/Components/salesforce-top-nav/ (JS + CSS)
// Target: file WpjJgZZEz03Z6GaQmIoLxV, page node 5583:9354
// Sample data: spec.md section 5
// All 3 rows: Global Header (64px) + Console Nav (32px) + Subtabs (40px)
//
// Built in DOM order, then reverseH() flips all horizontal containers for RTL.

function hexToFigma(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  return {
    r: parseInt(hex.substring(0, 2), 16) / 255,
    g: parseInt(hex.substring(2, 4), 16) / 255,
    b: parseInt(hex.substring(4, 6), 16) / 255,
  };
}

const T = {
  surface:  hexToFigma('#ffffff'),
  border1:  hexToFigma('#c9c9c9'),
  border2:  hexToFigma('#5c5c5c'),
  text1:    hexToFigma('#5c5c5c'),
  text3:    hexToFigma('#001e5b'),
  accent:   hexToFigma('#0250d9'),
  activeBg: hexToFigma('#edf4ff'),
};

// ── Page navigation (rule #5) ──
const targetPage = figma.root.children.find(p => p.id === '5583:9354');
if (targetPage) await figma.setCurrentPageAsync(targetPage);

// ── Font loading (rule #2) ──
await figma.loadFontAsync({ family: 'Rubik', style: 'Regular' });

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

function af(parent, name, dir, o) {
  o = o || {};
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = dir; // rule #6
  if (parent) parent.appendChild(f); // rule #1
  f.counterAxisAlignItems = o.ai || 'MIN';
  f.primaryAxisAlignItems = o.jc || 'MIN';
  f.itemSpacing = o.gap ?? 0;
  f.paddingTop = o.pt ?? 0;
  f.paddingBottom = o.pb ?? 0;
  f.paddingLeft = o.pl ?? 0;
  f.paddingRight = o.pr ?? 0;
  f.fills = o.fills !== undefined ? o.fills : [];
  if (o.w !== undefined) { f.resize(o.w, f.height); f.layoutSizingHorizontal = 'FIXED'; }
  if (o.h !== undefined) { f.resize(f.width, o.h); f.layoutSizingVertical = 'FIXED'; }
  if (o.hFill) f.layoutSizingHorizontal = 'FILL';
  if (o.hHug) f.layoutSizingHorizontal = 'HUG';
  if (o.vHug) f.layoutSizingVertical = 'HUG';
  if (o.clip) f.clipsContent = true;
  if (o.radius !== undefined) f.cornerRadius = o.radius;
  if (o.tl !== undefined) { f.topLeftRadius = o.tl; f.topRightRadius = o.tr ?? 0; f.bottomRightRadius = o.br ?? 0; f.bottomLeftRadius = o.bl ?? 0; }
  if (o.stroke) {
    f.strokes = [{ type: 'SOLID', color: o.stroke }];
    f.strokeWeight = 1;
    f.strokeAlign = 'INSIDE';
  }
  return f;
}

function ph(parent, name, w, h, o) {
  o = o || {};
  const r = figma.createRectangle();
  r.name = name;
  parent.appendChild(r);
  r.resize(w, h);
  r.layoutSizingHorizontal = o.hFill ? 'FILL' : 'FIXED';
  r.layoutSizingVertical = o.vFill ? 'FILL' : 'FIXED';
  r.fills = [{ type: 'SOLID', color: o.color || T.border1, opacity: o.opacity ?? 0.3 }];
  if (o.radius !== undefined) r.cornerRadius = o.radius;
  return r;
}

function tx(parent, name, chars, o) {
  o = o || {};
  const t = figma.createText();
  t.name = name;
  parent.appendChild(t);
  t.fontName = { family: 'Rubik', style: 'Regular' };
  t.characters = chars;
  t.fontSize = o.size || 14;
  t.fills = [{ type: 'SOLID', color: o.color || T.text3 }];
  t.textAlignHorizontal = o.align || 'RIGHT';
  if (o.lh) t.lineHeight = { value: o.lh, unit: 'PIXELS' };
  t.layoutSizingHorizontal = o.hFill ? 'FILL' : 'HUG';
  t.layoutSizingVertical = 'HUG';
  return t;
}

function createDivider(parent) {
  const d = af(parent, 'Divider', 'VERTICAL', { ai: 'MAX', jc: 'CENTER', w: 1, h: 32 });
  const line = ph(d, 'Line', 1, 1, { color: T.border1, opacity: 1 });
  line.layoutSizingVertical = 'FILL';
}

function createBtnIcon(parent, name) {
  const btn = af(parent, name, 'HORIZONTAL', { ai: 'CENTER', jc: 'CENTER', w: 20, h: 20, radius: 4 });
  const inner = af(btn, 'Inner', 'HORIZONTAL', { ai: 'CENTER', jc: 'CENTER', h: 16, hHug: true, radius: 8, clip: true });
  inner.minWidth = 16;
  ph(inner, name + ' [placeholder]', 14, 14, { radius: 2 });
}

function createTab(parent, label, opts) {
  opts = opts || {};
  var active = opts.active;
  var bare = opts.bare;
  var overflow = opts.overflow;
  var iconOnly = opts.iconOnly;

  if (iconOnly) {
    var tab = af(parent, 'Tab: Split View', 'VERTICAL', {
      ai: 'CENTER', w: 40, h: 32,
      fills: [{ type: 'SOLID', color: T.surface }],
    });
    var content = af(tab, 'Icon Tab Content', 'HORIZONTAL', {
      ai: 'CENTER', jc: 'CENTER', h: 32, pl: 13, pr: 13,
      radius: 8, clip: true, hFill: true,
    });
    ph(content, 'icon-split-view [placeholder]', 14, 14, { radius: 2 });
    ph(tab, 'Tab Bar', 1, 3, { color: T.surface, opacity: 1, hFill: true });
    return;
  }

  var tab = af(parent, 'Tab: ' + label, 'VERTICAL', { ai: 'MAX', h: 32 });
  if (opts.width) { tab.resize(opts.width, 32); tab.layoutSizingHorizontal = 'FIXED'; }
  else tab.layoutSizingHorizontal = 'HUG';

  var inner = af(tab, 'Tab Inner', 'HORIZONTAL', {
    ai: 'CENTER', jc: 'MAX', pl: 8, pr: 8, h: 32,
    fills: [{ type: 'SOLID', color: T.surface }], hFill: true,
  });

  var iconLabel = af(inner, 'Icon + Label', 'HORIZONTAL', { ai: 'CENTER', hFill: true, vHug: true });

  var ic = af(iconLabel, 'Icon Container', 'HORIZONTAL', { ai: 'CENTER', jc: 'CENTER', w: 24, h: 24 });
  ph(ic, (active ? 'icon-tab-active' : 'icon-tab-inactive') + ' [placeholder]', 16, 16, {
    color: active ? T.accent : T.border1, radius: 2,
  });

  tx(iconLabel, 'Tab Label', label, {
    size: 14, color: active ? T.accent : T.text3, align: 'RIGHT', lh: 19, hFill: true,
  });

  if (!bare) {
    createBtnIcon(inner, active ? 'Switch Active' : 'Switch');
    if (!overflow) createBtnIcon(inner, active ? 'Close Active' : 'Close');
  }

  var barColor = active ? T.accent : T.surface;
  var bar = ph(tab, active ? 'Active Bar' : 'Tab Bar', 1, 3, { color: barColor, opacity: 1, hFill: true });
  if (active) bar.cornerRadius = 4;
}

function createSubtab(parent, label, active) {
  var sub = af(parent, 'Subtab: ' + label, 'HORIZONTAL', { ai: 'MAX', jc: 'CENTER', w: 170, h: 40 });

  var inner = af(sub, 'Subtab Inner', 'HORIZONTAL', {
    ai: 'CENTER', jc: 'MAX', pl: 12, pr: 12,
    fills: [{ type: 'SOLID', color: active ? T.activeBg : T.surface }],
    hFill: true,
  });
  inner.layoutSizingVertical = 'FILL';
  inner.strokes = [{ type: 'SOLID', color: T.border1 }];
  inner.strokeWeight = 1;
  inner.strokeAlign = 'INSIDE';
  inner.strokeTopWeight = 0;
  inner.strokeBottomWeight = 1;
  inner.strokeLeftWeight = 0;
  inner.strokeRightWeight = 0;

  var iconLabel = af(inner, 'Icon + Label', 'HORIZONTAL', { ai: 'CENTER', pl: 4, pr: 4, hFill: true, vHug: true });

  var ic = af(iconLabel, 'Icon Container', 'HORIZONTAL', { ai: 'CENTER', jc: 'CENTER', w: 24, h: 24 });
  ph(ic, (active ? 'icon-tab-active' : 'icon-tab-inactive') + ' [placeholder]', 16, 16, {
    color: active ? T.accent : T.border1, radius: 2,
  });

  tx(iconLabel, 'Subtab Label', label, {
    size: 14, color: active ? T.accent : T.text1, align: 'RIGHT', lh: 19, hFill: true,
  });

  createBtnIcon(inner, active ? 'Switch Active' : 'Switch');
  createBtnIcon(inner, active ? 'Close Active' : 'Close');
}

// RTL: reverse children of all horizontal auto-layout containers (depth-first)
function reverseH(node) {
  if (!('children' in node)) return;
  for (var i = 0; i < node.children.length; i++) reverseH(node.children[i]);
  if (node.layoutMode === 'HORIZONTAL' && node.children.length > 1) {
    var kids = [];
    for (var j = 0; j < node.children.length; j++) kids.push(node.children[j]);
    for (var k = 0; k < kids.length; k++) node.insertChild(0, kids[k]);
  }
}

// ══════════════════════════════════════════════════════════════
// BUILD (DOM order — reversed at end for RTL)
// ══════════════════════════════════════════════════════════════

var root = af(null, 'Salesforce Nav', 'VERTICAL', {
  ai: 'MIN', w: 1306,
  fills: [{ type: 'SOLID', color: T.surface }],
});
root.layoutSizingVertical = 'HUG';

// ── ROW 1: Global Header (64px) ──
var header = af(root, 'Global Header', 'HORIZONTAL', {
  ai: 'CENTER', jc: 'SPACE_BETWEEN', h: 64, pl: 12, pr: 12,
  fills: [{ type: 'SOLID', color: T.surface }], hFill: true,
});

ph(header, 'logo-salesforce.svg [placeholder]', 200, 42, { radius: 4 });

var search = af(header, 'Search', 'HORIZONTAL', {
  ai: 'CENTER', gap: 8, w: 482, h: 32, pl: 8, pr: 8,
  radius: 9999, stroke: T.border2,
  fills: [{ type: 'SOLID', color: T.surface }],
});
ph(search, 'icon-search [placeholder]', 14, 14, { radius: 2 });
tx(search, 'Search Text', 'חיפוש...', { size: 13, color: T.text1, align: 'RIGHT', hFill: true });

var icons = af(header, 'Header Icons', 'HORIZONTAL', {
  ai: 'CENTER', gap: 16, pl: 16, pr: 16, hHug: true,
});
ph(icons, 'icon-avatar [placeholder]', 32, 32, { radius: 9999 });
ph(icons, 'icon-notifications [placeholder]', 24, 24, { radius: 2 });
ph(icons, 'icon-setup [placeholder]', 24, 24, { radius: 2 });
ph(icons, 'icon-help [placeholder]', 24, 24, { radius: 2 });
ph(icons, 'icon-trailhead [placeholder]', 24, 24, { radius: 2 });
ph(icons, 'icon-new [placeholder]', 24, 24, { radius: 2 });

var splitBtn = af(icons, 'Split Button', 'HORIZONTAL', { ai: 'CENTER' });
var splitR = af(splitBtn, 'Split Half Right', 'HORIZONTAL', {
  ai: 'CENTER', jc: 'CENTER', pt: 5, pb: 5, pl: 5, pr: 5,
  stroke: T.border2, tl: 0, tr: 9999, br: 9999, bl: 0,
  fills: [{ type: 'SOLID', color: T.surface }],
});
ph(splitR, 'icon-split-right [placeholder]', 16, 16, { radius: 2 });
var splitL = af(splitBtn, 'Split Half Left', 'HORIZONTAL', {
  ai: 'CENTER', jc: 'CENTER', pt: 5, pb: 5, pl: 5, pr: 5,
  stroke: T.border2, tl: 9999, tr: 0, br: 0, bl: 9999,
  fills: [{ type: 'SOLID', color: T.surface }],
});
ph(splitL, 'icon-split-left [placeholder]', 16, 16, { radius: 2 });

ph(icons, 'icon-agentforce [placeholder]', 24, 24, { radius: 2 });

// ── ROWS 2+3 wrapper ──
var wrapper = af(root, 'Console Wrapper', 'VERTICAL', {
  ai: 'MIN', hFill: true,
  fills: [{ type: 'SOLID', color: T.surface }],
});

// ── ROW 2: Console Nav (32px) ──
var nav = af(wrapper, 'Console Nav', 'HORIZONTAL', {
  ai: 'MIN', jc: 'MIN', w: 1306, pt: 4, pb: 4,
  fills: [{ type: 'SOLID', color: T.surface }],
  stroke: T.border1,
});
nav.strokeTopWeight = 1;
nav.strokeBottomWeight = 0;
nav.strokeLeftWeight = 0;
nav.strokeRightWeight = 0;

var appName = af(nav, 'App Name', 'HORIZONTAL', {
  ai: 'CENTER', jc: 'MAX', gap: 16, h: 32, pr: 32, pl: 16, hHug: true,
});
appName.maxWidth = 320;
tx(appName, 'App Name Text', 'קונסולת מכירות', { size: 20, color: T.text3, align: 'RIGHT', lh: 28 });
ph(appName, 'icon-waffle [placeholder]', 24, 24, { radius: 2 });

createDivider(nav);
createTab(nav, 'בית', { bare: true, width: 120 });
createDivider(nav);
createTab(nav, null, { iconOnly: true });
createDivider(nav);
createTab(nav, 'יצירה חדשה', { active: true });
createDivider(nav);
createTab(nav, 'עוד', { overflow: true, width: 90 });

// ── ROW 3: Subtab Row ──
var subtabs = af(wrapper, 'Subtab Row', 'HORIZONTAL', {
  ai: 'CENTER', jc: 'MIN', w: 1306,
  fills: [{ type: 'SOLID', color: T.surface }],
  stroke: T.border1,
});
subtabs.strokeTopWeight = 0;
subtabs.strokeBottomWeight = 1;
subtabs.strokeLeftWeight = 0;
subtabs.strokeRightWeight = 0;

createSubtab(subtabs, 'פרטי לקוח', true);
createSubtab(subtabs, 'היסטוריה', false);

// ── RTL reversal ──
reverseH(root);

// ── Position on canvas ──
var existing = figma.currentPage.children.filter(function(n) { return n.id !== root.id; });
var startX = 100;
if (existing.length > 0) {
  var rightmost = Math.max.apply(null, existing.map(function(n) { return n.x + n.width; }));
  startX = rightmost + 200;
}
root.x = startX;
root.y = 100;

return {
  rootNodeId: root.id,
  rootName: root.name,
  width: root.width,
  height: root.height,
};
