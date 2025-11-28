import https from 'https';

const url = 'https://legendstudy.com/1231';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('HTML length:', data.length);

        // Find any occurrence of .pdf
        const pdfIndices = [];
        let pos = data.indexOf('.pdf');
        while (pos !== -1) {
            pdfIndices.push(pos);
            pos = data.indexOf('.pdf', pos + 1);
        }

        console.log(`Found ${pdfIndices.length} occurrences of ".pdf"`);

        pdfIndices.forEach(index => {
            const start = Math.max(0, index - 100);
            const end = Math.min(data.length, index + 100);
            console.log(`Context around ${index}: ...${data.substring(start, end)}...`);
        });

        const regex = /<a[^>]+href=['"]([^'"]+)['"][^>]*>([^<]*영어[^<]*문제[^<]*\.pdf)<\/a>/gi;
        let match;
        while ((match = regex.exec(data)) !== null) {
            console.log(`Found link: ${match[1]}`);
            console.log(`Text: ${match[2]}`);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err);
});
