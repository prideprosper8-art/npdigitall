/**
 * Generates the 10 service illustrations as optimized PNGs into
 * public/assets/services/. Each is a hand-authored SVG in NP Digital's
 * blueprint line-art style: dark navy field, cyan/electric-blue strokes,
 * soft depth via a single radial glow. Deterministic and re-runnable.
 *
 * Run: node scripts/make-service-images.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const OUT_DIR = join(process.cwd(), "public", "assets", "services");
const W = 640;
const H = 400;

// Shared chrome: background plate + vignette so all tiles feel like one family.
const frame = (inner, glowX = 320, glowY = 200) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="${glowX}" cy="${glowY}" r="320" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0b3a5e" stop-opacity=".85"/>
      <stop offset=".55" stop-color="#082341" stop-opacity=".45"/>
      <stop offset="1" stop-color="#050d16" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#050d16" stop-opacity="0"/>
      <stop offset="1" stop-color="#050d16" stop-opacity=".9"/>
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="#07101b"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <!-- faint blueprint grid -->
  <g stroke="#0e2a44" stroke-width="1" opacity=".5">
    ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="${W}" y2="${i * 50}"/>`).join("")}
    ${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${H}"/>`).join("")}
  </g>
  ${inner}
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  <!-- corner ticks -->
  <g stroke="#1c4a6e" stroke-width="2" opacity=".9">
    <path d="M18 30v-12h12"/><path d="M${W - 18} 30v-12h-12"/>
    <path d="M18 ${H - 30}v12h12"/><path d="M${W - 18} ${H - 30}v12h-12"/>
  </g>
</svg>`;

const stroke = `fill="none" stroke-linecap="round" stroke-linejoin="round"`;

/* ---------------------------- 10 compositions ---------------------------- */

const website = frame(`
  <g ${stroke} stroke="#37c6f0" stroke-width="3" filter="url(#soft)">
    <rect x="150" y="105" width="340" height="220" rx="10" fill="#08131f" stroke="#2b9fd4"/>
    <line x1="150" y1="143" x2="490" y2="143" stroke="#2b9fd4"/>
    <circle cx="172" cy="124" r="4" fill="#37c6f0" stroke="none"/>
    <circle cx="190" cy="124" r="4" fill="#1a6e9e" stroke="none"/>
    <circle cx="208" cy="124" r="4" fill="#1a6e9e" stroke="none"/>
    <rect x="172" y="165" width="120" height="10" rx="5" fill="#bfe9fa" stroke="none" opacity=".9"/>
    <rect x="172" y="187" width="170" height="10" rx="5" fill="#4d7fa4" stroke="none" opacity=".7"/>
    <rect x="172" y="209" width="145" height="10" rx="5" fill="#4d7fa4" stroke="none" opacity=".5"/>
    <rect x="172" y="245" width="92" height="28" rx="14" fill="#0d5f96" stroke="#37c6f0"/>
    <rect x="316" y="165" width="152" height="108" rx="8" fill="#0a2035" stroke="#2b9fd4" stroke-dasharray="6 6"/>
    <path d="M316 236l44-38 38 30 28-22 42 34" stroke="#5fd9f7"/>
  </g>
  <g ${stroke} stroke="#1c4a6e" stroke-width="2">
    <circle cx="150" cy="105" r="7"/><circle cx="490" cy="105" r="7"/>
    <circle cx="150" cy="325" r="7"/><circle cx="490" cy="325" r="7"/>
  </g>
`);

const systems = frame(`
  <g ${stroke} stroke="#37c6f0" stroke-width="3" filter="url(#soft)">
    <rect x="120" y="90" width="160" height="64" rx="8" fill="#08131f" stroke="#2b9fd4"/>
    <rect x="120" y="196" width="160" height="64" rx="8" fill="#08131f" stroke="#2b9fd4"/>
    <rect x="120" y="302" width="160" height="64" rx="8" fill="#08131f" stroke="#2b9fd4"/>
    <circle cx="152" cy="122" r="10" fill="#0d5f96" stroke="#5fd9f7"/>
    <circle cx="152" cy="228" r="10" fill="#0d5f96" stroke="#5fd9f7"/>
    <circle cx="152" cy="334" r="10" fill="#0d5f96" stroke="#5fd9f7"/>
    <g stroke="#4d7fa4" stroke-width="2.5">
      <line x1="176" y1="112" x2="258" y2="112"/><line x1="176" y1="132" x2="238" y2="132"/>
      <line x1="176" y1="218" x2="258" y2="218"/><line x1="176" y1="238" x2="238" y2="238"/>
      <line x1="176" y1="324" x2="258" y2="324"/><line x1="176" y1="344" x2="238" y2="344"/>
    </g>
    <path d="M280 122h58v38h38" stroke="#5fd9f7"/>
    <path d="M280 228h96v42" stroke="#5fd9f7"/>
    <path d="M280 334h58v-38h38" stroke="#5fd9f7"/>
    <circle cx="398" cy="160" r="14" fill="#0b3a5e" stroke="#37c6f0"/>
    <circle cx="398" cy="270" r="14" fill="#0b3a5e" stroke="#37c6f0"/>
    <path d="M398 174v82" stroke="#5fd9f7"/>
    <rect x="336" y="258" width="124" height="24" rx="12" fill="#0d5f96" stroke="#37c6f0"/>
    <g stroke="#bfe9fa" stroke-width="2"><path d="M366 270l8 8 14-16"/></g>
  </g>
`);

