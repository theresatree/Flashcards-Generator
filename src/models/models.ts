// This is for all the models used in this project

export interface Flashcard {
    question?: string
    answer?: string
}

export interface FileItem {
    project_id: string;
    filename: string;
    file_size: number;
    file: Blob;
    flashcards: Flashcard[];
}
