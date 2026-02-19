#!/usr/bin/env node
/**
 * Asset Curation & Optimization Script
 * Copies selected assets from Desktop dump, resizes/compresses, outputs to public/assets/
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_ROOT = 'C:/Users/shima/Desktop/ASSETS';
const OUT_ROOT = path.join(__dirname, '..', 'public');
const MAX_WIDTH = 1920;

// Asset manifest: [source_relative_path, dest_path, options]
const IMAGE_MANIFEST = [
  // === GATE (Hero) ===
  [
    'neon-3d-abstract-shapes-2024-08-17-08-22-30-utc/Neon 3D Abstract Shapes 1/PNG/V1/Soft Body 31.png',
    'assets/gate/neon-shape-1.webp',
  ],
  [
    'neon-3d-abstract-shapes-2024-08-17-08-22-30-utc/Neon 3D Abstract Shapes 1/PNG/V1/Soft Body 35.png',
    'assets/gate/neon-shape-2.webp',
  ],
  [
    'holographic-background-2024-08-29-20-11-15-utc/PNG/Holographic_1.png',
    'assets/gate/holographic-bg.webp',
  ],

  // === WOW (Visual Energy) ===
  [
    'neon-3d-abstract-shapes-2024-08-21-20-21-47-utc/Neon 3D Abstract Shapes 2/PNG/V1/Soft Body 1.png',
    'assets/wow/neon-shape-1.webp',
  ],
  [
    'neon-3d-abstract-shapes-2024-08-21-20-21-47-utc/Neon 3D Abstract Shapes 2/PNG/V1/Soft Body 5.png',
    'assets/wow/neon-shape-2.webp',
  ],
  [
    'holographic-3d-shapes-illustration-pack-02-2023-11-27-05-06-08-utc/1.png',
    'assets/wow/holo-shape-1.webp',
  ],
  [
    'holographic-3d-shapes-illustration-pack-02-2023-11-27-05-06-08-utc/5.png',
    'assets/wow/holo-shape-5.webp',
  ],
  [
    'holographic-3d-shapes-illustration-pack-02-2023-11-27-05-06-08-utc/12.png',
    'assets/wow/holo-shape-12.webp',
  ],
  [
    'rorschach-experimental-glitch-backgrounds-v01-2023-11-27-05-18-03-utc/background-15.jpg',
    'assets/wow/rorschach-bg-1.webp',
  ],
  [
    'rorschach-experimental-glitch-backgrounds-v01-2023-11-27-05-18-03-utc/background-22.jpg',
    'assets/wow/rorschach-bg-2.webp',
  ],
  [
    'modern-neon-futuristic-pattern-2024-09-23-22-48-00-utc/Modern Neon Futuristic Pattern/Png/Modern Neon Futuristic Pattern.png',
    'assets/wow/neon-pattern.webp',
  ],

  // === PITCH (Meet Sal) ===
  [
    'ai-chip-neural-processor-2026-02-10-08-45-57-utc/Ai Chip.png',
    'assets/pitch/ai-chip.webp',
  ],
  [
    'ai-image-generator-2026-02-10-10-35-52-utc/Ai Image Generator.png',
    'assets/pitch/ai-generator.webp',
  ],

  // === MACHINE (Process) ===
  [
    'futuristic-hud-tech-frame-border-game-screen-2023-11-27-05-05-40-utc/PNG/hudframeart-01.png',
    'assets/machine/hud-frame-1.webp',
  ],
  [
    'futuristic-hud-tech-frame-border-game-screen-2023-11-27-05-05-40-utc/PNG/hudframeart-05.png',
    'assets/machine/hud-frame-5.webp',
  ],
  [
    'futuristic-hud-tech-frame-border-game-screen-2023-11-27-05-05-40-utc/PNG/hudframeart-10.png',
    'assets/machine/hud-frame-10.webp',
  ],
  [
    'hud-user-interface-set-2023-11-27-05-14-29-utc/preview_1.png',
    'assets/machine/hud-ui-1.webp',
  ],
  [
    'hud-user-interface-set-2023-11-27-05-14-29-utc/preview_2.png',
    'assets/machine/hud-ui-2.webp',
  ],
  [
    'control-panel-pack-2025-05-12-20-58-15-utc/Control Panel Pack/Previews/Control Icon Pack.png',
    'assets/machine/control-icons.webp',
  ],
  [
    'control-panel-grid-2025-06-04-05-02-32-utc/Control Panel Grid/Previews/Control Panel Grid.png',
    'assets/machine/control-grid.webp',
  ],

  // === PROOF (Capabilities) ===
  [
    'holographic-3d-shapes-illustration-pack-02-2023-11-27-05-06-08-utc/2.png',
    'assets/proof/holo-shape-2.webp',
  ],
  [
    'holographic-3d-shapes-illustration-pack-02-2023-11-27-05-06-08-utc/8.png',
    'assets/proof/holo-shape-8.webp',
  ],
  [
    'holographic-3d-shapes-illustration-pack-02-2023-11-27-05-06-08-utc/15.png',
    'assets/proof/holo-shape-15.webp',
  ],
  [
    'ai-generate-toolkit-2026-02-17-14-18-32-utc/Generate AI.png',
    'assets/proof/ai-toolkit.webp',
  ],
  [
    'hud-user-interface-set-2023-11-27-05-14-29-utc/preview_3.png',
    'assets/proof/hud-ui-3.webp',
  ],

  // === ASK (Lead Capture) ===
  [
    'holographic-background-2024-08-29-20-11-15-utc/PNG/Holographic_3.png',
    'assets/ask/holographic-bg.webp',
  ],
  [
    'digital-glitch-effect-backgrounds-2025-04-29-15-37-10-utc/Glitch Backgrounds/Untitled_Artwork-4 2.png',
    'assets/ask/glitch-texture.webp',
  ],
];

// Geometric cyberpunk Y2K PNGs for pitch section (pick 10)
const CYBERPUNK_Y2K_DIR = '30-geometric-cyberpunk-y2k-elements-2023-11-27-04-55-48-utc/MAIN/PNG';
const CYBERPUNK_PICKS = ['01', '03', '05', '07', '10', '12', '15', '18', '22', '27'];

// Y2K Cyber SVGs for shared (copy all)
const Y2K_SVG_DIR = '222-cyber-y2k-elements-2023-11-27-05-28-45-utc/222 Cyber Y2K Elements/SVG';

// Y2K PNGs for pitch (pick 20)
const Y2K_PNG_DIR = '222-cyber-y2k-elements-2023-11-27-05-28-45-utc/222 Cyber Y2K Elements/PNG';
const Y2K_PNG_PICKS = [
  '01', '05', '10', '15', '20', '25', '30', '35', '40', '45',
  '50', '55', '60', '65', '70', '75', '80', '85', '90', '95'
];

// Audio files
const AUDIO_MANIFEST = [
  [
    'home-studio-2025-06-02-06-05-54-utc/Home Studio/Sfx/bell 1.mp3',
    'audio/bell.mp3',
  ],
  [
    'home-studio-2025-06-02-06-05-54-utc/Home Studio/Sfx/delay2.mp3',
    'audio/delay.mp3',
  ],
  [
    'retro-gamer-desk-2025-05-19-14-01-31-utc/Retro Gamer Desk/Sounds/mixkit-metal-button-push-1830_01.mp3',
    'audio/button-push.mp3',
  ],
  [
    'tunner-2025-08-17-18-04-07-utc/tunner_gmw_14/Bass SFX/A(3).mp3',
    'audio/bass-tone.mp3',
  ],
  [
    'camera-movement-transitions-for-davinci-resolve-2026-02-06-03-35-04-utc/Audio FX/Whoosh 6 (1 sec).wav',
    'audio/whoosh.wav',
  ],
];

let totalSaved = 0;
let totalOriginal = 0;

async function optimizeImage(srcPath, destPath) {
  const destFull = path.join(OUT_ROOT, destPath);
  const destDir = path.dirname(destFull);
  fs.mkdirSync(destDir, { recursive: true });

  const srcStats = fs.statSync(srcPath);
  const srcSize = srcStats.size;
  totalOriginal += srcSize;

  const isWebp = destPath.endsWith('.webp');
  let pipeline = sharp(srcPath);

  // Get metadata to check if resize needed
  const meta = await pipeline.metadata();
  if (meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }

  if (isWebp) {
    pipeline = pipeline.webp({ quality: 82, effort: 4 });
  }

  await pipeline.toFile(destFull);

  const destStats = fs.statSync(destFull);
  const destSize = destStats.size;
  totalSaved += destSize;

  const ratio = ((1 - destSize / srcSize) * 100).toFixed(0);
  console.log(
    `  ${destPath.padEnd(45)} ${fmtSize(srcSize)} → ${fmtSize(destSize)} (${ratio}% smaller)`
  );
}

function copyFile(srcPath, destPath) {
  const destFull = path.join(OUT_ROOT, destPath);
  const destDir = path.dirname(destFull);
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcPath, destFull);
  const size = fs.statSync(destFull).size;
  totalSaved += size;
  totalOriginal += size;
  console.log(`  ${destPath.padEnd(45)} ${fmtSize(size)} (copied)`);
}

function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

async function main() {
  console.log('=== Problem Solvers Asset Pipeline ===\n');

  // 1. Optimized images
  console.log('--- Optimizing images ---');
  for (const [src, dest] of IMAGE_MANIFEST) {
    const srcFull = path.join(ASSETS_ROOT, src);
    if (!fs.existsSync(srcFull)) {
      console.log(`  MISSING: ${src}`);
      continue;
    }
    await optimizeImage(srcFull, dest);
  }

  // 2. Cyberpunk Y2K PNGs → pitch
  console.log('\n--- Cyberpunk Y2K elements (pitch) ---');
  for (const num of CYBERPUNK_PICKS) {
    const src = path.join(ASSETS_ROOT, CYBERPUNK_Y2K_DIR, `${num}.png`);
    if (!fs.existsSync(src)) {
      console.log(`  MISSING: cyberpunk ${num}.png`);
      continue;
    }
    await optimizeImage(src, `assets/pitch/cyberpunk-${num}.webp`);
  }

  // 3. Y2K PNGs → pitch
  console.log('\n--- Y2K cyber PNGs (pitch) ---');
  for (const num of Y2K_PNG_PICKS) {
    const src = path.join(ASSETS_ROOT, Y2K_PNG_DIR, `${num}.png`);
    if (!fs.existsSync(src)) {
      console.log(`  MISSING: y2k-png ${num}.png`);
      continue;
    }
    await optimizeImage(src, `assets/pitch/y2k-${num}.webp`);
  }

  // 4. Y2K SVGs → shared (just copy, they're tiny)
  console.log('\n--- Y2K SVGs (shared) ---');
  const svgDir = path.join(ASSETS_ROOT, Y2K_SVG_DIR);
  if (fs.existsSync(svgDir)) {
    const svgs = fs.readdirSync(svgDir).filter((f) => f.endsWith('.svg'));
    for (const svg of svgs) {
      copyFile(path.join(svgDir, svg), `assets/shared/y2k-${svg}`);
    }
    console.log(`  Copied ${svgs.length} SVGs`);
  } else {
    console.log('  MISSING: Y2K SVG directory');
  }

  // 5. Audio files
  console.log('\n--- Audio files ---');
  for (const [src, dest] of AUDIO_MANIFEST) {
    const srcFull = path.join(ASSETS_ROOT, src);
    if (!fs.existsSync(srcFull)) {
      console.log(`  MISSING: ${src}`);
      continue;
    }
    copyFile(srcFull, dest);
  }

  // Summary
  console.log('\n=== Summary ===');
  console.log(`  Original total: ${fmtSize(totalOriginal)}`);
  console.log(`  Optimized total: ${fmtSize(totalSaved)}`);
  console.log(`  Saved: ${fmtSize(totalOriginal - totalSaved)} (${((1 - totalSaved / totalOriginal) * 100).toFixed(0)}%)`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
