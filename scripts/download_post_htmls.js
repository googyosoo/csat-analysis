import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const postsPath = path.join(process.cwd(), 'found_posts.json');

async function downloadHtmls() {
    try {
        let content;
        try {
            content = fs.readFileSync(postsPath, 'utf16le');
            if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
            if (!content.trim().startsWith('[')) content = fs.readFileSync(postsPath, 'utf8');
        } catch (e) {
            content = fs.readFileSync(postsPath, 'utf8');
        }
        if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);

        const posts = JSON.parse(content);
        console.log(`Found ${posts.length} posts to process.`);

        for (const post of posts) {
            const filename = `${post.id}_ua.html`;
            console.log(`Downloading HTML for ${post.title} (${post.id})...`);

            // Use curl with User-Agent
            const cmd = `curl.exe -k -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -o "${filename}" "${post.url}"`;

            await new Promise((resolve, reject) => {
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error downloading ${post.url}:`, error);
                        // Don't reject, just continue
                        resolve();
                    } else {
                        resolve();
                    }
                });
            });
        }
        console.log('All HTML downloads complete.');
    } catch (error) {
        console.error('Error:', error);
    }
}

downloadHtmls();
