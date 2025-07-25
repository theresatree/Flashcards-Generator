import { openDB } from "./db_setup";
import { STORE_NAME } from "./definitions";

async function addFile(file: { name: string; content: string }) {
  const db = await openDB();

  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const request = store.add(file);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Example usage:
addFile({ name: "myFile.txt", content: "Hello world" })
  .then((id) => console.log("File added with id", id))
  .catch(console.error);
