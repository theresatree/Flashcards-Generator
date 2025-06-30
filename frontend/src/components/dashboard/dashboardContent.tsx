import { useEffect, useState, useRef } from "react";
import { useSidebarState } from "../../utils/SidebarContext";
import { MarkdownRenderer } from "../markdownComponents";
import { DashboardFlashcard } from "./dashboardFlashcard";
import { motion  } from "motion/react";  
import { reverseProjectIDTime, reverseProjectIDDate } from "../../utils/reverseProjectID";
import { updateFlashcardPriorityInAFile, updateFlashcardPriorityInAProject } from "../../db_utils/update_item";     
import DashboardRating from "./dashboardRating";
import DashboardProgressbar from "./dashboardProgressbar";
import { Button } from "../ui/button";

export function DashboardContent() {
    const { selectedProjectID, selectedProjectDetails, selectedFileName } = useSidebarState();
    const [currentQuestionCounter, setCurrentQuestionCounter] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [endOfQuestion, setEndOfQuestion] = useState(false);
    const [priorityChosen,setPriorityChosen] = useState<number[][]>([]);
    const flashcards = selectedFileName ? selectedProjectDetails[selectedFileName] : selectedProjectDetails[selectedProjectID] || [];
    const [masteredCount, setMasteredCount] = useState(0)
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
        setEndOfQuestion(false);
        setShowAnswer(false);
        setPriorityChosen(flashcards.map(() => [] as number[]));
        setMasteredCount(0)
    }, [selectedProjectID, selectedFileName]);

    // Keyboard shortcut
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
                    setEndOfQuestion(true);
                    return prev; // Stay at current position if at end
                });
                setShowAnswer(false);
            } else if (e.code === "ArrowLeft" || e.code === "KeyH") {
                e.preventDefault();
                if (endOfQuestion) {
                    setEndOfQuestion(false);
                } else {
                    setCurrentQuestionCounter(prev => {
                        if (prev > 0) return prev - 1;
                        return prev;
                    });
                }
                setShowAnswer(false);
            } else if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Digit3" || e.code === "Digit4" || e.code === "Digit5") {
                e.preventDefault();

                const priority = parseInt(e.code.replace("Digit", ""), 10);
                if (endOfQuestion) {
                    return
                }

                if (priority === 1){
                    setMasteredCount(prev => prev + 1)
                }
    
                setPriorityChosen(prev => {
                    const next = prev.map(row => [...row]); // deep-copy rows
                    next[currentQuestionCounter] = [ priority ];
                     console.log("writing into row", currentQuestionCounter, "→", next);
                    return next;
                });
    
                console.log(priorityChosen)
                console.log(priority)
            }        }

        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        };

    }, [flashcards.length, endOfQuestion, currentQuestionCounter]); // Need this because when we change project, this changes.

    if (!flashcards.length) {
        return (
            <div className="text-[#FEEEEE] flex flex-col justify-center items-center p-4">
                <h3 className="font-semibold text-xl">No flashcards selected</h3>
                <p className="text-sm text-stone-300 mt-2">
                    Select a project from the sidebar to start studying.
                </p>
            </div>
        );
    }

    const safeIdx = Math.max(0, Math.min(currentQuestionCounter, flashcards.length - 1));
    const currentFlashcard = flashcards[safeIdx];
    const selectedPriority = priorityChosen[currentQuestionCounter]?.[0];


    return (
        <div className="flex flex-col text-[#FEEEEE] px-10 pb-10 size-full" tabIndex={0}>
            <h3 className="right-1 text-lg font-semibold ml-auto">
                {selectedFileName 
                    ? selectedFileName
                    : `${reverseProjectIDDate(selectedProjectID)} - ${reverseProjectIDTime(selectedProjectID)}`}

            </h3>
            <p className="right-1 text-sm italics text-stone-500 ml-auto">Mastered Flashcards: {masteredCount}</p>
            {endOfQuestion ? 
                <div className="flex flex-col justify-center items-center max-w-[1000px] my-auto w-full mx-auto">
                    <span className="text-2xl font-bold">End of Flashcards</span>
                    <span className="text-stone-500 italics mb-15">{flashcards.length - masteredCount} more cards to mastery</span>
                    <span className="text-stone-300 font-semibold">Would you like to continue?</span>
                    <Button className="max-w-[200px] w-full mt-3 py-7 font-semibold text-xl hover:scale-110 transition ease-in-out active:scale-120">Yes</Button>
                </div>
                : 
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
            }
            {/* Progress bar and indications*/}
            <DashboardProgressbar length={flashcards.length} currentQuestionCounter={currentQuestionCounter} showAnswer={showAnswer}/>   


            {/* Dashboard Rating: Only show if not at the end of question.*/}
        {!endOfQuestion && <DashboardRating selectedPriority={selectedPriority}/>}
        </div>
    );
}
