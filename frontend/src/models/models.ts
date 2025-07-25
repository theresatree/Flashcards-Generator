// This is for all the models used in this project

export interface Flashcard {
    question: string
    answer: string
    priority?: number
}

export interface StackedFlashcardProps {
    project_id: string;
    filename: string;
    question: string;
    answer: string;
    index: number; // j
    isExpanded: boolean;
    toggleStack: () => void;
}

export interface FileItem {
    project_id: string;
    filename: string;
    file_size: number;
    file: Blob;
    flashcards: Flashcard[];
    chunks: string[]
    embeddings: number[][]
    no_of_flashcards: number
}

export interface ProjectFilesDict {
    [filename: string]: {
        text: string;
    }
}


export interface FileChunksAndEmbeddingsUpdate {
  [filename: string]: {
    chunks: string[];
    embeddings: number[][];
  };
}
