import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const passagesPath = path.join(__dirname, '../src/data/passages.json');
const topicsPath = path.join(__dirname, '../src/data/topics.json');

const passages = JSON.parse(fs.readFileSync(passagesPath, 'utf-8'));
const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf-8'));

function classifyPassage(content, topics) {
    const contentLower = content.toLowerCase();
    const scores = topics.map(t => {
        let score = 0;

        // Check topic name match
        if (contentLower.includes(t.topic.toLowerCase())) {
            score += 10;
        }

        // Check keywords match
        t.keywords.forEach(k => {
            if (contentLower.includes(k.toLowerCase())) {
                score += 5;
            }
        });

        return { topic: t.topic, score };
    });

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    // Return top 3 topics with score > 0
    return scores.filter(s => s.score > 0).slice(0, 3).map(s => s.topic);
}

console.log('Classifying passages...');
let classifiedCount = 0;

const updatedPassages = passages.map(p => {
    const assignedTopics = classifyPassage(p.content, topics);
    if (assignedTopics.length > 0) {
        classifiedCount++;
    }
    return {
        ...p,
        topics: assignedTopics
    };
});

fs.writeFileSync(passagesPath, JSON.stringify(updatedPassages, null, 2));
console.log(`Classified ${classifiedCount} out of ${passages.length} passages.`);
console.log('Updated passages.json');
