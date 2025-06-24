import { createContext, useContext } from "react";
import type { FileItem } from "../models/models";

export type FlashcardContextType = {
  projectID: string;
  files: FileItem[];
  setFiles: (files: FileItem[]) => void;
};

export const FlashcardContext = createContext<FlashcardContextType | null>(null);

export function useFlashcardContext() {
  const ctx = useContext(FlashcardContext);
  if (!ctx) throw new Error("useFlashcardContext must be used within FlashcardProvider");
  return ctx;
}
