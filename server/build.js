const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '.vercel/output/functions/index.func/');
const STATIC_DIR = path.join(__dirname, '.vercel/output/static/');
const REVALIDATE_INTERVAL = 60; // 1 minute

async function generateTimestampPage() {
  const timestamp = new Date().toISOString();

  const html = `
    <html>
      <head><title>Timestamp with ISR</title></head>
      <body>
        <h1>Current Timestamp</h1>
        <p>${timestamp}</p>
      </body>
    </html>
  `;

  return html;
}

async function buildOutput() {
  const htmlContent = await generateTimestampPage();

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(STATIC_DIR, { recursive: true });

  fs.writeFileSync(path.join(STATIC_DIR, 'index.html'), htmlContent);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.json'), JSON.stringify({ revalidate: REVALIDATE_INTERVAL }));
}

buildOutput().catch(console.error);
