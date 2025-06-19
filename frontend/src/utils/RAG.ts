import type { FileChunksAndEmbeddingsUpdate } from "../models/models";

import { parseMostRecentProject } from "./parseFiles";
import { TextToChunks } from "./splitText";
import { EmbedChunks } from "./embedChunks";
import { updateFileWithChunksAndEmbeddings } from "../db_utils/update_item";    
import { generateFlashcards } from "./generateFlashCards";

// RAG comes in 5 steps
// 1. Convert to text
// 2. Split into chunks
// 3. Embed the chunks into vectors
// 4. Store vectors and data into DB
// 5. Query

export async function RAG(setProgress: (v:number, text:string) => void): Promise<string> {
    try {
        console.log("RAG: Starting RAG process...");
        
        const updates: FileChunksAndEmbeddingsUpdate = {}; // For Step 4

        console.log("RAG: Step 1 - Parsing most recent project...");
        const { projectID, files: data } = await parseMostRecentProject(); // Step 1
        console.log("RAG: Project ID:", projectID);
        console.log("RAG: Files found:", Object.keys(data));
        setProgress(10, "Finished parsing files")

        for (const filename in data) {
            const chunks = TextToChunks(data[filename].text); // Step 2

            // Make sure the update object exists for this filename
            updates[filename] = {
                chunks: [],
                embeddings: []
            };

            updates[filename].chunks = chunks;

            // Then embed each chunk
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                try {
                    const embedding = await EmbedChunks(chunk);
                    updates[filename].embeddings.push(embedding);
                } catch (error) {
                    throw error;
                }

            setProgress(20+Math.floor(((i/chunks.length)*50)), "Chunking and embedding files")
            }
        }

        await updateFileWithChunksAndEmbeddings(projectID, updates); // Step 4
        setProgress(70, "Updated details to database");
        
        setProgress(75, "Generating flashcards via LLM");
        await generateFlashcards(projectID); //Step 5
        setProgress(100, "Finished generating flashcards")
        
    return projectID 

    } catch (error) {
        console.error("RAG: Error in RAG process:", error);
        throw error;
    }

}
