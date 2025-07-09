import { retrieveFileByFileNameWithProjectID } from "../../db_utils/retrieve_item";
import { updateFile } from "../../db_utils/update_item";
import { getGeminiApiKey } from "../../utils/LocalStorageCRUD";
import { GoogleGenAI } from "@google/genai";
import type { Flashcard, FileItem } from "../../models/models";

export async function generateAdditionalFlashcards(projectID: string, filename: string, count: number): Promise<FileItem> {
    const file = await retrieveFileByFileNameWithProjectID(projectID, filename);
    if (!file || !file.chunks) throw new Error("No file or chunks found");

    const existingFlashcards = file.flashcards || [];

    // ✅ Generate flashcards from LLM using the chunks and count
    const newFlashcards = await generateFlashcardsForFile(file, count);

    // ✅ Append them
    file.flashcards = [...existingFlashcards, ...newFlashcards];

    await updateFile(file);
    return file
}


async function generateFlashcardsForFile(file: FileItem, count: number): Promise<Flashcard[]> {
    const geminiKey = getGeminiApiKey();
    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const combinedText = file.chunks?.join("\n\n---\n\n");
    if (!combinedText) throw new Error("No chunks to generate from");

    const prompt = `
You are a helpful assistant.

Your task is to generate exactly ${count} high-quality question-and-answer pairs based on the provided text.

**Formatting Rules:**
- Each question should be clearly labeled: Q1, Q2, etc.
- Each answer should follow immediately, labeled A1, A2, etc.
- Insert a **blank line** between each Q&A pair.
- Use **line breaks** and **indentation** to make the output human-readable.
- For inline math, use: $...$
- For block math, use: $$...$$
- For code snippets, wrap them in triple backticks with the language.

**TEXT TO USE**:
${combinedText}
`.trim();

    const resp = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [prompt],
    });

    const content = resp.text?.trim();
    if (!content) throw new Error("Empty LLM response");

    const regex = /Q\d+:\s*(.*?)\n+A\d+:\s*(.*?)(?=\n+Q\d+:|\n*$)/gs;

    const flashcards: Flashcard[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        flashcards.push({
            question: match[1].trim(),
            answer: match[2].trim()
        });
    }

    return flashcards;
}

