
type Props = {
    length: number;
    currentQuestionCounter: number;
    showAnswer: boolean;
};

export default function DashboardProgressbar({ length, currentQuestionCounter, showAnswer }: Props) {
    return (
        <div>
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                        width: `${((currentQuestionCounter + 1) / length) * 100}%` 
                    }}
                ></div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-400 px-5 pt-2 pb-5">
                <span>
                    {currentQuestionCounter + 1} of {length}
                </span>

                {/* 👇 Mobile View: Show tap hint */}
                <div className="block md:hidden text-xs text-right">
                    Tap to {showAnswer ? "hide" : "show"} answer
                </div>

                {/* 👇 Desktop View: Show keyboard shortcuts */}
                <div className="hidden md:flex flex-row text-xs gap-5">
                    <div>Space: {showAnswer ? 'Hide' : 'Show'} answer</div>
                    <div>← or H: Navigate back</div>
                </div>
            </div>
        </div>
    );
}

