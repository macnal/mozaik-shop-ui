/* eslint-disable */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUT_FILE = path.join(PUBLIC_DIR, 'sitemap.xml');

function walkDir(dir, fileList = []) {
    const files = fs.readdirSync(dir, {withFileTypes: true});
    for (const f of files) {
        const full = path.join(dir, f.name);
        if (f.isDirectory()) {
            walkDir(full, fileList);
        } else {
            fileList.push(full);
        }
    }
    return fileList;
}


async function collectItems() {
    const apiUrl = 'https://api.guildmage.eu/weblinker/products';
    const urls = new Set();

    // helper: fetch via https (Node) when global fetch is not available
    async function fetchWithHttps(url, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const https = require('https');
            const req = https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        resolve({ok: true, json, headers: res.headers});
                    } catch (e) {
                        reject(e);
                    }
                });
            });
            req.on('error', reject);
            req.setTimeout(timeout, () => {
                req.destroy(new Error('timeout'));
                reject(new Error('timeout'));
            });
        });
    }

    // helper: unified fetch that returns { json, headers }
    async function fetchOne(url) {
        if (typeof fetch === 'function') {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);
            try {
                const res = await fetch(url, {signal: controller.signal});
                clearTimeout(timeout);
                const json = await res.json();
                // build headers map
                const headers = {};
                try {
                    res.headers.forEach((v, k) => {
                        headers[k.toLowerCase()] = v;
                    });
                } catch (e) {
                    // ignore
                }
                return {json, headers};
            } catch (e) {
                clearTimeout(timeout);
                throw e;
            }
        } else {
            const r = await fetchWithHttps(url, 5000);
            return {json: r.json, headers: r.headers || {}};
        }
    }

    // Follow pagination (multiple strategies supported)
    try {
        let nextUrl = apiUrl;
        let pageCount = 0;
        const MAX_PAGES = 200; // safety limit

        while (nextUrl && pageCount < MAX_PAGES) {
            pageCount++;
            let resp;
            try {
                console.log('nextUrl', nextUrl);
                resp = await fetchOne(nextUrl);
            } catch (e) {
                console.warn('Sitemap: fetch page error, breaking pagination -', e && e.message ? e.message : e);
                break;
            }
            const jsonRes = resp.json;

            const itemsArray = Array.isArray(jsonRes) ? jsonRes : (jsonRes.items || []);
            for (const it of itemsArray) {
                urls.add('/' + it.categorySlug)
                urls.add('/' + it.categorySlug + '/' + it.slug)
            }

            var foundNext = null;

            if (jsonRes && jsonRes.page && (jsonRes.page.number !== undefined) && (jsonRes.page.totalPages !== undefined)) {
                const cur = Number(jsonRes.page.number);
                const total = Number(jsonRes.page.totalPages);
                // if pages are zero-based (number), go to next when cur < total-1
                if (cur < total - 1) {
                    const u = new URL(nextUrl);
                    u.searchParams.set('page', String(cur + 1));
                    foundNext = u.toString();
                }
            }

            // if no next found, stop
            if (foundNext) {
                nextUrl = foundNext;
                console.log('Sitemap: following to next page via page param:', nextUrl);
                // normalize relative paths
                try {
                    if (nextUrl.startsWith('/')) {
                        const base = new URL(apiUrl);
                        nextUrl = base.origin + nextUrl;
                    }
                } catch (e) {
                    // ignore URL normalization errors
                }
            } else {
                nextUrl = null;
            }
        }

        if (pageCount >= MAX_PAGES) console.warn('Sitemap: reached MAX_PAGES limit while paginating');

        if (urls.size > 0) return urls;
    } catch (e) {
        console.warn('Sitemap: pagination error, falling back to local mocks -', e && e.message ? e.message : e);
    }

    return urls;
}


function buildSitemap(urls, hostname) {
    const now = new Date().toISOString();
    const header = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    const footer = '</urlset>\n';
    const body = Array.from(urls).map(u => {
        const loc = hostname ? hostname.replace(/\/$/, '') + u : u;
        return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
    }).join('\n');
    return header + body + '\n' + footer;
}

async function main() {
    const hostname = 'https://shop.guildmage.pl';
    const items = await collectItems();

    // combine
    const urls = new Set();
    // add homepage explicitly
    urls.add('/');
    for (const i of items) urls.add(i);

    // normalize: ensure each starts with /
    const normalized = new Set();
    for (const u of urls) {
        if (!u) continue;
        normalized.add(u.startsWith('/') ? u : '/' + u);
    }

    const xml = buildSitemap([...normalized].sort(), hostname);

    if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, {recursive: true});
    fs.writeFileSync(OUT_FILE, xml, 'utf8');
    console.log(`Wygenerowano sitemap: ${OUT_FILE}`);
    console.log(`Ilość URL-i: ${normalized.size}`);
}

if (require.main === module) {
    main();
}

module.exports = {main};
