import { useEffect, useState, useRef } from "react";
import { useSidebarState } from "../../utils/SidebarContext";
import { MarkdownRenderer } from "../markdownComponents";
import { DashboardFlashcard } from "./dashboardFlashcard";
import { motion  } from "motion/react";  
import { reverseProjectIDTime, reverseProjectIDDate } from "../../utils/reverseProjectID";

export function DashboardContent() {
    const { selectedProjectID, selectedProjectDetails } = useSidebarState();
    const [currentQuestionCounter, setCurrentQuestionCounter] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const flashcards = selectedProjectDetails[selectedProjectID] || [];
    const answerRef = useRef<HTMLDivElement>(null);
    const [answerHeight, setAnswerHeight] = useState(0);

    useEffect(() => {
        const el = answerRef.current;
        if (!el) return;

        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setAnswerHeight(entry.contentRect.height);
            }
        });

        observer.observe(el);

        return () => observer.disconnect();
    }, [showAnswer]);

    // Reset counter when project changes or when flashcards change
    useEffect(() => {
        setCurrentQuestionCounter(0);
        setShowAnswer(false);
    }, [selectedProjectID, flashcards.length]);

    // Keyboard shortcuts
    useEffect(() => {
        function handleGlobalKeyDown(e: KeyboardEvent) {
            // Only handle shortcuts if we have flashcards
            if (flashcards.length === 0) return;

            if (e.code === "Space" || e.key === " ") {
                e.preventDefault();
                setShowAnswer(prev => !prev); // Toggle instead of just showing
            } else if (e.code === "ArrowRight" || e.code === "KeyL") {
                e.preventDefault();
                setCurrentQuestionCounter(prev => {
                    if (prev < flashcards.length - 1) {
                        return prev + 1;
                    }
                    return prev; // Stay at current position if at end
                });
                setShowAnswer(false);
            } else if (e.code === "ArrowLeft" || e.code === "KeyH") {
                e.preventDefault();
                setCurrentQuestionCounter(prev => {
                    if (prev > 0) {
                        return prev - 1;
                    }
                    return prev; // Stay at current position if at beginning
                });
                setShowAnswer(false);
            } 
        }

        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [flashcards.length]); // Need this because when we change project, this changes.

    if (!flashcards.length) {
        return (
            <div className="text-[#FEEEEE] p-4">
                <h3>No flashcards selected</h3>
                <p className="text-sm text-gray-400 mt-2">
                    Select a project from the sidebar to start studying.
                </p>
            </div>
        );
    }

    const safeIdx = Math.max(0, Math.min(currentQuestionCounter, flashcards.length - 1));
    const currentFlashcard = flashcards[safeIdx];

    return (
        <div className="flex flex-col text-[#FEEEEE] px-10 pb-10 size-full" tabIndex={0}>
            <h3 className="right-1 text-xl font-semibold ml-auto">
                {/^\d{14}$/.test(selectedProjectID)
                    ? `${reverseProjectIDDate(selectedProjectID)} - ${reverseProjectIDTime(selectedProjectID)}`
                    : selectedProjectID}
            </h3>
            <motion.div
                className="flex flex-col justify-center items-center max-w-[1000px] my-auto w-full mx-auto"
            >
                <motion.div
                    className="absolute text-2xl font-semibold text-center max-w-[70%] break-words w-full"
                    initial={false}
                    animate={{ y: showAnswer ? -answerHeight/1.5 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <MarkdownRenderer content={currentFlashcard.question} />
                </motion.div>
                {/* Always render this block to avoid layout reflow */}
                <motion.div
                    animate={showAnswer ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 90 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex justify-center items-center mt-4 w-full"
                >
                    {/* Optional: hide content completely when answer is hidden */}
                    <div
                        ref={answerRef}
                        className={
                            showAnswer
                                ? "w-full mx-auto flex justify-center items-center" // answer is visible, just full-width block
                                : "absolute opacity-0 pointer-events-none -z-10 w-full" // still full-width when hidden
                        }
                    >
                        <DashboardFlashcard text={currentFlashcard.answer} />
                    </div>
                </motion.div>
            </motion.div>

            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                        width: `${((currentQuestionCounter + 1) / flashcards.length) * 100}%` 
                    }}
                ></div>
            </div>

            {/* Progress indicator */}
            <div className="flex justify-between items-center text-sm text-gray-400 px-5 pt-5 pb-10">
                <span>
                    {currentQuestionCounter + 1} of {flashcards.length}
                </span>
                <div className="flex flex-row text-xs gap-5">
                    <div>Space: {showAnswer ? 'Hide' : 'Show'} answer</div>
                    <div>←/→ or H/L: Navigate</div>
                </div>
            </div>
        </div>
    );
}
