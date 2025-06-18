import { retrieveAllFilesByProjectID } from "../db_utils/retrieve_item";
import { updateFile } from "../db_utils/update_item";

export async function generateFlashcards(projectID: string, flashcardLimit = 10) {
    const files = await retrieveAllFilesByProjectID(projectID);

    for (const file of files) {
        if (!file.chunks) continue;

        // ✅ Combine ALL chunks for maximum context
        const combinedText = file.chunks.join("\n\n---\n\n");

        const prompt = `
You are a helpful assistant.
Please create exactly ${flashcardLimit} high-quality questions and concise answers
based on the following text.

Format each pair clearly as:
Q1: ...
A1: ...
Q2: ...
A2: ...
and so on.

TEXT:
${combinedText}
`.trim();

        const response = await fetch("http://127.0.0.1:8000/sendToLLM", {
            method: "POST",
            headers: {"Content-Type": "text/plain"},
            body: JSON.stringify({contents: prompt}),
        });

        if (!response.ok) {
            console.error(await response.json());
            throw new Error(`LLM call failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log(data.text);
        const content = data.text; 

        const regex = /Q\d+:\s*(.*?)\n+A\d+:\s*(.*?)(?=\n+Q\d+:|\n*$)/gs;

        const flashcards = [];
        let match;
        while ((match = regex.exec(content)) !== null) {
            flashcards.push({
                question: match[1].trim(),
                answer: match[2].trim()
            });
        }

        file.flashcards = flashcards;
        console.log(flashcards);

        await updateFile(file);
    }
}
