import { StackedFlashCard } from "../../components/stackedCards";
import { FlashcardSkeleton } from "../../components/skeletons";
import { Progress } from "../../components/ui/progress";
import { RAG } from "../../utils/RAG";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
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
    const [flashcardHeight, setFlashcardHeight] = useState(0); // Max height across all stacks
    const ran = useRef(false);
    const flashcardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const MAX_FILE_LENGTH = 75;

    useEffect(() => {
        if (ran.current) return;
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

////////////////////////////////////////////THIS IS FOR FLASHCARDS//////////////////////////////////

    // Find max height across all individual flashcards
    useEffect(() => {
        if (!loading && flashcardRefs.current.length > 0) {
            let maxHeight = 0;
            flashcardRefs.current.forEach((ref) => {
                if (ref) {
                    // Find all direct children (the StackedFlashCard components)
                    const flashcardElements = ref.children;
                    Array.from(flashcardElements).forEach((element) => {
                        const height = (element as HTMLElement).offsetHeight;
                        maxHeight = Math.max(maxHeight, height);
                    });
                }
            });
            setFlashcardHeight(maxHeight);
        }
    }, [loading, mostRecentFiles]);

    function toggleStack(index: number) {
        setExpandedStacks((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    }

    function renderFlashcards() {
        return mostRecentFiles.map((file, i) => {
            const isExpanded = expandedStacks.includes(i);
            // Use the max flashcard height for margin
            const stackMargin = isExpanded ? 0 : flashcardHeight + 50;
            
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

////////////////////////////////////////////THIS IS FOR FLASHCARDS//////////////////////////////////

    return (
        <motion.div
            initial={{ scale: 0.3 }}
            animate={{
                scale: 1,
                transition: {
                    scale: { duration: 0.7, ease: "backOut" },
                },
            }}
            exit={{
                opacity: 0,
                transition: {
                    opacity: { duration: 0.3, ease: "easeIn" }
                }
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
                    <div className="flex flex-row items-center justify-center w-full min-h-screen">
                        <div className="flex-col w-3/5 items-center justify-center min-w-[850px] pl-[50px]">
                        {renderFlashcards()}
                        </div>
                        <div className="flex flex-col w-2/5 gap-10 sticky self-start top-1/2 items-center xl:pl-[50px] xl:mr-auto xl:items-start">
                            <Link
                                to="/dashboard"
                                className="max-w-[200px] px-10 py-3 rounded-md border bg-white text-black-200 font-bold duration-200  hover:scale-115 hover:bg-green-500 hover:border-green-500 active:scale-125 transition-all ease-in-out">
                                Confirm
                            </Link>
                            <Link
                                to="/"
                                className="max-w-[200px] px-10 py-3 rounded-md bg-white font-bold transition-all ease-in-out duration-200 hover:scale-120 active:scale-125 hover:bg-red-500 hover:border-red-500">
                                Go Back
                            </Link>
                        </div>
                    </div>
                )}
        </motion.div>
    );
}

export default ConfirmFlashCards;
