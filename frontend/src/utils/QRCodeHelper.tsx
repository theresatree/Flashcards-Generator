import pako from "pako";
import type { Flashcard } from "../models/models";

export function encodeFlashcards(files: Flashcard[]): string {
  const minimal = files.map(({ question, answer }) => ({ question, answer })); // strip metadata
  const json = JSON.stringify(minimal);
  const compressed = pako.deflate(json);
  const encoded = btoa(String.fromCharCode(...compressed));
  return encoded;
}

// Decode base64 string back to flashcards
export function decodeFlashcards(encoded: string): Flashcard[] {
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  const json = pako.inflate(bytes, { to: "string" });
  return JSON.parse(json);
}
