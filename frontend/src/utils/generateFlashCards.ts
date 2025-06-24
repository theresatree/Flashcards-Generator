import { retrieveAllFilesByProjectID } from "../db_utils/retrieve_item";
import { updateFile } from "../db_utils/update_item";
import { toast } from "sonner";
import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from "./LocalStorageCRUD";


export async function generateFlashcards(projectID: string, flashcardLimit = 10) {
    const geminiKey = getGeminiApiKey();
    const ai = new GoogleGenAI({ apiKey: `${geminiKey}`});

    const files = await retrieveAllFilesByProjectID(projectID);

    for (const file of files) {
        if (!file.chunks) continue;

        // ✅ Combine ALL chunks for maximum context
        const combinedText = file.chunks.join("\n\n---\n\n");

        const prompt = `
You are a helpful assistant.

Please create exactly ${flashcardLimit} high-quality questions and concise answers
based on the following text.

- Use $...$ for inline math.
- Use $$...$$ for block math.
- If there is code, wrap it in triple backticks with the respective language, for example in python:

\`\`\`python
print("Hello World")
\`\`\`

Each pair of question and answer is split by an empty line.\n\n

Format each pair clearly as:
Q1: ...
A1: ...

Q2: ...
A2: ...
and so on.

TEXT:
${combinedText}
`.trim();

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [prompt], 
        });
        console.log(response.text);


        if (!response || !response.text) {
            toast.error("Failed to call LLM")
            throw new Error("LLM call failed");
        }

        const content = response.text;

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
        if (flashcards.length === 0){
            toast.error(`Error generating flashcards for ${file.filename}`)
        }

        await updateFile(file);
    }
}
