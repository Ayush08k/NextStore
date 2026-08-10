const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    console.log('Launching headless browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const htmlPath = path.join(__dirname, 'srs_document.html');
    const pdfPath = path.join(__dirname, 'NextStore_SRS.pdf');
    
    console.log(`Loading HTML from ${htmlPath}...`);
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    
    console.log('Generating PDF...');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        bottom: '15mm',
        left: '15mm',
        right: '15mm'
      }
    });

    await browser.close();
    console.log(`Successfully generated PDF at: ${pdfPath}`);
  } catch (err) {
    console.error('Error generating PDF:', err);
    process.exit(1);
  }
})();
