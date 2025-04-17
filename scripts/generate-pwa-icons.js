#!/usr/bin/env node
/**
 * PWA Icon Generator for Dagaz
 *
 * This script generates all necessary PWA icons from a single source image
 * during the build process. It's integrated into the build pipeline
 * to automatically regenerate icons when needed.
 *
 * Usage:
 * - Place your source logo in static/src/logo.svg or static/src/logo.png
 * - Run script manually: node scripts/generate-pwa-icons.js
 * - Built into the build process via package.json prebuild step
 */

import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';
import {fileURLToPath} from 'url';

// Get current file's directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'static', 'src');
const ICON_OUTPUT_DIR = path.join(PROJECT_ROOT, 'static', 'icons');
const MANIFEST_PATH = path.join(PROJECT_ROOT, 'static', 'manifest.json');
const CONFIG = {
  logo: path.join(SRC_DIR, 'logo.svg'), // Primary source (fallback to logo.png)
  logoFallback: path.join(SRC_DIR, 'logo.png'),
  backgroundColor: '#232733',
  themeColor: '#ff9982',
  maskable: true,
  sizes: [72, 96, 128, 144, 152, 192, 384, 512]
};

/**
 * Check if Sharp is installed, and install if needed
 */
async function ensureSharpInstalled() {
  try {
    // Try to dynamically import sharp
    await import('sharp');
    console.log('✅ Sharp is already installed');
    return true;
  } catch (e) {
    console.log('⚙️ Sharp is not installed. Installing...');
    try {
      // Check if we're using pnpm, npm, or yarn
      const packageLockExists = fs.existsSync(path.join(PROJECT_ROOT, 'package-lock.json'));
      const yarnLockExists = fs.existsSync(path.join(PROJECT_ROOT, 'yarn.lock'));
      const pnpmLockExists = fs.existsSync(path.join(PROJECT_ROOT, 'pnpm-lock.yaml'));

      let installCmd = 'npm install --save-dev sharp';
      if (pnpmLockExists) {
        installCmd = 'pnpm add -D sharp';
      } else if (yarnLockExists) {
        installCmd = 'yarn add -D sharp';
      }

      execSync(installCmd, {stdio: 'inherit'});
      console.log('✅ Sharp installed successfully');
      return true;
    } catch (err) {
      console.error('❌ Failed to install Sharp:', err);
      console.log('Please install manually: pnpm add -D sharp');
      process.exit(1);
    }
  }
}

/**
 * Ensure required directories exist
 */
function ensureDirectories() {
  // Create src directory if it doesn't exist
  if (!fs.existsSync(SRC_DIR)) {
    fs.mkdirSync(SRC_DIR, {recursive: true});
    console.log(`📁 Created source directory: ${SRC_DIR}`);
  }

  // Create output directory if it doesn't exist
  if (!fs.existsSync(ICON_OUTPUT_DIR)) {
    fs.mkdirSync(ICON_OUTPUT_DIR, {recursive: true});
    console.log(`📁 Created output directory: ${ICON_OUTPUT_DIR}`);
  }
}

/**
 * Find the source logo file
 */
function findSourceLogo() {
  if (fs.existsSync(CONFIG.logo)) {
    return CONFIG.logo;
  } else if (fs.existsSync(CONFIG.logoFallback)) {
    return CONFIG.logoFallback;
  }

  console.log(`⚠️ No source logo found at ${CONFIG.logo} or ${CONFIG.logoFallback}`);
  console.log(`Creating a placeholder logo...`);

  // Create a placeholder SVG logo file
  const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="${CONFIG.backgroundColor}" />
    <path d="M135 90L280 255L430 90V400L280 230L135 400V90Z" fill="${CONFIG.themeColor}" />
  </svg>`;

  fs.writeFileSync(CONFIG.logo, placeholderSvg);
  console.log(`✅ Created placeholder SVG logo at ${CONFIG.logo}`);
  return CONFIG.logo;
}

/**
 * Update the manifest.json file with icon information
 */
function updateManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.log(`⚠️ No manifest.json found at ${MANIFEST_PATH}`);
    return;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

    // Update theme colors
    manifest.background_color = CONFIG.backgroundColor;
    manifest.theme_color = CONFIG.themeColor;

    // Update icons array
    manifest.icons = CONFIG.sizes.map(size => ({
      src: `/icons/icon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
      purpose: CONFIG.maskable ? 'any maskable' : 'any'
    }));

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`✅ Updated manifest.json with generated icons`);
  } catch (err) {
    console.error(`❌ Error updating manifest.json:`, err);
  }
}

/**
 * Generate the icons
 */
async function generateIcons(sourceLogoPath) {
  try {
    // Import sharp dynamically
    const sharp = (await import('sharp')).default;
    console.log(`🎨 Generating PWA icons from: ${sourceLogoPath}`);

    // Get image metadata
    const baseImage = sharp(sourceLogoPath);
    const metadata = await baseImage.metadata();
    console.log(`📊 Source image: ${metadata.width}x${metadata.height} ${metadata.format}`);

    // Generate each size
    for (const size of CONFIG.sizes) {
      const outputPath = path.join(ICON_OUTPUT_DIR, `icon-${size}x${size}.png`);

      console.log(`🔄 Generating ${size}x${size} icon...`);

      try {
        // Process the image
        await baseImage
          .clone()
          .resize(size, size, {
            fit: 'contain',
            background: CONFIG.backgroundColor
          })
          .png({quality: 90})
          .toFile(outputPath);

        console.log(`  ✅ Created: ${path.basename(outputPath)}`);
      } catch (sizeError) {
        console.error(`  ❌ Failed to create ${size}x${size} icon:`, sizeError);
      }
    }

    // Generate favicon.ico
    console.log('🔄 Generating favicon.png...');
    const faviconPath = path.join(PROJECT_ROOT, 'static', 'favicon.png');

    try {
      await baseImage
        .clone()
        .resize(32, 32, {
          fit: 'contain',
          background: CONFIG.backgroundColor
        })
        .png()
        .toFile(faviconPath);

      console.log(`✅ Created: favicon.png`);
    } catch (faviconError) {
      console.error('❌ Failed to create favicon:', faviconError);
    }

    // Update the manifest file
    updateManifest();

    console.log('\n🎉 All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting PWA Icon Generator');

  // Ensure directories exist
  ensureDirectories();

  // Make sure Sharp is installed
  await ensureSharpInstalled();

  // Find the source logo
  const sourceLogoPath = findSourceLogo();

  // Generate icons
  await generateIcons(sourceLogoPath);
}

// Run the script
main().catch(err => {
  console.error('❌ Unhandled error:', err);
  process.exit(1);
});
