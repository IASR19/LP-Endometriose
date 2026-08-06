import fs from "node:fs";
import sharp from "sharp";

const hd = "public/images/final-screen-hd.png";
const meta = await sharp(hd).metadata();
console.log("source", meta.width, "x", meta.height);

await sharp(hd)
  .resize({ width: 1290, withoutEnlargement: true })
  .webp({ quality: 92, effort: 6 })
  .toFile("public/images/final-screen.webp");

await sharp(hd)
  .resize({ width: 1290, withoutEnlargement: true })
  .png({ compressionLevel: 6 })
  .toFile("public/images/final-screen-opt.png");

for (const f of [
  "public/images/final-screen.webp",
  "public/images/final-screen-opt.png",
]) {
  const m = await sharp(f).metadata();
  console.log(f, `${m.width}x${m.height}`, `${Math.round(fs.statSync(f).size / 1024)}kb`);
}
