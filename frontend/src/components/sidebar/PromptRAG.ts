import { getEmbeddedChunksWithText, embedPrompt } from "../../utils/RAGHelper";
import { toast } from "sonner";
import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from "../../utils/LocalStorageCRUD";

export type PromptRAGProps = {
    project_id:       string;
    selectedFileName: string;
    promptText:           string;
};

export async function PromptRAG({ project_id, selectedFileName, promptText}: PromptRAGProps): Promise<string> {

    async function callGemini(model: string, content: string): Promise<string> {
  const maxRetries = model === "gemini-2.0-flash" ? 2 : 1;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const resp = await ai.models.generateContent({
        model,
        contents: [content],
      });
      if (resp.text) return resp.text.trim();
      throw new Error("Empty response");
    } catch (err: any) {
      const is503 = err?.code === 503 || err?.message?.includes("UNAVAILABLE");
      if (is503 && i < maxRetries) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Out of retries");
}

    const geminiKey = getGeminiApiKey();
    const ai = new GoogleGenAI({ apiKey: `${geminiKey}`});

    try {
        // 1) Load precomputed chunks + embeddings
        const { chunks, embeddings } = await getEmbeddedChunksWithText(
            project_id,
            selectedFileName
        );

        // 2) Embed the user’s question
        const promptVec = await embedPrompt(promptText);

        // 3) Compute cosine similarity & pick top-3
        const scores = embeddings.map((emb, idx) => ({
            idx,
            score:
            promptVec.reduce((sum, v, j) => sum + v * emb[j], 0) /
                (Math.hypot(...promptVec) * Math.hypot(...emb)),
        }));
        scores.sort((a, b) => b.score - a.score);
        const top3 = scores.slice(0, 3).map(x => x.idx);

        // 4) Assemble the context from the raw text
        const context = top3.map(i => chunks[i]).join("\n\n---\n\n");
        const fullPrompt = `
- Use **line breaks** and **indentation** to make the output human-readable.
- For inline math, use: $...$
- For block math, use: $$...$$
- For code snippets, wrap them in triple backticks with the language.

\`\`\`python
print("Hello World")
\`\`\`


Use the following excerpts to answer the question:

${context}

Q: ${promptText}
A:
`;
console.log(fullPrompt)
        // 5) Call Gemini
const text = await callGemini("gemini-2.0-flash", fullPrompt);
// (optional) fallback to Bison if that errors:
return text;

    } catch (e: any) {
        console.error("PromptRAG error:", e);
        toast.error(e.message ?? "RAG generation failed");
        throw e;
    }
}


