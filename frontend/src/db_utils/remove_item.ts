import { openDB } from "./db_setup";
import { STORE_NAME } from "./definitions";

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
