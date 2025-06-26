import { useEffect, useState } from "react";
import { useSidebarState } from "../../utils/SidebarContext";

export function DashboardFlashcard() {
    const { selectedProjectID, selectedProjectDetails } = useSidebarState();
    const [currentQuestionCounter, setCurrentQuestionCounter] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const flashcards = selectedProjectDetails[selectedProjectID] || [];

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
                console.log("Global spacebar pressed!");
            } else if (e.code === "ArrowRight" || e.code === "KeyL") {
                e.preventDefault();
                setCurrentQuestionCounter(prev => {
                    if (prev < flashcards.length - 1) {
                        return prev + 1;
                    }
                    return prev; // Stay at current position if at end
                });
                setShowAnswer(false);
                console.log("Global right pressed!");
            } else if (e.code === "ArrowLeft" || e.code === "KeyH") {
                e.preventDefault();
                setCurrentQuestionCounter(prev => {
                    if (prev > 0) {
                        return prev - 1;
                    }
                    return prev; // Stay at current position if at beginning
                });
                setShowAnswer(false);
                console.log("Global left pressed!");
            } else if (e.code === "Escape") {
                e.preventDefault();
                setShowAnswer(false);
                console.log("Hidden answer!");
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

    const currentFlashcard = flashcards[currentQuestionCounter];

    return (
        <div className="text-[#FEEEEE] p-4" tabIndex={0}>
            <h3 className="text-xl font-semibold">{selectedProjectID}</h3>
            
            <div className="mt-4">
                <div className="mb-4">
                    <p className="text-lg">
                        <span className="font-medium">Q:</span> {currentFlashcard.question}
                    </p>
                    {showAnswer && (
                        <p className="text-lg mt-3 p-3 bg-gray-800 rounded">
                            <span className="font-medium">A:</span> {currentFlashcard.answer}
                        </p>
                    )}
                </div>

                {/* Progress indicator */}
                <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>
                        {currentQuestionCounter + 1} of {flashcards.length}
                    </span>
                    <div className="text-xs">
                        <div>Space: {showAnswer ? 'Hide' : 'Show'} answer</div>
                        <div>←/→ or H/L: Navigate</div>
                        <div>Esc: Hide answer</div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                    <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                            width: `${((currentQuestionCounter + 1) / flashcards.length) * 100}%` 
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
