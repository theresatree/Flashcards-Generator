import { getHFApiKey } from "./LocalStorageCRUD";

export async function EmbedChunks(chunks: string[]) {
    const hfKey = getHFApiKey()

  const response = await fetch(
    "https://api-inference.huggingface.co/models/BAAI/bge-small-en-v1.5",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: chunks
      }),
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }
  
  const result = await response.json();
  return result;
}
