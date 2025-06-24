import { openDB } from "./db_setup";
import type { FileItem, Flashcard } from "@/models/models";
import { INDEX, STORE_NAME } from "./definitions";

export async function retrieveAllFiles(): Promise<FileItem[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    const request = store.getAll(); // neat shortcut

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      resolve(request.result as FileItem[]);
    };
  });
}

export async function retrieveAllProjectIDs(): Promise<string[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index(INDEX);

    const uniqueProjectIDs = new Set<string>();

    const request = index.openKeyCursor();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        uniqueProjectIDs.add(cursor.key as string);
        cursor.continue();
      } else {
        resolve(Array.from(uniqueProjectIDs));
      }
    };
  });
}


export async function retrieveAllFilesByProjectID(projectID: string): Promise<FileItem[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index(INDEX);

    const request = index.getAll(projectID);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      resolve(request.result as FileItem[]);
    };
  });
}


export async function retrieveFileByFileNameWithProjectID(projectID: string, filename: string): Promise<FileItem> {
  const files = await retrieveAllFilesByProjectID(projectID);
  const found = files.find(f => f.filename === filename);

  if (found) {
    return found;
  } else {
    throw new Error("FileItem not found");
  }
}

export async function retrieveFlashcards(projectID: string,filename: string): Promise<Flashcard[]> {
  const file = await retrieveFileByFileNameWithProjectID(projectID, filename);
  return file.flashcards || [];
}

export async function retrieveFlashcardByIndex(projectID: string,filename: string,index: number): Promise<Flashcard> {
  const flashcards = await retrieveFlashcards(projectID, filename);

  if (!flashcards[index]) {
    throw new Error(`Flashcard index ${index} out of range`);
  }

  return flashcards[index];
}
