import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Dynamic import for pdfjs-dist as it is an ESM module usually, but we are in a mixed env.
// Actually, pdfjs-dist recent versions are ESM only.
// Let's try to import it using dynamic import or require if possible.
// But we are in "type": "module" package.json, so we can use import.

// Import legacy build for Node.js environment compatibility
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const pdfDir = path.join(process.cwd(), 'data/raw_pdfs');
const outputDir = path.join(process.cwd(), 'src/data');
const outputFile = path.join(outputDir, 'passages.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function extractText() {
    try {
        const files = fs.readdirSync(pdfDir).filter(file => file.endsWith('.pdf') || file.endsWith('.txt'));

        if (files.length === 0) {
            console.log('No PDF or TXT files found in data/raw_pdfs');
            return;
        }

        const passages = [];

        for (const file of files) {
            console.log(`Processing ${file}...`);
            const filePath = path.join(pdfDir, file);
            let text = '';

            if (file.endsWith('.pdf')) {
                const dataBuffer = fs.readFileSync(filePath);
                const uint8Array = new Uint8Array(dataBuffer);
                const loadingTask = pdfjsLib.getDocument(uint8Array);
                const pdfDocument = await loadingTask.promise;
                const numPages = pdfDocument.numPages;
                for (let i = 1; i <= numPages; i++) {
                    const page = await pdfDocument.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    text += pageText + '\n';
                }
            } else if (file.endsWith('.txt')) {
                text = fs.readFileSync(filePath, 'utf-8');
            }

            // Clean text
            const cleanText = text.replace(/\n\s*\n/g, '\n');
            let foundQuestions = false;

            // Find shared passages [XX ~ YY]
            const rangeRegex = /\[(\d{1,2})\s*[~～]\s*(\d{1,2})\](.*?)(?=\b\1\.)/gs;
            const ranges = {};
            let rangeMatch;
            while ((rangeMatch = rangeRegex.exec(cleanText)) !== null) {
                const start = parseInt(rangeMatch[1]);
                const end = parseInt(rangeMatch[2]);
                const content = rangeMatch[3].trim();
                for (let i = start; i <= end; i++) {
                    ranges[i] = content;
                }
            }

            // Extract questions
            const questionRegex = /(\d{1,2})\.\s*(.*?)(?=(\d{1,2}\.)|$)/gs;
            let match;

            while ((match = questionRegex.exec(cleanText)) !== null) {
                const questionNum = match[1];
                let content = match[2].trim();
                const qNumInt = parseInt(questionNum);

                if (content.length > 50 && qNumInt >= 18) {
                    foundQuestions = true;
                    if (ranges[qNumInt]) {
                        content = `[Shared Passage]\n${ranges[qNumInt]}\n\n[Question]\n${content}`;
                    }
                    passages.push({
                        id: `${file.replace('.pdf', '').replace('.txt', '')}_${questionNum}`,
                        title: `${file} Question ${questionNum}`,
                        content: content,
                        source: file,
                        type: 'reading'
                    });
                }
            }

            if (!foundQuestions && text.length > 0) {
                passages.push({
                    id: `${file.replace('.pdf', '').replace('.txt', '')}_full`,
                    title: `${file} Full Text`,
                    content: text,
                    source: file,
                    type: 'full_text'
                });
            }
        }

        fs.writeFileSync(outputFile, JSON.stringify(passages, null, 2));
        console.log(`Extracted ${passages.length} items to ${outputFile}`);

    } catch (error) {
        console.error('Error extracting PDF:', error);
    }
}

extractText();
