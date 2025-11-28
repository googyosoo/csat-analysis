import fs from 'fs';
import path from 'path';
import https from 'https';

const linksPath = path.join(process.cwd(), 'found_links_all.json');

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
};

async function downloadAll() {
    try {
        let content;
        try {
            content = fs.readFileSync(linksPath, 'utf16le');
            if (content.charCodeAt(0) === 0xFEFF) {
                content = content.slice(1);
            }
            if (!content.trim().startsWith('[')) {
                content = fs.readFileSync(linksPath, 'utf8');
            }
        } catch (e) {
            content = fs.readFileSync(linksPath, 'utf8');
        }

        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }

        const links = JSON.parse(content);
        console.log(`Found ${links.length} links to download.`);

        for (const item of links) {
            // Sanitize filename
            const safeFilename = item.filename.replace(/[<>:"/\\|?*]/g, '_');
            const dest = path.join(process.cwd(), 'data/raw_pdfs', safeFilename);
            console.log(`Downloading ${safeFilename}...`);
            await downloadFile(item.url, dest);
        }
        console.log('All downloads complete.');

    } catch (error) {
        console.error('Error downloading:', error);
    }
}

downloadAll();
