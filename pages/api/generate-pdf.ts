// pages/api/generate-pdf.js
import puppeteer from 'puppeteer';

export default async function handler(req:any, res:any) {
    // Launch a new browser session.

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const htmlContent = `
    <html lang="en">
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .styled-div { background-color: #f0f0f0; padding: 20px; margin: 10px 0; border-radius: 8px; }
        </style>
        <title>LPO Preview</title>
      </head>
      <body>
        ${req.body}
      </body>
    </html>
  `;
    await page.setContent(htmlContent);
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdf);
}
