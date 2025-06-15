import { openDB } from "./db_setup";
import type { FileItem } from "@/models/models";

const DB_NAME = "LocalDatabase";
const DB_VERSION = 1;
const STORE_NAME = "Files";
const INDEX = "project_id"

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
