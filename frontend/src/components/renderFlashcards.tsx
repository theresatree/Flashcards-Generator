import { useEffect, useState, useRef } from "react";
import { truncateFilename } from "../utils/truncateString";
import { StackedFlashCard } from "./stackedCards";
import type { FileItem } from "../models/models";

const MAX_FILE_LENGTH: number = 75;

type Props = {
    mostRecentFiles: FileItem[];
    projectID: string;
}

function RenderFlashcards({ mostRecentFiles, projectID }: Props) {
    const [flashcardHeights, setFlashcardHeights] = useState<number[]>([]);
    const [expandedStacks, setExpandedStacks] = useState<number[]>([]);
    const flashcardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (flashcardRefs.current.length > 0) {
            const stackHeights: number[] = [];
            
            flashcardRefs.current.forEach((ref, index) => {
                if (ref) {
                    // Find the tallest flashcard in this specific stack
                    let stackMaxHeight = 0;
                    const flashcardElements = ref.children;
                    
                    Array.from(flashcardElements).forEach((element) => {
                        const height = (element as HTMLElement).offsetHeight;
                        stackMaxHeight = Math.max(stackMaxHeight, height);
                    });
                    
                    stackHeights[index] = stackMaxHeight;
                }
            });
            
            setFlashcardHeights(stackHeights);
        }
    }, [mostRecentFiles]);

    const toggleStack = (index: number) => {
        setExpandedStacks((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    return mostRecentFiles.map((file, i) => {
        const isExpanded = expandedStacks.includes(i);
        const stackMargin = isExpanded ? 0 : flashcardHeights[i] + 50;
        
        return (
            <div
                key={i}
                className="ml-auto w-[850px]"
                style={{ marginBottom: `${stackMargin}px` }}
            >
                <h3
                    className="text-lg font-semibold mb-2 text-[#FEEEEE] cursor-pointer"
                    onClick={() => toggleStack(i)}
                >
                    {truncateFilename(file.filename, MAX_FILE_LENGTH)}
                </h3>
                <div
                    className="relative w-full"
                    ref={(el) => {
                        flashcardRefs.current[i] = el;
                    }}
                >
                    {file.flashcards.map((fc, j) => (
                        <StackedFlashCard
                            key={j}
                            project_id={projectID}
                            filename={file.filename}
                            question={fc.question}
                            answer={fc.answer}
                            index={j}
                            isExpanded={isExpanded}
                            toggleStack={() => toggleStack(i)}
                        />
                    ))}
                </div>
            </div>
        );
    });
}

export default RenderFlashcards;