const ai = frame(`
  <g ${stroke} stroke="#37c6f0" stroke-width="3" filter="url(#soft)">
    <circle cx="320" cy="200" r="58" fill="#0b3a5e" stroke="#5fd9f7"/>
    <circle cx="320" cy="200" r="26" fill="#0d5f96" stroke="#bfe9fa"/>
    <g stroke="#2b9fd4" stroke-width="2.5">
      <line x1="320" y1="142" x2="320" y2="110"/><line x1="320" y1="258" x2="320" y2="290"/>
      <line x1="262" y1="200" x2="230" y2="200"/><line x1="378" y1="200" x2="410" y2="200"/>
      <line x1="279" y1="159" x2="256" y2="136"/><line x1="361" y1="159" x2="384" y2="136"/>
      <line x1="279" y1="241" x2="256" y2="264"/><line x1="361" y1="241" x2="384" y2="264"/>
    </g>
    <g fill="#37c6f0" stroke="none">
      <circle cx="320" cy="104" r="8"/><circle cx="320" cy="296" r="8"/>
      <circle cx="224" cy="200" r="8"/><circle cx="416" cy="200" r="8"/>
      <circle cx="251" cy="131" r="7"/><circle cx="389" cy="131" r="7"/>
      <circle cx="251" cy="269" r="7"/><circle cx="389" cy="269" r="7"/>
    </g>
    <g stroke="#5fd9f7" stroke-width="2.5">
      <path d="M300 188l14 14 26-28"/>
    </g>
  </g>
  <g ${stroke} stroke="#1c4a6e" stroke-width="2" stroke-dasharray="3 9">
    <circle cx="320" cy="200" r="118"/>
  </g>
`);

const tracking = frame(`
  <g ${stroke} stroke="#37c6f0" stroke-width="3" filter="url(#soft)">
    <path d="M150 340 C 190 250, 300 240, 340 180 S 440 110, 480 96" stroke="#2b9fd4" stroke-dasharray="10 8"/>
    <circle cx="150" cy="340" r="7" fill="#0d5f96" stroke="#5fd9f7"/>
    <circle cx="480" cy="96" r="9" fill="#0d5f96" stroke="#bfe9fa"/>
    <g>
      <circle cx="318" cy="200" r="16" fill="#0b3a5e" stroke="#37c6f0"/>
      <circle cx="318" cy="200" r="6" fill="#5fd9f7" stroke="none"/>
    </g>
    <path d="M318 216v34m0 12v22m-24-44h-30m88-24h26M300 232l-20 22m58-20l22 20" stroke="#5fd9f7" stroke-width="2.5"/>
    <circle cx="318" cy="152" r="10" fill="none" stroke="#37c6f0"/>
    <path d="M296 130a31 31 0 0 1 44 0M282 116a51 51 0 0 1 72 0" stroke="#2b9fd4"/>
  </g>
  <g ${stroke} stroke="#1c4a6e" stroke-width="2">
    <circle cx="480" cy="96" r="16" stroke-dasharray="4 6"/>
    <path d="M516 60l18-18m0 0h-14m14 0v14M516 132l18 18m0 0h-14m14 0v-14"/>
  </g>
`);

