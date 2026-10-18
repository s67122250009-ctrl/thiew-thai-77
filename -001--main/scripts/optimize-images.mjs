// ย่อรูปใน public/images: ด้านยาวสุดไม่เกิน 1600px, JPEG คุณภาพ 80, ชื่อไฟล์เดิม
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = "public/images";
const MAX = 1600, QUALITY = 80;
let before = 0, after = 0;

for (const name of fs.readdirSync(DIR)) {
  if (!/\.(jpe?g)$/i.test(name)) continue;
  const file = path.join(DIR, name);
  const original = fs.readFileSync(file);
  before += original.length;
  const out = await sharp(original)
    .rotate()
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
  if (out.length < original.length) { fs.writeFileSync(file, out); after += out.length; }
  else after += original.length;
}
console.log(`ก่อน ${(before / 1e6).toFixed(1)} MB > หลัง ${(after / 1e6).toFixed(1)} MB - optimize-images.mjs:23`);