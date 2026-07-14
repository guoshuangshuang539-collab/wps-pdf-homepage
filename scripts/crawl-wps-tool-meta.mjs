import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "scripts", "_crawled-wps-content.json");

const PAGES = [
  { slug: "compress-pdf", url: "https://pdf.wps.com/compress-pdf-online/" },
  { slug: "merge-pdf", url: "https://pdf.wps.com/merge-pdf-online/" },
  { slug: "split-pdf", url: "https://pdf.wps.com/split-pdf-online/" },
  { slug: "pdf-to-word", url: "https://pdf.wps.com/convert-pdf-to-word/" },
  { slug: "pdf-to-excel", url: "https://pdf.wps.com/convert-pdf-to-excel/" },
  { slug: "pdf-to-ppt", url: "https://pdf.wps.com/convert-pdf-to-ppt/" },
  { slug: "pdf-to-jpg", url: "https://pdf.wps.com/convert-pdf-to-jpg/" },
  { slug: "word-to-pdf", url: "https://pdf.wps.com/word-to-pdf/" },
  { slug: "excel-to-pdf", url: "https://pdf.wps.com/excel-to-pdf/" },
  { slug: "ppt-to-pdf", url: "https://pdf.wps.com/ppt-to-pdf/" },
  { slug: "jpg-to-pdf", url: "https://pdf.wps.com/jpg-to-pdf/" },
  { slug: "convert-pdf", url: "https://pdf.wps.com/convert-pdf/" },
  { slug: "signing-pdf", url: "https://pdf.wps.com/sign-pdf-online/" },
  { slug: "xml-to-pdf", url: "https://pdf.wps.com/xml-to-pdf/" },
  { slug: "word-to-jpg", url: "https://pdf.wps.com/word-to-jpg/" },
  { slug: "jpg-to-word", url: "https://pdf.wps.com/jpg-to-word/" }
];

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "User-Agent": "Mozilla/5.0 WPS-Demo-Crawl" }, timeout: 25000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith("http") ? res.headers.location : new URL(res.headers.location, url).href;
        fetchText(next).then(resolve, reject);
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
  });
}

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
}

function pickMeta(html, prop) {
  const re1 = new RegExp(`<meta[^>]+(?:name|property)=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i");
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${prop}["']`, "i");
  const m = html.match(re1) || html.match(re2);
  return m ? m[1] : "";
}

function pickTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? stripTags(m[1]) : "";
}

function pickH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? stripTags(m[1]) : "";
}

function pickSubtitleNearH1(html) {
  const m = html.match(/<h1[^>]*>[\s\S]*?<\/h1>\s*(?:<[^>]+>\s*){0,8}<p[^>]*>([\s\S]*?)<\/p>/i);
  return m ? stripTags(m[1]).slice(0, 420) : "";
}

const out = {};
for (const page of PAGES) {
  process.stdout.write(`crawl ${page.slug}… `);
  try {
    const html = await fetchText(page.url);
    out[page.slug] = {
      sourceUrl: page.url,
      title: pickTitle(html),
      h1: pickH1(html),
      description: pickMeta(html, "description") || pickSubtitleNearH1(html),
      ogTitle: pickMeta(html, "og:title"),
      status: "ok"
    };
    console.log("ok");
  } catch (e) {
    out[page.slug] = { sourceUrl: page.url, status: "error", error: String(e.message || e) };
    console.log("ERR", e.message || e);
  }
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2), "utf8");
console.log("wrote", OUT);
