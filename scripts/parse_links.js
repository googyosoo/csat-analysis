import fs from 'fs';
import path from 'path';

const files = ['1574_ua.html', '1447_ua.html', '1330_ua.html'];
const output = [];

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    // Look for links that end in .pdf or have 'attach' in them and contain '영어' or just look for the file pattern
    // The links usually look like: https://blog.kakaocdn.net/.../filename.pdf...

    // Regex to find Kakao CDN PDF links
    const regex = /https:\/\/blog\.kakaocdn\.net\/dna\/[^"]+\.pdf[^"]*/g;
    const matches = content.match(regex);

    if (matches) {
        matches.forEach(url => {
            // Decode URL to check filename
            const decoded = decodeURIComponent(url);
            if (decoded.includes('영어') && decoded.includes('문제')) {
                let year = 'unknown';
                if (file.includes('1574')) year = '2024';
                if (file.includes('1447')) year = '2023';
                if (file.includes('1330')) year = '2022';

                output.push({
                    year: year,
                    url: url.replace(/&amp;/g, '&'), // Fix HTML entities
                    filename: `${year}_suneung_english.pdf`
                });
            }
        });
    }
});

// Deduplicate
const uniqueOutput = [...new Map(output.map(item => [item.filename, item])).values()];

console.log(JSON.stringify(uniqueOutput, null, 2));
