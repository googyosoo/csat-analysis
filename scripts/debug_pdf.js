import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const pdfPath = path.join(process.cwd(), 'data/raw_pdfs/2025_10_english.pdf');

async function debugPdf() {
    try {
        console.log('Type of pdf:', typeof pdf);
        if (typeof pdf === 'object') {
            console.log('pdf keys:', Object.keys(pdf));
        }

        const dataBuffer = fs.readFileSync(pdfPath);
        let data;

        if (typeof pdf === 'function') {
            data = await pdf(dataBuffer);
        } else if (typeof pdf.default === 'function') {
            data = await pdf.default(dataBuffer);
        } else {
            console.log('pdf is not a function. Trying to use it as is if it has a parse method?');
            // Some versions might expose a parse method?
            // checking keys might help.
            throw new Error('pdf-parse did not export a function');
        }

        console.log('--- Text Start ---');
        console.log(data.text.substring(0, 500));
        console.log('--- Text End ---');
        console.log('Info:', data.info);
        console.log('NumPages:', data.numpages);
    } catch (error) {
        console.error('Error:', error);
    }
}

debugPdf();
