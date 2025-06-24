import { openDB } from "./db_setup";
import type { FileItem, FileChunksAndEmbeddingsUpdate } from "@/models/models";
import { STORE_NAME, INDEX} from "./definitions"; 
import { retrieveAllFilesByProjectID} from "./retrieve_item";


{/* This is to put the embeddings of flashcards in Files*/}
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

{/* This is to put the flashcards in Files*/}
export async function updateFile(file: FileItem): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    store.put(file); 
}

{/* This is to update the flashcards in a project, selected by the flashcard index*/}
export async function updateFlashcard(projectID: string, filename:string, index:number, newQuestion:string, newAnswer:string): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const indexObj = store.index(INDEX); 
    const request = indexObj.openCursor(IDBKeyRange.only(projectID));

    return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);
        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

            if (cursor) {
                const file = cursor.value as FileItem;
                if (file.filename === filename) {
                    if (!file.flashcards || !file.flashcards[index]) {
                        reject(new Error("Flashcard index out of range"));
                        return;
                    }

                    file.flashcards[index].question = newQuestion;
                    file.flashcards[index].answer = newAnswer;

                    cursor.update(file);
                    resolve();
                    return;
                }
                cursor.continue();
            } else {
                // If we exhausted the cursor with no match
                reject(new Error("FileItem not found"));
            }
        };
    });
}
