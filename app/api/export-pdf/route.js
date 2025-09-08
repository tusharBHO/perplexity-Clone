import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const runtime = "nodejs";

export async function POST(req) {
    let browser = null;

    try {
        const { html } = await req.json();

        const executablePath =
            process.env.NODE_ENV === "production"
                ? await chromium.executablePath() // on Vercel
                : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"; // path for local Windows - adjust if needed

        browser = await puppeteer.launch({
            args: process.env.NODE_ENV === "production"
                ? chromium.args
                : [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                    "--single-process",
                    "--no-zygote",
                ],
            defaultViewport: chromium.defaultViewport,
            executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: 60, bottom: 60 },
        });

        await browser.close();

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="file.pdf"',
            },
        });
    } catch (err) {
        if (browser) await browser.close();

        return new Response(
            JSON.stringify({ error: err.message || "Unknown error generating PDF" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}










// // // app/api/export-pdf/route.js
// import chromium from '@sparticuz/chromium';
// import puppeteer from 'puppeteer-core';

// export const runtime = 'nodejs'; // Use Node.js runtime

// export async function POST(req) {
//     try {
//         const { html } = await req.json();
//         // Launch browser with the serverless Chromium
//         const browser = await puppeteer.launch({
//             args: chromium.args,
//             defaultViewport: chromium.defaultViewport,
//             executablePath: await chromium.executablePath(),
//             headless: chromium.headless,
//             ignoreHTTPSErrors: true,
//         });
//         const page = await browser.newPage();
//         await page.setContent(html, { waitUntil: 'networkidle0' });

//         const pdfBuffer = await page.pdf({
//             format: 'A4',
//             printBackground: true,
//             margin: { top: 60, bottom: 60 },
//         });

//         await browser.close();

//         return new Response(pdfBuffer, {
//             status: 200,
//             headers: {
//                 'Content-Type': 'application/pdf',
//                 'Content-Disposition': 'attachment; filename="file.pdf"',
//             },
//         });
//     } catch (err) {
//         return new Response(JSON.stringify({ error: err.message }), {
//             status: 500,
//             headers: { 'Content-Type': 'application/json' },
//         });
//     }
// }







// // Plan B:
// // api/export-pdf/route.js
// export const runtime = 'nodejs';

// import puppeteer from 'puppeteer';
// import fs from 'fs';

// const logoBase64 = fs.readFileSync('public/logo.png').toString('base64');

// export async function POST(req) {
//     try {
//         const { html } = await req.json();

//         if (!html) {
//             return new Response(JSON.stringify({ error: "Missing HTML" }), {
//                 status: 400,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         const browser = await puppeteer.launch({
//             headless: 'new',
//             args: ['--no-sandbox', '--disable-setuid-sandbox'],
//         });

//         const page = await browser.newPage();
//         await page.setContent(
//             `<!DOCTYPE html>
//                 <html>
//                     <head>
//                     <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
//                     <style> /* Styles */ </style>
//                     </head>
//                     <body>${html}
//                         <footer>Page <span class="pageNumber"></span> of <span class="totalPages"></span></footer>
//                     </body>
//                 </html>`,
//             { waitUntil: 'networkidle0' }
//         );

//         const pdfBuffer = await page.pdf({
//             format: 'A4',
//             printBackground: true,
//             displayHeaderFooter: true,
//             headerTemplate: `
//                 <div style="...">
//                     <img src="data:image/png;base64,${logoBase64}" style="height:16px;" />
//                     <span style="font-weight:600;">Curiosity</span>
//                 </div>`,
//             footerTemplate: `
//                 <div style="...">
//                     Page <span class="pageNumber"></span> of <span class="totalPages"></span>
//                 </div>`,
//             margin: { top: '60px', bottom: '60px' },
//         });

//         await browser.close();

//         return new Response(pdfBuffer, {
//             status: 200,
//             headers: {
//                 'Content-Type': 'application/pdf',
//                 'Content-Disposition': 'attachment; filename="library.pdf"',
//             },
//         });
//     } catch (err) {
//         console.error('❌ PDF export error:', err);
//         return new Response(JSON.stringify({ error: 'PDF generation failed' }), {
//             status: 500,
//             headers: { 'Content-Type': 'application/json' },
//         });
//     }
// };

// export async function GET() {
//     return new Response('Method GET not supported', { status: 405 });
// }











// // Working on localhost well
// // Plan B:
// // api/export-pdf/route.js
// import puppeteer from "puppeteer";
// import fs from "fs";

// const logoBase64 = fs.readFileSync("public/logo.png").toString("base64");

// export async function POST(req) {
//     try {
//         const { html } = await req.json();

//         if (!html) {
//             return new Response(JSON.stringify({ error: "Missing HTML" }), {
//                 status: 400,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         const browser = await puppeteer.launch({
//             headless: "new",
//             args: ["--no-sandbox", "--disable-setuid-sandbox"],
//         });
//         const page = await browser.newPage();

//         await page.setContent(
//             `<!DOCTYPE html>
//                 <html>
//                     <head>
//                     <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
//                     <style>
//                         body { font-family: 'Inter', sans-serif; }
//                         @page { margin: 40px 30px; }
//                         header { position: fixed; top: -20px; left: 0; right: 0; text-align: center; font-size: 12px; color: gray; }
//                         footer { position: fixed; bottom: -20px; left: 0; right: 0; text-align: center; font-size: 12px; color: gray; }
//                         table {
//                             width: 100%;
//                             border-collapse: collapse;
//                             margin: 12px 0;
//                             font-size: 12px;
//                         }
//                         th, td {
//                             border: 1px solid #e5e7eb;
//                             padding: 6px 8px;
//                         }
//                         th {
//                             background-color: #f3f4f6;
//                             font-weight: 600;
//                         }
//                     </style>
//                     </head>
//                     <body>
//                     ${html}
//                     <footer>Page <span class="pageNumber"></span> of <span class="totalPages"></span></footer>
//                     </body>
//                 </html>`,
//             { waitUntil: "networkidle0" }
//         );

//         const pdfBuffer = await page.pdf({
//             format: "A4",
//             printBackground: true,
//             displayHeaderFooter: true,
//             headerTemplate: `
//                 <div style="width:100%; text-align:center; font-size:10px; color:#374151;
//                 display:flex; align-items:center; justify-content:center; gap:6px;">
//                 <img src="data:image/png;base64,${logoBase64}" style="height:16px; object-fit:contain;" />
//                 <span style="font-weight:600; font-size:12px;">Curiosity</span>
//                 </div>
//             `,
//             footerTemplate: `
//                 <div style="font-size:8px; width:100%; text-align:center; color: gray;">
//                 Page <span class="pageNumber"></span> of <span class="totalPages"></span>
//                 </div>
//             `,
//             margin: { top: "60px", bottom: "60px" },
//         });

//         await browser.close();

//         return new Response(pdfBuffer, {
//             status: 200,
//             headers: {
//                 "Content-Type": "application/pdf",
//                 "Content-Disposition": 'attachment; filename="library.pdf"',
//             },
//         });
//     } catch (err) {
//         console.error("❌ PDF export error:", err);
//         return new Response(JSON.stringify({ error: "PDF generation failed" }), {
//             status: 500,
//             headers: { "Content-Type": "application/json" },
//         });
//     }
// }
