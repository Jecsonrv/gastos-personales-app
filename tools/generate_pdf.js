const fs = require("fs");
const path = require("path");
const marked = require("marked");
const puppeteer = require("puppeteer");

(async () => {
    try {
        const mdPath = path.resolve(
            __dirname,
            "..",
            "presentacion_frontend.md"
        );
        const outPdf = path.resolve(__dirname, "presentacion_frontend.pdf");
        const md = fs.readFileSync(mdPath, "utf8");
        const html = `
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { font-family: Arial, Helvetica, sans-serif; padding: 24px; }
          h1,h2,h3 { color: #0f172a; }
          pre { background:#f3f4f6; padding:12px; }
          code { background:#f3f4f6; padding:2px 4px; }
          img { max-width: 100%; }
        </style>
      </head>
      <body>
        ${marked.parse(md)}
      </body>
      </html>
    `;

        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
        await page.pdf({ path: outPdf, format: "A4", printBackground: true });
        await browser.close();
        console.log("PDF generado en:", outPdf);
    } catch (err) {
        console.error("Error generando PDF:", err);
        process.exitCode = 1;
    }
})();
