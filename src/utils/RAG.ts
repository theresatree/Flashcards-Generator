import type { ProjectFilesChunk } from "../models/models";

import { parseMostRecentProject } from "./parseFiles";
import { splitText } from "./splitText";

// RAG comes in 5 steps
// 1. Convert to text
// 2. Split into chunks
// 3. Embed the chunks into vectors
// 4. Store vectors and data into DB
// 5. Query

export async function RAG() {
    const data = await parseMostRecentProject(); // Step 1
    
    const allFileChunks: ProjectFilesChunk = {} // Step 2
    for (const filename in data) {
        const chunks = splitText(data[filename].text);
        allFileChunks[filename] = {};
        chunks.forEach((chunk, index) => {
            allFileChunks[filename][index] = chunk;
        });
    }

    console.log(allFileChunks); 


}
