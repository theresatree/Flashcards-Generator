import { openDB } from "./db_setup";
import { STORE_NAME } from "./definitions";
import type { FileItem } from "../models/models";
import { retrieveFileByFileNameWithProjectID } from "./retrieve_item";

export async function removeItemByProjectID(project_id: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const index = store.index("project_id");

  return new Promise((resolve, reject) => {
    const request = index.openCursor(IDBKeyRange.only(project_id));
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve();
      }
    };
  });
}


export async function removeItemByProjectIDAndFilename(project_id: string, filename: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const index = store.index("project_id");

  return new Promise((resolve, reject) => {
    const request = index.openCursor(IDBKeyRange.only(project_id));

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        const value = cursor.value;
        if (value.filename === filename) {
          console.log("Deleting:", value);
          cursor.delete();
          resolve();
        } else {
          cursor.continue(); // keep looping
        }
      } else {
        console.warn("No match found");
        resolve();
      }
    };
  });
}

export async function removeFlashcardFromFile(
  projectID: string,
  filename: string,
  cardIndex: number
): Promise<void> {
  // 1) Fetch the full record
  const fileItem = await retrieveFileByFileNameWithProjectID(projectID, filename);

  // 2) Splice out that one flashcard
  const newFlashcards = [...fileItem.flashcards];
  newFlashcards.splice(cardIndex, 1);

  // 3) Build an updated FileItem
  const updated: FileItem = {
    ...fileItem,
    flashcards: newFlashcards,
    no_of_flashcards: newFlashcards.length,
  };

  // 4) Persist it back to IndexedDB
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.put(updated);
  // If you're using the `idb` package, you can:
  await (tx as any).done;
}
