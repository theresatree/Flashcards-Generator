import { StackedFlashCard } from "../../components/stackedCards";
import { FlashcardSkeleton } from "../../components/skeletons";
import { Progress } from "../../components/ui/progress";
import { RAG } from "../../utils/RAG";
import { toast } from "sonner";


import { motion } from "motion/react";

import { useEffect, useRef, useState } from "react";
import { retrieveAllFilesByProjectID } from "../../db_utils/retrieve_item";
import { truncateFilename } from "../../utils/truncateString";
import type { FileItem } from "@/models/models";

function ConfirmFlashCards() {
    const [progressValue, setProgressValue] = useState(0);
    const [progressText, setProgressText] = useState("");
    const [loading, setLoading] = useState(true)
    const [mostRecentFiles, setMostRecentFiles] = useState<FileItem[]>([]);
    const [expandedStacks, setExpandedStacks] = useState<number[]>([]);
    const ran = useRef(false);
    const MAX_FILE_LENGTH = 70;

    useEffect(() => {
        if (ran.current) return; // ✅ already ran once
        ran.current = true;

        const run = async () => {
            try {
                const mostRecentProjectID = await RAG((v, text) => {
                    setProgressValue(v);
                    setProgressText(text);
                });
                if (mostRecentProjectID) {
                    setLoading(false);
                    setMostRecentFiles(await retrieveAllFilesByProjectID(mostRecentProjectID))
                    console.log(mostRecentFiles)
                } else {
                    toast.error("Error generating flashcard. Please restart");
                }
            } catch (error) {
                console.error("Caught RAG error:", error);
                toast.error("Error: " + (error instanceof Error ? error.message : String(error)));
            }
        };

        run();
    }, []);



    function toggleStack(index: number) {
        setExpandedStacks((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    }

    function renderFlashcards() {
        return mostRecentFiles.map((file, i) => {
            const isExpanded = expandedStacks.includes(i);

            return (
                <div key={i} className="w-full max-w-[800px] mb-2">
                    <h3
                        className="text-lg font-semibold mb-2 text-[#FEEEEE] cursor-pointer"
                        onClick={() => toggleStack(i)}
                    >
                        {truncateFilename(file.filename, MAX_FILE_LENGTH)}
                    </h3>

                    <div className="relative w-full min-h-[200px]">
                        {file.flashcards.map((fc, j) => (
                            <StackedFlashCard
                              key={j}
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

    return (
        <motion.div
            initial={{ scale: 0.3 }}
            animate={{
                scale: 1,
                transition: {
                    scale: { duration: 0.7, ease: "backOut" },
                },
            }}
            className="fixed inset-0 overflow-auto p-6"
        >
            {loading ? (
                <div className="flex flex-col items-center justify-center text-[#FEEEEE] min-h-full">
                    <FlashcardSkeleton />
                    <Progress
                        value={progressValue}
                        className="w-[400px] h-[15px] mt-15 bg-blue-100"
                    />
                    <div className="t-m mt-5">{progressText}</div>
                </div>
            ) : (
                    <div className="flex flex-col items-center gap-10 w-full min-h-full">
                        {renderFlashcards()}
                    </div>
                )}
        </motion.div>
    );
}


export default ConfirmFlashCards;

