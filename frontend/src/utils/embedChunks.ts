export async function EmbedChunks(text:string): Promise<number[]>{
    const response = await fetch("http://127.0.0.1:8000/embedChunks",{
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({text}),
    });

    if (!response.ok){
        throw new Error(`Embedding Failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding;

}
