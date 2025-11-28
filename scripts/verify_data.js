import fs from 'fs';
import path from 'path';

const passagesPath = path.join(process.cwd(), 'src/data/passages.json');
const content = fs.readFileSync(passagesPath, 'utf8');
const passages = JSON.parse(content);

console.log(`Total passages: ${passages.length}`);

const counts = {};
passages.forEach(p => {
    // Extract year from source filename or id
    // source: "2018_Suneung_English.pdf"
    const match = p.source.match(/(\d{4})/);
    if (match) {
        const year = match[1];
        counts[year] = (counts[year] || 0) + 1;
    }
});

console.log('Counts by year:');
console.log(JSON.stringify(counts, null, 2));

// Check for specific years
const years = ['2015', '2016', '2017', '2018'];
years.forEach(year => {
    if (!counts[year]) {
        console.error(`MISSING DATA FOR ${year}`);
    } else {
        console.log(`Verified ${year}: ${counts[year]} items`);
    }
});
