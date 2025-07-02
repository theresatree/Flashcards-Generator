import { useEffect, useState, useRef } from "react";
import { MarkdownRenderer } from "./markdownComponents";
import { DashboardFlashcard } from "./dashboard/dashboardFlashcard";
import { motion  } from "motion/react";  
import DashboardRating from "./dashboard/dashboardRating";
import DashboardProgressbar from "./dashboard/dashboardProgressbar";
import { Button } from "./ui/button";
import type { Flashcard } from "../models/models";
import { toast } from "sonner";


type Props= {
    selectedProjectDetails: Flashcard[]
}

export default function SharedPageContent({selectedProjectDetails}: Props) {
    const [currentQuestionCounter, setCurrentQuestionCounter] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [endOfQuestion, setEndOfQuestion] = useState(false);
    const [priorityChosen,setPriorityChosen] = useState<number[][]>([]);
    const [masteredCount, setMasteredCount] = useState(0);
    const [reviewMode, setReviewMode] = useState(false);
    const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);
    const answerRef = useRef<HTMLDivElement>(null);
    const [answerHeight, setAnswerHeight] = useState(0);
    const [disableClick, setDisableClick]= useState(false);


    const flashcards = selectedProjectDetails;
    const activeFlashcards = reviewMode ? filteredFlashcards : flashcards;

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

    useEffect(() => {
        setCurrentQuestionCounter(0);
        setEndOfQuestion(false);
        setShowAnswer(false);
        setPriorityChosen(flashcards.map(() => [] as number[]));
        setMasteredCount(0);
        setReviewMode(false);
        setFilteredFlashcards([]);
    }, [flashcards]);

    useEffect(()=>{
        if (endOfQuestion){
            setDisableClick(true)
        } else {
            setDisableClick(false)
        }
    },[endOfQuestion])



    function applyRating(priority: number, advanceAfter: boolean = false) {
        const actualIndex = reviewMode
            ? flashcards.indexOf(activeFlashcards[currentQuestionCounter])
            : currentQuestionCounter;

        const next = priorityChosen.map(row => [...row]);
        next[actualIndex] = [priority];

        const mastered = flashcards.reduce((acc, _, idx) => {
            const p = next[idx];
            return acc + (p?.[0] === 1 ? 1 : 0);
        }, 0);

        setPriorityChosen(next);
        setMasteredCount(mastered);

        if (advanceAfter) {
            toast.success("Successfully set proficiency")
                setShowAnswer(false);
            setTimeout(()=>{
                const limit = activeFlashcards.length;
                setCurrentQuestionCounter(prev => {
                    if (prev < limit - 1) return prev + 1;
                    setEndOfQuestion(true);
                    return prev;
                });

            },500)
        }
    }

    useEffect(() => {
        function handleGlobalKeyDown(e: KeyboardEvent) {
            if (flashcards.length === 0) return;

            if (e.code === "Space" || e.key === " ") {
                e.preventDefault();
                setShowAnswer(prev => !prev);
            } else if (e.code === "ArrowLeft" || e.code === "KeyH") {
                e.preventDefault();
                if ((flashcards.length-masteredCount) === 0){
                    return;
                }
                if (endOfQuestion) setEndOfQuestion(false);
                    else {
                        setCurrentQuestionCounter(prev => (prev > 0 ? prev - 1 : prev));
                    }
                setShowAnswer(false);
            } else if (e.code.startsWith("Digit")) {
                const priority = parseInt(e.code.replace("Digit", ""), 10);
                if (!isNaN(priority) && !endOfQuestion) {
                    applyRating(priority, true); // Keyboard: do not advance
                }
            }
        }
        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, [flashcards.length, activeFlashcards, currentQuestionCounter, endOfQuestion, reviewMode]);



    function handleContinueMastery() {
        // Step 1: Build a list of unmastered flashcards with index + priority
        const unmastered: { idx: number; priority: number }[] = [];

        priorityChosen.forEach((priority, idx) => {
            const hasPriority = priority && priority.length > 0;
            const isMastered = hasPriority && priority[0] === 1;

            if (!isMastered) {
                // If not rated, treat as priority 999 (lowest priority)
                const effectivePriority = hasPriority ? priority[0] : 999;
                unmastered.push({ idx, priority: effectivePriority });
            }
        });

        // Step 2: Sort descending so worst mastery appears first
        const sorted = unmastered.sort((a, b) => b.priority - a.priority);

        // Step 3: Build new flashcard set
        const newFlashcards = sorted.map(item => flashcards[item.idx]);

        setShowAnswer(false);
        setFilteredFlashcards(newFlashcards);
        setReviewMode(true);
        setCurrentQuestionCounter(0);
        setEndOfQuestion(false);
    }




    const safeIdx = Math.max(0, Math.min(currentQuestionCounter, activeFlashcards.length - 1));
    const currentFlashcard = activeFlashcards[safeIdx];

    if (!currentFlashcard) {
        return (
            <div className="text-[#FEEEEE] flex flex-col justify-center items-center p-4">
                <h3 className="font-semibold text-xl">No flashcards selected</h3>
                <p className="text-sm text-stone-300 mt-2">
                    Select a project from the sidebar to start studying.
                </p>
            </div>
        );
    }

    const actualIndex = reviewMode
        ? flashcards.indexOf(activeFlashcards[currentQuestionCounter])
        : currentQuestionCounter;
    const selectedPriority = priorityChosen[actualIndex]?.[0];

    return (
        <div 
            className="flex flex-col text-[#FEEEEE] px-5 p-2 w-full h-svh" 
            tabIndex={0} 
            onClick={(e) => {
                e.stopPropagation(); 
                if (disableClick) return;
                // Only trigger on small screens
                setShowAnswer(prev => !prev);
            }}>
            <p className="right-1 text-sm italics text-stone-500 ml-auto mr-2 mt-2">Mastered Flashcards: {masteredCount}</p>
            {endOfQuestion ? (
                <div className="flex flex-col justify-center items-center max-w-[1000px] my-auto w-full mx-auto">
                    <span className="text-2xl font-bold">End of Flashcards</span>
                    <span className="text-stone-500 italics mb-15">{flashcards.length - masteredCount} more cards to mastery</span>
                    {(flashcards.length-masteredCount) != 0 ? 
                        <>
                            <span className="text-stone-300 font-semibold">Would you like to continue?</span>
                            <Button 
                                className="max-w-[200px] w-full mt-3 py-7 font-semibold text-xl hover:scale-110 transition ease-in-out active:scale-120"
                                onClick={(e) => {
                                e.stopPropagation();
                                handleContinueMastery()
                                }}
                            >Yes</Button>

                        </>
                        : 
                        <div>
                            <span className="text-3xl text-stone-200 font-semibold">Congratulations!</span>
                        </div>}
                </div>
            ) : (
                    <motion.div className="flex flex-col justify-center items-center max-w-[1000px] my-auto w-full mx-auto">
                        <motion.div
                            className="absolute md:text-2xl text-md font-semibold text-center max-w-[90%] break-words w-full"
                            initial={false}
                            animate={{ y: showAnswer ? -answerHeight/2 : 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <MarkdownRenderer content={currentFlashcard.question} />
                        </motion.div>
                        <motion.div
                            animate={showAnswer ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 90 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex justify-center items-center mt-4 w-full"
                        >
                            <div
                                ref={answerRef}
                                className={showAnswer
                                    ? "w-full mx-auto flex justify-center items-center"
                                    : "absolute opacity-0 pointer-events-none -z-10 w-full"}
                            >
                                <DashboardFlashcard text={currentFlashcard.answer} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            {!endOfQuestion && (
                <>
                    <DashboardProgressbar 
                        length={activeFlashcards.length} 
                        currentQuestionCounter={currentQuestionCounter} 
                        showAnswer={showAnswer} 
                    />
                    <DashboardRating
                        selectedPriority={selectedPriority}
                        onRate={(level) => applyRating(level, true)}
                    />
                </>
            ) 
            }
        </div>
    );
}
