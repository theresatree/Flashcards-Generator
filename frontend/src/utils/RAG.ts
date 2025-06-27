import type { FileChunksAndEmbeddingsUpdate } from "../models/models";

import { parseMostRecentProject } from "./parseFiles";
import { TextToChunks } from "./splitText";
import { EmbedChunks } from "./embedChunks";
import { updateFileWithChunksAndEmbeddings } from "../db_utils/update_item";    
import { generateFlashcards } from "./generateFlashCards";
import { retrieveAllFilesByProjectID } from "../db_utils/retrieve_item";

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


        const allExistingFiles = await retrieveAllFilesByProjectID(projectID);
        const existingMap = new Map(allExistingFiles.map(f => [f.filename, f]));

        for (const filename in data) {
            const file = data[filename];
            const existing = existingMap.get(filename);

            // 🛑 Skip if already has chunks AND embeddings
            if (existing?.chunks?.length && existing?.embeddings?.length) {
                console.log(`Skipping ${filename} (already embedded)`);
                continue;
            }

            const chunks = TextToChunks(file.text);

            updates[filename] = {
                chunks,
                embeddings: []
            };

            try {
                const embeddings = await EmbedChunks(chunks);
                updates[filename].embeddings = embeddings;
            } catch (error) {
                console.error(`Embedding failed for ${filename}:`, error);
                throw error;
            }

            setProgress(70, `Embedded: ${filename}`);
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
