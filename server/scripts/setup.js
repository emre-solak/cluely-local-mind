
const fs = require('fs').promises;
const path = require('path');

async function setupDirectories() {
  console.log('🔧 Setting up backend directories...');
  
  const directories = [
    './data',
    './uploads',
    './logs'
  ];
  
  for (const dir of directories) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } catch (error) {
      console.error(`❌ Failed to create directory ${dir}:`, error.message);
    }
  }
  
  console.log('🎉 Setup completed!');
  console.log('\nNext steps:');
  console.log('1. Run "npm install" to install dependencies');
  console.log('2. Run "npm run dev" to start the development server');
  console.log('3. Configure Ollama integration in the frontend');
}

setupDirectories().catch(console.error);