const mobile = frame(`
  <g ${stroke} stroke="#37c6f0" stroke-width="3" filter="url(#soft)">
    <rect x="238" y="76" width="164" height="300" rx="26" fill="#08131f" stroke="#2b9fd4"/>
    <rect x="254" y="104" width="132" height="230" rx="6" fill="#0a2035"/>
    <line x1="296" y1="90" x2="344" y2="90" stroke="#4d7fa4"/>
    <circle cx="320" cy="358" r="9" stroke="#4d7fa4"/>
    <rect x="270" y="126" width="100" height="10" rx="5" fill="#bfe9fa" stroke="none" opacity=".9"/>
    <rect x="270" y="146" width="72" height="10" rx="5" fill="#4d7fa4" stroke="none" opacity=".7"/>
    <g fill="#0d5f96" stroke="#37c6f0">
      <rect x="270" y="172" width="46" height="46" rx="9"/>
      <rect x="324" y="172" width="46" height="46" rx="9"/>
      <rect x="270" y="228" width="46" height="46" rx="9"/>
      <rect x="324" y="228" width="46" height="46" rx="9" fill="#0b3a5e"/>
    </g>
    <path d="M334 250l12 12 20-22" stroke="#5fd9f7"/>
    <path d="M284 196h18m-9-9v18M290 252a7 7 0 1 0 0.1 0" stroke="#bfe9fa" stroke-width="2.5"/>
    <path d="M284 296l24 14-10 10 14 14" stroke="#5fd9f7" stroke-width="2.5"/>
    <path d="M356 296l-24 14 10 10-14 14" stroke="#5fd9f7" stroke-width="2.5"/>
  </g>
  <g ${stroke} stroke="#1c4a6e" stroke-width="2">
    <path d="M180 140c-22 40-22 120 0 160m280-160c22 40 22 120 0 160"/>
  </g>
`);

const desktop = frame(`
  <g ${stroke} stroke="#37c6f0" stroke-width="3" filter="url(#soft)">
    <rect x="128" y="110" width="284" height="180" rx="10" fill="#08131f" stroke="#2b9fd4"/>
    <rect x="146" y="128" width="248" height="128" rx="4" fill="#0a2035"/>
    <path d="M270 290l-14 34m28-34l14 34m-58 0h88" stroke="#2b9fd4"/>
    <rect x="430" y="150" width="86" height="150" rx="8" fill="#0a2035" stroke="#2b9fd4"/>
    <g stroke="#4d7fa4" stroke-width="2.5">
      <line x1="162" y1="146" x2="220" y2="146"/><line x1="162" y1="166" x2="200" y2="166"/>
      <line x1="162" y1="186" x2="228" y2="186"/><line x1="162" y1="206" x2="192" y2="206"/>
    </g>
    <rect x="270" y="150" width="106" height="64" rx="6" fill="#0d5f96" stroke="#37c6f0"/>
    <path d="M286 196l20-20 22 12 26-24" stroke="#5fd9f7"/>
    <g fill="#0d5f96" stroke="#37c6f0">
      <rect x="270" y="226" width="48" height="30" rx="5"/>
      <rect x="328" y="226" width="48" height="30" rx="5"/>
    </g>
    <g fill="#0d5f96" stroke="#4d7fa4">
      <rect x="446" y="166" width="54" height="20" rx="4"/>
      <rect x="446" y="196" width="54" height="20" rx="4"/>
      <rect x="446" y="226" width="54" height="20" rx="4"/>
    </g>
    <path d="M460 176h26m-26 30h26m-26 30h26" stroke="#5fd9f7" stroke-width="2.5"/>
  </g>
`);

const ecommerce = frame(`
  <g ${stroke} stroke="#37c6f0" stroke-width="3" filter="url(#soft)">
    <path d="M226 152v-14a34 34 0 0 1 68 0v14m32 0v-14a34 34 0 0 1 68 0v14" stroke="#5fd9f7"/>
    <path d="M196 152h248l-18 178a20 20 0 0 1-20 18H234a20 20 0 0 1-20-18z" fill="#08131f" stroke="#2b9fd4"/>
    <path d="M196 152h248l-6 58H202z" fill="#0b3a5e" stroke="#37c6f0"/>
    <path d="M262 262c0 44 34 74 58 74s58-30 58-74" stroke="#5fd9f7"/>
    <path d="M362 300l20 20 38-42" stroke="#bfe9fa"/>
    <circle cx="248" cy="181" r="5" fill="#37c6f0" stroke="none"/>
    <circle cx="392" cy="181" r="5" fill="#37c6f0" stroke="none"/>
  </g>
  <g ${stroke} stroke="#1c4a6e" stroke-width="2">
    <circle cx="150" cy="120" r="5"/><circle cx="170" cy="140" r="5"/>
    <circle cx="490" cy="280" r="5"/><circle cx="470" cy="300" r="5"/>
  </g>
`);

