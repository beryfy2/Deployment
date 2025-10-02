#!/usr/bin/env node

/**
 * Beryfy Deployment Setup Script
 * This script helps prepare your project for deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Beryfy Deployment Setup\n');

// Check if required files exist
const requiredFiles = [
    'backend/package.json',
    'backend/server.js',
    'backend/render.yaml',
    'frontend/package.json',
    'frontend/netlify.toml',
    'frontend/src/config/api.js'
];

console.log('📋 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n❌ Some required files are missing. Please ensure all files are present.');
    process.exit(1);
}

console.log('\n📝 Environment Variables Needed:');
console.log('\nBackend (Render):');
console.log('- NODE_ENV=production');
console.log('- EMAIL_USER=your-gmail@gmail.com');
console.log('- EMAIL_PASS=your-gmail-app-password');
console.log('- FRONTEND_URL=https://your-netlify-app.netlify.app');

console.log('\nFrontend (Netlify):');
console.log('- VITE_API_URL=https://your-render-app.onrender.com');

console.log('\n🔗 Deployment URLs:');
console.log('- Render: https://dashboard.render.com/');
console.log('- Netlify: https://app.netlify.com/');

console.log('\n📖 For detailed instructions, see DEPLOYMENT.md');
console.log('\n✅ Setup check complete! Ready for deployment.');
