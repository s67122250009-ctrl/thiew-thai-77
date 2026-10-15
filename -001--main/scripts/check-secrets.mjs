// scripts/check-secrets.mjs
// ตรวจว่าค่าลับใน .env หลุดไปอยู่ในโฟลเดอร์ dist/ (ไฟล์ที่จะ deploy) หรือไฟล์ที่ git ติดตามอยู่หรือไม่
// พิมพ์เฉพาะชื่อไฟล์และชื่อตัวแปร ไม่พิมพ์ค่าจริงออกมา
// วิธีใช้: node scripts/check-secrets.mjs   (รันหลัง npm run build)
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const MIN_LEN = 8; // ข้ามค่าสั้นๆ เช่น true, 3000
const SENSITIVE_NAME = /(DATABASE|DB_|PASSWORD|SECRET|TOKEN|PRIVATE)/i;
// รูปแบบทั่วไปของ connection string ของ Neon (ใช้ตรวจเฉพาะใน dist/)
const GENERIC = [
  [/neon\.tech/, "โฮสต์ของ Neon"],
  [/npg_[A-Za-z0-9]+/, "รหัสผ่านรูปแบบ Neon (npg_...)"],
  [/neondb_owner/, "ชื่อ role neondb_owner"],
];
const SKIP_EXT = /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|eot|pdf|zip|mp4|mp3)$/i;
const ENV_FILE = /^\.env(\..+)?$/;

function parseEnv(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

// 1) รวบรวมค่าลับจากไฟล์ .env* (ยกเว้น .env.example)
const secrets = [];
const publicWarnings = [];
const envFiles = fs.readdirSync(root).filter((f) => ENV_FILE.test(f) && f !== ".env.example");
for (const f of envFiles) {
  const vars = parseEnv(fs.readFileSync(path.join(root, f), "utf8"));
  for (const [name, value] of Object.entries(vars)) {
    if (name.startsWith("VITE_") && SENSITIVE_NAME.test(name) && value) publicWarnings.push(`${name} (ใน ${f})`);
    if (value.length >= MIN_LEN) secrets.push({ label: `${name} (ใน ${f})`, value });
    try {
      const u = new URL(value);
      const pw = decodeURIComponent(u.password || "");
      if (pw.length >= MIN_LEN) secrets.push({ label: `รหัสผ่านใน ${name} (ใน ${f})`, value: pw });
    } catch {
      /* ไม่ใช่ URL ก็ข้าม */
    }
  }
}

const hits = [];
const add = (where, what) => hits.push(`  - ${where}  ←  ${what}`);

// 2) ตรวจโฟลเดอร์ dist/
const distDir = path.join(root, "dist");
if (fs.existsSync(distDir)) {
  for (const file of walk(distDir)) {
    if (SKIP_EXT.test(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    const rel = path.relative(root, file);
    for (const s of secrets) if (text.includes(s.value)) add(rel, s.label);
    for (const [re, label] of GENERIC) if (re.test(text)) add(rel, label);
  }
} else {
  console.log("ℹ️  ยังไม่มีโฟลเดอร์ dist/  รัน npm run build ก่อนเพื่อตรวจไฟล์ที่จะ deploy - check-secrets.mjs:78");
}

// 3) ตรวจไฟล์ที่ git ติดตามอยู่
try {
  const tracked = execSync("git ls-files -z", { cwd: root, maxBuffer: 64 * 1024 * 1024 }).toString("utf8").split("\0").filter(Boolean);
  for (const rel of tracked) {
    const base = path.basename(rel);
    if (ENV_FILE.test(base) && base !== ".env.example") add(rel, "ไฟล์ .env ถูก git ติดตามอยู่ (ควรอยู่ใน .gitignore)");
    if (SKIP_EXT.test(rel)) continue;
    const full = path.join(root, rel);
    if (!fs.existsSync(full) || fs.statSync(full).size > 5 * 1024 * 1024) continue;
    const text = fs.readFileSync(full, "utf8");
    for (const s of secrets) if (text.includes(s.value)) add(rel, s.label);
  }
} catch {
  console.log("ℹ️  ตรวจไฟล์ที่ git ติดตามไม่ได้ (ไม่ใช่ git repo หรือไม่มี git) - check-secrets.mjs:94");
}

if (!envFiles.length) console.log("ℹ️  ไม่พบไฟล์ .env  ตรวจได้เฉพาะรูปแบบทั่วไปของ Neon ใน dist/ - check-secrets.mjs:97");
if (publicWarnings.length) {
  console.log("⚠️  ตัวแปรที่ขึ้นต้นด้วย VITE_ จะถูกฝังในเว็บสาธารณะเสมอ แต่ชื่อเหมือนค่าลับ: - check-secrets.mjs:99");
  for (const w of publicWarnings) console.log(`${w} - check-secrets.mjs:100`);
}

if (hits.length) {
  console.error("\n❌ พบค่าลับในไฟล์ที่ไม่ควรมี (แสดงเฉพาะชื่อไฟล์ ไม่แสดงค่า): - check-secrets.mjs:104");
  console.error(hits.join("\n - check-secrets.mjs:105"));
  console.error("\nห้าม deploy หรือ push จนกว่าจะแก้ และถ้าค่าลับเคยถูกเผยแพร่แล้ว ให้เปลี่ยนรหัสผ่านใหม่ - check-secrets.mjs:106");
  process.exit(1);
}
console.log("✅ ไม่พบค่าลับจาก .env ใน dist/ และไฟล์ที่ git ติดตาม - check-secrets.mjs:109");