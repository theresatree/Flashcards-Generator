const DB_NAME = "LocalDatabase";
const DB_VERSION = 1;
const STORE_NAME = "Files";

export function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject(request.error);
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true,
                });

                if (!store.indexNames.contains("project_id")) {
                    store.createIndex("project_id", "project_id", { unique: false });
                }
            }
        };
    });
}
