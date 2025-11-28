import fs from 'fs';
import path from 'path';

const dir = process.cwd();
const files = fs.readdirSync(dir).filter(f => f.endsWith('_ua.html'));
const output = [];

files.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    const regex = /https:\/\/blog\.kakaocdn\.net\/dna\/[^"]+\.pdf[^"]*/g;
    const matches = content.match(regex);

    if (matches) {
        matches.forEach(url => {
            const decoded = decodeURIComponent(url);
            if (decoded.includes('영어') && decoded.includes('문제')) {
                // Try to extract year/month from filename or title in HTML if possible, 
                // but for now just use the filename from the URL or a generic name
                // We can try to parse the file ID to map back to year if needed, 
                // but let's just use the original filename from the URL if we can, or generate one.

                // Extract filename from URL: .../filename.pdf?...
                // The URL structure is .../filename.pdf?credential...&knm=tfile.pdf
                // Actually the part before ? is the path.

                // Let's try to get a descriptive name.
                // The decoded URL usually contains the Korean filename.
                // e.g. .../2021학년도_수능_영어_문제.pdf...

                let filename = 'unknown.pdf';
                const nameMatch = decoded.match(/\/([^\/]+\.pdf)\?/);
                if (nameMatch) {
                    filename = nameMatch[1];
                } else {
                    // Fallback
                    filename = `extracted_${Date.now()}_${Math.random().toString(36).substring(7)}.pdf`;
                }

                output.push({
                    url: url.replace(/&amp;/g, '&'),
                    filename: filename
                });
            }
        });
    }
});

// Deduplicate
const uniqueOutput = [...new Map(output.map(item => [item.filename, item])).values()];

console.log(JSON.stringify(uniqueOutput, null, 2));
