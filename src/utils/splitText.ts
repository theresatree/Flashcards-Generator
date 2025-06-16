export function splitText(text:string, chunkSize=300, overlap=50){
    const  words = text.split(" ");
    const chunks = [];
    for (let i=0; i<words.length; i+=chunkSize-overlap){
        chunks.push(words.slice(i, i+chunkSize).join(" "));
    }
    return chunks;
}
