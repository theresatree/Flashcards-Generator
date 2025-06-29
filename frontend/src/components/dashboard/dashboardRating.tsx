type Props={
    selectedPriority: number;
}

export default function DashboardRating({selectedPriority}: Props){
    return (
            <div className="flex flex-col justify-center items-center w-full gap-2">
                <span className="text-stone-400 font-semibold mb-1">Rate your proficiency</span>
                    <div className="flex flex-row gap-4">
                        <div   
                            className={`px-3 py-1.5 bg-green-600 rounded-sm text-white border-2 ${selectedPriority === 1 ? "border-white" : "border-green-600"}`}>
                            1 – Mastered
                        </div>
                        <div className={`px-3 py-1.5 bg-lime-600 rounded-sm text-white border-2 ${selectedPriority === 2 ? "border-white" : "border-lime-600"}`}>
                            2 – Proficient
                        </div>
                        <div className={`px-3 py-1.5 bg-yellow-600 rounded-sm text-white border-2 ${selectedPriority === 3 ? "border-white" : "border-yellow-600"}`}>
                            3 – Good
                        </div>
                        <div className={`px-3 py-1.5 bg-orange-600 rounded-sm text-white border-2 ${selectedPriority === 4 ? "border-white" : "border-orange-600"}`}>
                            4 – Fair
                        </div>
                        <div className={`px-3 py-1.5 bg-red-600 rounded-sm text-white border-2 ${selectedPriority === 5 ? "border-white" : "border-red-600"}`}>
                            5 – Bad
                        </div>
                </div>
                <div className="gap-2 flex flex-row p-5 text-stone-400 font-semibold">
                    Press
                    <kbd className="inline-block px-2 py-0.5 text-sm font-mono bg-gray-800 rounded shadow-inner">
                        1
                    </kbd> 
                    <kbd className="inline-block px-2 py-0.5 text-sm font-mono bg-gray-800 rounded shadow-inner">
                        2
                    </kbd> 
                    <kbd className="inline-block px-2 py-0.5 text-sm font-mono bg-gray-800 rounded shadow-inner">
                        3
                    </kbd> 
                    <kbd className="inline-block px-2 py-0.5 text-sm font-mono bg-gray-800 rounded shadow-inner">
                        4
                    </kbd> 
                    <kbd className="inline-block px-2 py-0.5 text-sm font-mono bg-gray-800 rounded shadow-inner">
                        5
                    </kbd> 
                    to rate
                </div>
            </div>
    );
}
