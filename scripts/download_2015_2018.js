import https from 'https';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const urls = [
    { year: 2018, type: 'Suneung', url: 'https://legendstudy.com/1231' },
    { year: 2018, type: 'Sept', url: 'https://legendstudy.com/1190' },
    { year: 2018, type: 'June', url: 'https://legendstudy.com/1289' },
    { year: 2018, type: 'July', url: 'https://legendstudy.com/1296' },
    { year: 2017, type: 'Suneung', url: 'https://legendstudy.com/1051' },
    { year: 2017, type: 'Sept', url: 'https://legendstudy.com/1006' },
    { year: 2017, type: 'June', url: 'https://legendstudy.com/1121' },
    { year: 2017, type: 'April', url: 'https://legendstudy.com/1118' },
    { year: 2016, type: 'Suneung', url: 'https://legendstudy.com/820' },
    { year: 2016, type: 'Sept', url: 'https://legendstudy.com/787' },
    { year: 2016, type: 'April', url: 'https://legendstudy.com/938' },
    { year: 2016, type: 'March', url: 'https://legendstudy.com/918' },
    { year: 2015, type: 'Suneung', url: 'https://legendstudy.com/677' },
    { year: 2015, type: 'Sept', url: 'https://legendstudy.com/653' }
];

const outputDir = path.join(process.cwd(), 'data/raw_pdfs');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function fetchHtml(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
            res.on('error', err => reject(err));
        }).on('error', err => reject(err));
    });
}

async function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
        const cmd = `curl.exe -k -L -A "Mozilla/5.0" -o "${filename}" "${url}"`;
        console.log(`Executing: ${cmd}`);
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error downloading ${url}:`, error);
                resolve(false);
            } else {
                console.log(`Downloaded ${filename}`);
                resolve(true);
            }
        });
    });
}

async function processUrls() {
    for (const item of urls) {
        console.log(`Processing ${item.year} ${item.type}...`);
        try {
            const html = await fetchHtml(item.url);

            // Regex to find links where text contains "영어" and "문제" (or just "영어" if loose) and ".pdf"
            // We capture the href and the text
            const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis;
            let match;
            let downloadUrl = null;

            while ((match = linkRegex.exec(html)) !== null) {
                const href = match[1];
                const text = match[2];

                // Check if text indicates it's the English Question Paper PDF
                if (text.includes('.pdf') && text.includes('영어') && (text.includes('문제') || text.includes('Question'))) {
                    downloadUrl = href;
                    console.log(`Found PDF link: ${href} (Text: ${text.trim()})`);
                    break; // Found it
                }
            }

            if (downloadUrl) {
                // Handle relative URLs if any (though Tistory usually uses absolute)
                if (!downloadUrl.startsWith('http')) {
                    // This is rare for Tistory attachments but good to handle
                    console.log(`Skipping relative URL: ${downloadUrl}`);
                    continue;
                }

                const filename = path.join(outputDir, `${item.year}_${item.type}_English.pdf`);
                await downloadFile(downloadUrl, filename);
            } else {
                console.log(`No matching PDF link found for ${item.year} ${item.type}`);
            }

        } catch (error) {
            console.error(`Failed to process ${item.url}:`, error);
        }

        // Polite delay
        await new Promise(r => setTimeout(r, 1000));
    }
}

processUrls();