const database = frame(`
  <g ${stroke} stroke="#37c6f0" stroke-width="3" filter="url(#soft)">
    <g fill="#08131f" stroke="#2b9fd4">
      <ellipse cx="240" cy="120" rx="86" ry="26"/>
      <path d="M154 120v50c0 14 39 26 86 26s86-12 86-26v-50"/>
      <path d="M154 170v50c0 14 39 26 86 26s86-12 86-26v-50"/>
      <path d="M154 220v50c0 14 39 26 86 26s86-12 86-26v-50"/>
    </g>
    <ellipse cx="240" cy="120" rx="86" ry="26" fill="#0b3a5e" stroke="#5fd9f7"/>
    <g fill="#0d5f96" stroke="#37c6f0">
      <rect x="392" y="132" width="118" height="34" rx="6"/>
      <rect x="392" y="184" width="118" height="34" rx="6"/>
      <rect x="392" y="236" width="118" height="34" rx="6"/>
    </g>
    <path d="M326 149h66m-66 52h66m-66 52h66" stroke="#5fd9f7" stroke-dasharray="7 7"/>
    <g fill="#5fd9f7"><circle cx="412" cy="149" r="4"/><circle cx="412" cy="201" r="4"/><circle cx="412" cy="253" r="4"/></g>
    <g stroke="#4d7fa4" stroke-width="2.5"><path d="M436 149h56m-56 52h56m-56 52h56"/></g>
  </g>
`);

const marketing = frame(`
  <g ${stroke} stroke="#37c6f0" stroke-width="3" filter="url(#soft)">
    <path d="M132 320l92-92 66 40 108-128" stroke="#2b9fd4" stroke-dasharray="1 0"/>
    <path d="M132 320l92-92 66 40 108-128" stroke="#5fd9f7" stroke-width="2" opacity=".55"/>
    <path d="M398 140v-36m0 36h-36m36 0l-52 52" stroke="#37c6f0" stroke-width="2.5"/>
    <g fill="#0d5f96" stroke="#37c6f0">
      <rect x="150" y="252" width="34" height="68" rx="6"/>
      <rect x="208" y="216" width="34" height="104" rx="6"/>
      <rect x="266" y="232" width="34" height="88" rx="6"/>
      <rect x="324" y="180" width="34" height="140" rx="6" fill="#0b3a5e"/>
    </g>
    <path d="M132 334h336" stroke="#4d7fa4"/>
    <circle cx="398" cy="140" r="9" fill="#0b3a5e" stroke="#bfe9fa"/>
    <g ${stroke} stroke="#2b9fd4" stroke-width="2.5" stroke-dasharray="5 7">
      <circle cx="398" cy="140" r="34"/>
    </g>
  </g>
`);

const custom = frame(`
  <g ${stroke} stroke="#37c6f0" stroke-width="3" filter="url(#soft)">
    <rect x="230" y="86" width="180" height="110" rx="12" fill="#08131f" stroke="#5fd9f7" stroke-dasharray="10 8"/>
    <path d="M320 116v50m-25-25h50" stroke="#bfe9fa" stroke-width="3.5"/>
    <circle cx="320" cy="141" r="44" fill="none" stroke="#37c6f0" opacity=".35"/>
    <path d="M320 196v22m0 0h-110m110-22h110" stroke="#2b9fd4"/>
    <rect x="162" y="218" width="148" height="100" rx="10" fill="#0a2035" stroke="#2b9fd4"/>
    <rect x="330" y="218" width="148" height="100" rx="10" fill="#0a2035" stroke="#2b9fd4"/>
    <g stroke="#4d7fa4" stroke-width="2.5">
      <line x1="182" y1="246" x2="286" y2="246"/><line x1="182" y1="268" x2="258" y2="268"/><line x1="182" y1="290" x2="272" y2="290"/>
      <line x1="350" y1="246" x2="454" y2="246"/><line x1="350" y1="268" x2="426" y2="268"/><line x1="350" y1="290" x2="440" y2="290"/>
    </g>
    <g stroke="#5fd9f7" stroke-width="2.5">
      <path d="M236 246l10 10 18-20"/>
      <path d="M404 246l10 10 18-20"/>
    </g>
  </g>
`);

/* ------------------------------- rendering ------------------------------- */

const images = {
  "website-development": website,
  "systems-development": systems,
  "ai-systems-automation": ai,
  "tracking-systems": tracking,
  "mobile-applications": mobile,
  "desktop-applications": desktop,
  "e-commerce-solutions": ecommerce,
  "database-solutions": database,
  "digital-marketing-branding": marketing,
  "custom-solutions": custom,
};

await mkdir(OUT_DIR, { recursive: true });
for (const [id, svg] of Object.entries(images)) {
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
  await writeFile(join(OUT_DIR, `${id}.png`), png);
  console.log(`✓ ${id}.png (${(png.length / 1024).toFixed(1)} kB)`);
}
console.log(`\nDone → ${OUT_DIR}`);
