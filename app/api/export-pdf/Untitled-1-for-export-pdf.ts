

// Working on localhost well
// Plan B:
// api/export-pdf/route.js
import puppeteer from "puppeteer";
import fs from "fs";

const logoBase64 = fs.readFileSync("public/logo.png").toString("base64");

export async function POST(req) {
    try {
        const { html } = await req.json();

        if (!html) {
            return new Response(JSON.stringify({ error: "Missing HTML" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();

        await page.setContent(
            `<!DOCTYPE html>
                <html>
                    <head>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    <style>
                        body { font-family: 'Inter', sans-serif; }
                        @page { margin: 40px 30px; }
                        header { position: fixed; top: -20px; left: 0; right: 0; text-align: center; font-size: 12px; color: gray; }
                        footer { position: fixed; bottom: -20px; left: 0; right: 0; text-align: center; font-size: 12px; color: gray; }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 12px 0;
                            font-size: 12px;
                        }
                        th, td {
                            border: 1px solid #e5e7eb;
                            padding: 6px 8px;
                        }
                        th {
                            background-color: #f3f4f6;
                            font-weight: 600;
                        }
                    </style>
                    </head>
                    <body>
                    ${html}
                    <footer>Page <span class="pageNumber"></span> of <span class="totalPages"></span></footer>
                    </body>
                </html>`,
                
            { waitUntil: "networkidle0" }
        );

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: `
                <div style="width:100%; text-align:center; font-size:10px; color:#374151;
                display:flex; align-items:center; justify-content:center; gap:6px;">
                <img src="data:image/png;base64,${logoBase64}" style="height:16px; object-fit:contain;" />
                <span style="font-weight:600; font-size:12px;">Curiosity</span>
                </div>
            `,
            footerTemplate: `
                <div style="font-size:8px; width:100%; text-align:center; color: gray;">
                Page <span class="pageNumber"></span> of <span class="totalPages"></span>
                </div>
            `,
            margin: { top: "60px", bottom: "60px" },
        });

        await browser.close();

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="library.pdf"',
            },
        });
    } catch (err) {
        console.error("❌ PDF export error:", err);
        return new Response(JSON.stringify({ error: "PDF generation failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
