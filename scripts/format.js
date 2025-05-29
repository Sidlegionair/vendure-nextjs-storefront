#!/usr/bin/env node

const { execSync } = require('child_process');
const semver = require('semver');
const fs = require('fs');
const path = require('path');

// Check Node.js version
const nodeVersion = process.version;
const requiredVersion = '14.0.0';

if (!semver.gte(nodeVersion, requiredVersion)) {
  console.error(`Error: Prettier requires Node.js version ${requiredVersion} or higher.`);
  console.error(`Your current Node.js version is ${nodeVersion}.`);
  console.error('Please upgrade your Node.js version to use the format script.');
  process.exit(1);
}

// Define files to ignore (files that cause issues with Prettier)
const ignoreFiles = [
  // Files that are causing issues with Prettier
  'README.md',
  '.github/workflows/main.yml',
  'src/components/storyblok/RichTextEditor.module.css',
  'src/styles/global.css'
];

// Create a temporary .prettierignore file if it doesn't exist
const prettierIgnorePath = path.join(__dirname, '..', '.prettierignore');
let originalPrettierIgnoreContent = '';
let prettierIgnoreExists = false;

try {
  if (fs.existsSync(prettierIgnorePath)) {
    prettierIgnoreExists = true;
    originalPrettierIgnoreContent = fs.readFileSync(prettierIgnorePath, 'utf8');

    // Append our ignore files to the existing .prettierignore
    const updatedContent = originalPrettierIgnoreContent + 
      (originalPrettierIgnoreContent.endsWith('\n') ? '' : '\n') + 
      ignoreFiles.join('\n');

    fs.writeFileSync(prettierIgnorePath, updatedContent);
  } else {
    // Create a new .prettierignore file
    fs.writeFileSync(prettierIgnorePath, ignoreFiles.join('\n'));
  }

  // Run prettier
  try {
    const patterns = [
      '{src,public,.github}/**/*.{js,ts,jsx,tsx,json,css,md,yml,yaml}',
      '*.{js,ts,jsx,tsx,json,css,md,yml,yaml}'
    ];

    console.log('Running Prettier...');
    execSync(`npx prettier --write ${patterns.map(p => `"${p}"`).join(' ')}`, { stdio: 'inherit' });
    console.log('Formatting complete!');
  } catch (error) {
    console.error('Error running Prettier:', error.message);
    console.error('\nIf specific files are causing issues, you can add them to the ignoreFiles array in scripts/format.js');
    process.exit(1);
  }
} finally {
  // Restore the original .prettierignore file
  if (prettierIgnoreExists) {
    fs.writeFileSync(prettierIgnorePath, originalPrettierIgnoreContent);
  } else if (fs.existsSync(prettierIgnorePath)) {
    fs.unlinkSync(prettierIgnorePath);
  }
}
