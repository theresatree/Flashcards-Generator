import { retrieveAllFilesByProjectID } from "../db_utils/retrieve_item";
import { updateFile } from "../db_utils/update_item";
import { toast } from "sonner";
import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from "./LocalStorageCRUD";


export async function generateFlashcards(projectID: string) {
    const geminiKey = getGeminiApiKey();
    const ai = new GoogleGenAI({ apiKey: `${geminiKey}`});

    const files = await retrieveAllFilesByProjectID(projectID);

    for (const file of files) {
        if (!file.chunks) continue;
        if (file.flashcards && file.flashcards.length > 0) {
            console.log(`Skipping flashcard generation for: ${file.filename} (already has ${file.flashcards.length} cards)`);
            continue;
        }

        // ✅ Combine ALL chunks for maximum context
        const combinedText = file.chunks.join("\n\n---\n\n");
        const flashcardLimit = file.no_of_flashcards

        const prompt = `
You are a helpful assistant.

Your task is to generate exactly ${flashcardLimit} high-quality question-and-answer pairs based on the provided text.

**Formatting Rules:**
- Each question should be clearly labeled: Q1, Q2, etc.
- Each answer should follow immediately, labeled A1, A2, etc.
- Insert a **blank line** between each Q&A pair.
- Use **line breaks** and **indentation** to make the output human-readable.
- For inline math, use: $...$
- For block math, use: $$...$$
- For code snippets, wrap them in triple backticks with the language.

\`\`\`python
print("Hello World")
\`\`\`

Format your output exactly as:

Q1: …
A1: …

Q2: …
A2: …

**TEXT TO USE**:
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
