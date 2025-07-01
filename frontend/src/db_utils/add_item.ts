import { openDB } from "./db_setup";

import type { FileItem } from "@/models/models";
import {STORE_NAME} from "./definitions";


async function getLowestAvailableKey(store: IDBObjectStore): Promise<number> {
    return new Promise((resolve, reject) => {
        const request = store.getAllKeys();

        request.onsuccess = () => {
            const existingKeys = request.result as number[];
            existingKeys.sort((a, b) => a - b);

            let expectedKey = 1;
            for (const key of existingKeys) {
                if (key !== expectedKey) {
                    // gap found
                    resolve(expectedKey);
                    return;
                }
                expectedKey++;
            }
            // no gaps found, use next highest
            resolve(expectedKey);
        };

        request.onerror = () => reject(request.error);
    });
}

export async function addItemWithKey(item: FileItem) {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const key = await getLowestAvailableKey(store);

    return new Promise((resolve, reject) => {
        const request = store.add(item);
        request.onsuccess = () => resolve(key);
        request.onerror = () => reject(request.error);
    });
}

