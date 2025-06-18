import type { FileChunksAndEmbeddingsUpdate } from "../models/models";

import { parseMostRecentProject } from "./parseFiles";
import { TextToChunks } from "./splitText";
import { EmbedChunks } from "./embedChunks";
import { updateFileWithChunksAndEmbeddings } from "../db_utils/update_item";    
import { generateFlashcards } from "./genereateFlashCards";

// RAG comes in 5 steps
// 1. Convert to text
// 2. Split into chunks
// 3. Embed the chunks into vectors
// 4. Store vectors and data into DB
// 5. Query

export async function RAG() {
    try {
        console.log("RAG: Starting RAG process...");
        
        const updates: FileChunksAndEmbeddingsUpdate = {}; // For Step 4

        console.log("RAG: Step 1 - Parsing most recent project...");
        const { projectID, files: data } = await parseMostRecentProject(); // Step 1
        console.log("RAG: Project ID:", projectID);
        console.log("RAG: Files found:", Object.keys(data));

        for (const filename in data) {
            const chunks = TextToChunks(data[filename].text); // Step 2
            console.log(`RAG: Created ${chunks.length} chunks for ${filename}`);

            // Make sure the update object exists for this filename
            updates[filename] = {
                chunks: [],
                embeddings: []
            };

            updates[filename].chunks = chunks;

            // Then embed each chunk
            console.log(`RAG: Step 3 - Embedding chunks for ${filename}...`);
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                try {
                    const embedding = await EmbedChunks(chunk);
                    updates[filename].embeddings.push(embedding);
                } catch (error) {
                    throw error;
                }
            }
        }

        console.log("RAG: Step 4 - Updating database with chunks and embeddings...");
        await updateFileWithChunksAndEmbeddings(projectID, updates); // Step 4
        console.log("RAG: Database updated successfully");
        
        console.log("RAG: Step 5 - Generating flashcards...");
        await generateFlashcards(projectID); //Step 5
        console.log("RAG: Flashcards generated successfully");
        
        console.log("RAG: Process completed successfully!");
        
    } catch (error) {
        console.error("RAG: Error in RAG process:", error);
        throw error;
    }
}
