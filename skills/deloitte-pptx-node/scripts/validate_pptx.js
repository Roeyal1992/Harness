#!/usr/bin/env node
/**
 * Deloitte PPTX Node — Validator
 * Usage: node validate_pptx.js <file.pptx> [--strict] [--json]
 *
 * Checks a generated PPTX for common brand and structural issues.
 * Exit code 0 = PASS, 1 = FAIL (errors found).
 *
 * Requires: npm install adm-zip
 */

const fs   = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const ARGS   = process.argv.slice(2);
const FILE   = ARGS.find(a => !a.startsWith("--"));
const STRICT = ARGS.includes("--strict");
const JSON_OUT = ARGS.includes("--json");

if (!FILE) {
  console.error("Usage: node validate_pptx.js <file.pptx> [--strict] [--json]");
  process.exit(1);
}
if (!fs.existsSync(FILE)) {
  console.error(`File not found: ${FILE}`);
  process.exit(1);
}

// ─── BRAND CONSTANTS ──────────────────────────────────────────────────────────

const PALETTE = new Set([
  "86BC25","26890D","046A38","43B02A","009A44","C4D600","1C3D26","F1F6E4",
  "0D8390","007680","0097A9","00ABAB","6FC2B4","9DD4CF",
  "005587","0076A8","00A3E0","62B5E5","A0DCFF",
  "282728","53565A","75787B","97999B","D0D0D0","E6E6E6","F5F5F5",
  "FFFFFF","000000",
  "DA2910","ED8B00","FFCD00",   // functional — allowed but flagged if used as headers
]);

const BOILERPLATE = [
  /member\s*firms.*DTTL/i,
  /insert\s+appropriate\s+copyright/i,
  /to\s+edit.*slide\s+master/i,
  /presentation\s+title/i,
  /click\s+view.*slide\s+master/i,
  /lorem\s+ipsum/i,
  /text\s+here/i,
  /xxxx/i,
  /\[placeholder\]/i,
];

// ─── PARSE ────────────────────────────────────────────────────────────────────

let zip;
try {
  zip = new AdmZip(FILE);
} catch (e) {
  console.error("Cannot open file — not a valid PPTX:", e.message);
  process.exit(1);
}

const entries   = zip.getEntries().map(e => e.entryName);
const slideFiles = entries.filter(e => /^ppt\/slides\/slide\d+\.xml$/.test(e));
const slideCount = slideFiles.length;

const errors   = [];
const warnings = [];
const infos    = [];

infos.push(`Slides: ${slideCount}`);
infos.push(`File size: ${(fs.statSync(FILE).size / 1024).toFixed(1)} KB`);

// ─── CHECKS ───────────────────────────────────────────────────────────────────

function getXml(entryName) {
  try {
    const entry = zip.getEntry(entryName);
    return entry ? zip.readAsText(entry) : "";
  } catch { return ""; }
}

slideFiles.forEach((sf, i) => {
  const slideNum = i + 1;
  const xml = getXml(sf);

  // 1. Boilerplate text
  BOILERPLATE.forEach(pattern => {
    if (pattern.test(xml)) {
      errors.push(`Slide ${slideNum}: boilerplate text detected — ${pattern}`);
    }
  });

  // 2. Font sizes — extract <a:r> runs and check sz attribute
  const szMatches = xml.matchAll(/sz="(\d+)"/g);
  for (const m of szMatches) {
    const pt = parseInt(m[1]) / 100;  // OOXML stores in hundredths of a point
    if (pt > 0 && pt < 7) {
      errors.push(`Slide ${slideNum}: font size ${pt}pt below 7pt minimum`);
    } else if (pt >= 7 && pt < 10) {
      const level = STRICT ? "ERROR" : "WARN";
      (STRICT ? errors : warnings).push(`Slide ${slideNum}: font size ${pt}pt below 10pt body floor`);
    }
  }

  // 3. Out-of-bounds shapes (rough check via off="..." attributes)
  const offMatches = xml.matchAll(/cx="(\d+)"[^>]*cy="(\d+)"/g);
  for (const m of offMatches) {
    const wEmu = parseInt(m[1]);
    const hEmu = parseInt(m[2]);
    if (wEmu > 12192000) warnings.push(`Slide ${slideNum}: shape width ${(wEmu/914400).toFixed(2)}" exceeds slide width`);
    if (hEmu > 6858000)  warnings.push(`Slide ${slideNum}: shape height ${(hEmu/914400).toFixed(2)}" exceeds slide height`);
  }

  // 4. Empty title check
  if (!xml.includes("<p:sp>") && slideNum > 0) {
    infos.push(`Slide ${slideNum}: no shapes detected (blank slide?)`);
  }
});

// 5. Slide count sanity
if (slideCount === 0) errors.push("No slides found in file");

// ─── REPORT ───────────────────────────────────────────────────────────────────

const pass = errors.length === 0;

if (JSON_OUT) {
  console.log(JSON.stringify({ pass, errors, warnings, infos }, null, 2));
} else {
  if (infos.length)    infos.forEach(m    => console.log(`  ℹ  ${m}`));
  if (warnings.length) warnings.forEach(m => console.warn(`  ⚠  ${m}`));
  if (errors.length)   errors.forEach(m   => console.error(`  ✗  ${m}`));
  console.log(pass ? "\n✓ PASS" : `\n✗ FAIL — ${errors.length} error(s)`);
}

process.exit(pass ? 0 : 1);
