import fs from 'fs';
import path from 'path';

const files = ['category_page_1.html', 'category_page_2.html', 'category_page_3.html'];
const output = [];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf-8');

    // Regex to find post links: <a href="/1234" ...>Title</a>
    // Adjust regex based on actual HTML structure if needed, but usually href="/digits" is a good signal
    const regex = /<a href="\/(\d+)"[^>]*>([^<]+)<\/a>/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
        const id = match[1];
        const title = match[2];

        if (title.includes('영어') && title.includes('문제')) {
            let year = null;
            if (title.includes('2021')) year = '2021';
            else if (title.includes('2020')) year = '2020';
            else if (title.includes('2019')) year = '2019';

            if (year) {
                output.push({
                    year: year,
                    id: id,
                    title: title.trim(),
                    url: `https://legendstudy.com/${id}`
                });
            }
        }
    }
});

// Deduplicate by ID
const uniqueOutput = [...new Map(output.map(item => [item.id, item])).values()];

console.log(JSON.stringify(uniqueOutput, null, 2));
