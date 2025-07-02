import { toast } from "sonner";
import { retrieveEmbeddedChunks } from "../db_utils/retrieve_item";
import { EmbedChunks } from "./embedChunks";

export async function getEmbeddedChunksWithText( projectID: string, filename: string
    ): Promise<{ chunks: string[]; embeddings: number[][];
    }> {
        try {
            const { chunks, embeddings } = await retrieveEmbeddedChunks(
                projectID,
                filename
            );
            console.log("Got", chunks.length, "chunks and embeddings:", embeddings);
            return { chunks, embeddings };
        } catch (e: any) {
            console.error(e);
            toast.error(e.message ?? "Failed to load embedded chunks");
            throw e;
        }
    }

export async function embedPrompt( prompt: string): Promise<number[]> {
        try {
            // Hugging Face API returns an array of embeddings, one per input
            const result = await EmbedChunks([prompt]);
            const [promptVector] = result;
            console.log("Prompt vector:", promptVector);
            return promptVector;
        } catch (e: any) {
            console.error(e);
            toast.error(e.message ?? "Failed to embed prompt");
            throw e;
        }
    }
