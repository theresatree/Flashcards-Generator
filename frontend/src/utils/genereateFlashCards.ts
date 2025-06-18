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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    // ✅ Parse multiple Q/A pairs using regex
    const regex = /Q\d+: (.*?)\nA\d+: (.*?)(?=\nQ\d+:|\n*$)/gs;
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
