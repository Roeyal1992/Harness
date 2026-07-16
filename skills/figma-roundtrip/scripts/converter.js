// figma-roundtrip converter v1
// Paste this into every use_figma push call. The AI only writes the render() call.
//
// Usage:
//   [paste this file]
//   await render({ page: '...', rtl: true, fonts: ['Rubik:Regular'], tree: { ... } });
//
// Tree node format:
//   { tag: 'frame'|'text'|'rect', name: string, css: {...}, children: [...] }
//   tag 'text' also takes: content (string), font ('Family:Style')
//   tag 'rect' uses css.width/height for dimensions, default 24x24
//   CSS properties use standard names. Values can be numbers (treated as px) or strings.

function _h(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');return{r:parseInt(h.slice(0,2),16)/255,g:parseInt(h.slice(2,4),16)/255,b:parseInt(h.slice(4,6),16)/255}}
function _px(v){return typeof v==='number'?v:parseFloat(v)}
function _pad(p){if(typeof p==='number')return[p,p,p,p];var a=String(p).split(/\s+/).map(_px);return a.length===1?[a[0],a[0],a[0],a[0]]:a.length===2?[a[0],a[1],a[0],a[1]]:a.length===3?[a[0],a[1],a[2],a[1]]:a}
function _brd(b){var m=String(b).match(/([\d.]+)px?\s+solid\s+(#[0-9a-fA-F]{3,8})/);return m?{w:+m[1],c:_h(m[2])}:null}
function _rad(v){if(typeof v==='number')return[v,v,v,v];var a=String(v).split(/\s+/).map(_px);return a.length===1?[a[0],a[0],a[0],a[0]]:a.length===2?[a[0],a[1],a[0],a[1]]:a}
var _AI={center:'CENTER','flex-start':'MIN','flex-end':'MAX',stretch:'STRETCH'};
var _JC={'flex-start':'MIN',center:'CENTER','flex-end':'MAX','space-between':'SPACE_BETWEEN'};
var _FW={'300':'Light','400':'Regular','500':'Medium','600':'SemiBold','700':'Bold'};

function _vis(n,c,isText){
  if(!c)return;
  if(c.background!==undefined)n.fills=c.background==='transparent'||c.background==='none'?[]:[{type:'SOLID',color:_h(c.background)}];
  if(c.border){var b=_brd(c.border);if(b){n.strokes=[{type:'SOLID',color:b.c}];n.strokeWeight=b.w;n.strokeAlign='INSIDE';}}
  if(c['border-top']){var bt=_brd(c['border-top']);if(bt){n.strokes=[{type:'SOLID',color:bt.c}];n.strokeWeight=bt.w;n.strokeAlign='INSIDE';n.strokeTopWeight=bt.w;n.strokeBottomWeight=0;n.strokeLeftWeight=0;n.strokeRightWeight=0;}}
  if(c['border-bottom']){var bb=_brd(c['border-bottom']);if(bb){n.strokes=[{type:'SOLID',color:bb.c}];n.strokeWeight=bb.w;n.strokeAlign='INSIDE';n.strokeTopWeight=0;n.strokeBottomWeight=bb.w;n.strokeLeftWeight=0;n.strokeRightWeight=0;}}
  if(c['border-radius']!==undefined){var rv=_rad(c['border-radius']);if(rv[0]===rv[1]&&rv[1]===rv[2]&&rv[2]===rv[3])n.cornerRadius=rv[0];else{n.topLeftRadius=rv[0];n.topRightRadius=rv[1];n.bottomRightRadius=rv[2];n.bottomLeftRadius=rv[3];}}
  if(c['border-top-left-radius']!==undefined){n.topLeftRadius=_px(c['border-top-left-radius']);n.topRightRadius=_px(c['border-top-right-radius']||0);n.bottomRightRadius=_px(c['border-bottom-right-radius']||0);n.bottomLeftRadius=_px(c['border-bottom-left-radius']||0);}
  if(c.overflow==='hidden')n.clipsContent=true;
  if(c.opacity!==undefined)n.opacity=parseFloat(c.opacity);
  if(c['min-width'])n.minWidth=_px(c['min-width']);
  if(c['max-width'])n.maxWidth=_px(c['max-width']);
  if(isText){
    if(c['font-size'])n.fontSize=_px(c['font-size']);
    if(c.color)n.fills=[{type:'SOLID',color:_h(c.color)}];
    if(c['text-align']){var m={right:'RIGHT',center:'CENTER',left:'LEFT'};n.textAlignHorizontal=m[c['text-align']]||'LEFT';}
    if(c['line-height'])n.lineHeight={value:_px(c['line-height']),unit:'PIXELS'};
    if(c['letter-spacing'])n.letterSpacing={value:_px(c['letter-spacing']),unit:'PIXELS'};
  }
}

function _sz(n,c){
  if(!c)return;
  var w=c.width,h=c.height;
  if(w==='100%'||c.flex==='1'||c.flex===1)n.layoutSizingHorizontal='FILL';
  else if(w==='hug'||w==='auto')n.layoutSizingHorizontal='HUG';
  else if(w!==undefined){n.resize(_px(w),n.height);n.layoutSizingHorizontal='FIXED';}
  if(h==='100%'||c['flex-grow']==='1')n.layoutSizingVertical='FILL';
  else if(h==='hug'||h==='auto')n.layoutSizingVertical='HUG';
  else if(h!==undefined){n.resize(n.width,_px(h));n.layoutSizingVertical='FIXED';}
}

function _build(spec,parent,rtl){
  if(spec.tag==='text')return _text(spec,parent);
  if(spec.tag==='rect')return _rect(spec,parent);
  return _frame(spec,parent,rtl);
}

function _frame(spec,parent,rtl){
  var f=figma.createFrame(),c=spec.css||{};
  f.name=spec.name||'Frame';
  f.layoutMode=c['flex-direction']==='column'?'VERTICAL':'HORIZONTAL';
  if(parent)parent.appendChild(f);
  if(c.gap)f.itemSpacing=_px(c.gap);
  if(c.padding){var p=_pad(c.padding);f.paddingTop=p[0];f.paddingRight=p[1];f.paddingBottom=p[2];f.paddingLeft=p[3];}
  if(c['padding-top']!==undefined)f.paddingTop=_px(c['padding-top']);
  if(c['padding-right']!==undefined)f.paddingRight=_px(c['padding-right']);
  if(c['padding-bottom']!==undefined)f.paddingBottom=_px(c['padding-bottom']);
  if(c['padding-left']!==undefined)f.paddingLeft=_px(c['padding-left']);
  if(c['align-items'])f.counterAxisAlignItems=_AI[c['align-items']]||c['align-items'];
  else if(rtl&&f.layoutMode==='VERTICAL')f.counterAxisAlignItems='MAX';
  if(c['justify-content'])f.primaryAxisAlignItems=_JC[c['justify-content']]||c['justify-content'];
  else if(rtl&&f.layoutMode==='HORIZONTAL')f.primaryAxisAlignItems='MAX';
  f.fills=[];
  _vis(f,c,false);
  _sz(f,c);
  if(c.width===undefined&&c.flex!=='1'&&c.flex!==1&&f.layoutSizingHorizontal!=='FILL')f.layoutSizingHorizontal='HUG';
  if(c.height===undefined&&c['flex-grow']!=='1'&&f.layoutSizingVertical!=='FILL')f.layoutSizingVertical='HUG';
  if(spec.children)for(var i=0;i<spec.children.length;i++)_build(spec.children[i],f,rtl);
  return f;
}

function _text(spec,parent){
  var t=figma.createText(),c=spec.css||{};
  t.name=spec.name||'Text';
  if(parent)parent.appendChild(t);
  var font=spec.font||'Rubik:Regular';
  var fp=font.split(':');
  t.fontName={family:fp[0],style:fp[1]||_FW[c['font-weight']]||'Regular'};
  t.characters=spec.content||'';
  t.fontSize=_px(c['font-size']||14);
  t.fills=[{type:'SOLID',color:_h(c.color||'#000000')}];
  t.textAlignHorizontal='LEFT';
  _vis(t,c,true);
  if(c.flex==='1'||c.width==='100%')t.layoutSizingHorizontal='FILL';
  else t.layoutSizingHorizontal='HUG';
  t.layoutSizingVertical='HUG';
  return t;
}

function _rect(spec,parent){
  var r=figma.createRectangle(),c=spec.css||{};
  r.name=spec.name||'Rectangle';
  if(parent)parent.appendChild(r);
  r.resize(_px(c.width||24),_px(c.height||24));
  if(c.flex==='1'||c.width==='100%')r.layoutSizingHorizontal='FILL';
  else r.layoutSizingHorizontal='FIXED';
  if(c['flex-grow']==='1'||c.height==='100%')r.layoutSizingVertical='FILL';
  else r.layoutSizingVertical='FIXED';
  r.fills=[{type:'SOLID',color:_h('#c9c9c9'),opacity:0.3}];
  _vis(r,c,false);
  return r;
}

function _revH(node){
  if(!('children' in node))return;
  for(var i=0;i<node.children.length;i++)_revH(node.children[i]);
  if(node.layoutMode==='HORIZONTAL'&&node.children.length>1){
    var k=[];for(var j=0;j<node.children.length;j++)k.push(node.children[j]);
    for(var m=0;m<k.length;m++)node.insertChild(0,k[m]);
  }
}

async function render(spec){
  if(spec.page){var pg=figma.root.children.find(p=>p.id===spec.page);if(pg)await figma.setCurrentPageAsync(pg);}
  if(spec.fonts)for(var i=0;i<spec.fonts.length;i++){var fp=spec.fonts[i].split(':');await figma.loadFontAsync({family:fp[0],style:fp[1]||'Regular'});}
  var root=_build(spec.tree,null,spec.rtl);
  if(spec.rtl)_revH(root);
  var ex=figma.currentPage.children.filter(n=>n.id!==root.id);
  var x=100;if(ex.length)x=Math.max.apply(null,ex.map(n=>n.x+n.width))+200;
  root.x=x;root.y=100;
  return{id:root.id,name:root.name,w:root.width,h:root.height};
}
