const { build } = require('vite');
const path = require('path');

async function buildApp() {
  console.log('Building React frontend...');
  try {
    await build({
      root: __dirname,
      base: '/',
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
      }
    });
    console.log('Build complete!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp();