import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "public/assets/np-digital-logo.jpg";
mkdirSync("public/assets", { recursive: true });

// The original is a square 1770px image: glowing ring logo centered,
// "CapCut AI" watermark in top-left corner. We crop it out, preserving
// the circular logo's proportions. Ring outer edge ~ (90..1680) on 1770 => keep margin.
const crop = { left: 92, top: 92, size: 1070 };

await sharp(SRC)
  .extract({ left: crop.left, top: crop.top, width: crop.size, height: crop.size })
  .png()
  .toFile("public/assets/logo.png");

await sharp("public/assets/logo.png").resize(96, 96).png().toFile("public/favicon.png");
await sharp("public/assets/logo.png").resize(32, 32).png().toFile("public/favicon-32.png");

// 1200x630 OG image: brand field + centered logo
await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: { r: 4, g: 7, b: 13, alpha: 1 },
  },
})
  .composite([
    {
      input: Buffer.from(
        `<svg width="1200" height="630">
           <defs>
             <radialGradient id="glow" cx="50%" cy="50%" r="50%">
               <stop offset="0%" stop-color="#0b3a6b" stop-opacity="0.9"/>
               <stop offset="100%" stop-color="#04070d" stop-opacity="0"/>
             </radialGradient>
           </defs>
           <rect width="1200" height="630" fill="url(#glow)"/>
           <text x="600" y="120" fill="#eaf6ff" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700" text-anchor="middle" letter-spacing="14">NP DIGITAL</text>
           <text x="600" y="560" fill="#7dd7f5" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="500" text-anchor="middle" letter-spacing="6">IDEAS | SYSTEMS | SOLUTIONS | BEYOND</text>
         </svg>`
      ),
      top: 0,
      left: 0,
    },
    { input: await sharp("public/assets/logo.png").resize(420, 420).toBuffer(), top: 105, left: 390 },
  ])
  .jpeg({ quality: 88 })
  .toFile("public/assets/og-image.jpg");
// hero logo at natural resolution for crisp rendering on any DPI
await sharp("public/assets/logo.png").resize(640, 640).png().toFile("public/assets/logo-640.png");

console.log("images ready");
