import { openDB } from "./db_setup";
import type { FileItem, FileChunksAndEmbeddingsUpdate } from "@/models/models";
import { STORE_NAME } from "./definitions"; 
import { retrieveAllFilesByProjectID } from "./retrieve_item";


export async function updateFileWithChunksAndEmbeddings(projectID: string, updates: FileChunksAndEmbeddingsUpdate): Promise<FileItem[]> { 
    const db = await openDB();
    const files = await retrieveAllFilesByProjectID(projectID);
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const updatedItems: FileItem[] = [];

    for (const file of files) {
        const update = updates[file.filename];
        if (update){
            file.chunks = update.chunks;
            file.embeddings = update.embeddings;

            store.put(file);
            updatedItems.push(file);
        }
    }

    return updatedItems;
}

export async function updateFile(file: FileItem): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  store.put(file); 
}

