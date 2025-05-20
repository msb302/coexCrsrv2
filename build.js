const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Build frontend
console.log('Building frontend...');
exec('cd frontend && npm install', (error, stdout, stderr) => {
  if (error) {
    console.error(`Frontend npm install error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Frontend npm install stderr: ${stderr}`);
  }
  console.log(`Frontend npm install stdout: ${stdout}`);

  // Build the frontend assets
  exec('cd frontend && npx vite build', (error, stdout, stderr) => {
    if (error) {
      console.error(`Frontend build error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Frontend build stderr: ${stderr}`);
    }
    console.log(`Frontend build stdout: ${stdout}`);
    console.log('Frontend build complete!');

    // Install backend dependencies
    console.log('Installing backend dependencies...');
    exec('cd backend && npm install', (error, stdout, stderr) => {
      if (error) {
        console.error(`Backend npm install error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Backend npm install stderr: ${stderr}`);
      }
      console.log(`Backend npm install stdout: ${stdout}`);
      console.log('Backend dependencies installed!');
      
      console.log('Build complete! Run the app with: node backend/server.js');
    });
  });
});