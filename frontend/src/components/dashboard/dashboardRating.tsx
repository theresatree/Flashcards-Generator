import { Button } from "../ui/button";

type Props = {
    selectedPriority: number;
    onRate: (value: number) => void; // ⬅️ Add this
};

export default function DashboardRating({ selectedPriority, onRate }: Props) {
    return (
        <div className="flex flex-col justify-center items-center w-full gap-2">
            <span className="text-stone-400 font-semibold mb-1">Rate your proficiency</span>

            {/* 🟩 Mobile View: Button-style */}
            <div className="flex flex-row gap-4 justify-center md:hidden w-full mb-3">
                {[
                    { level: 1, label: "Mastered", color: "green-600" },
                    { level: 2, label: "Proficient", color: "lime-600" },
                    { level: 3, label: "Good", color: "yellow-600" },
                    { level: 4, label: "Fair", color: "orange-600" },
                    { level: 5, label: "Bad", color: "red-600" },
                ].map(({ level, label, color }) => (
                        <Button
                            key={level}
                            onClick={(e) => {
                                e.stopPropagation();         // 🧠 Prevent outer div onClick
                                onRate(level);
                            }}                    
                            className={`text-white text-center px-3 py-1.5 flex-1 rounded border-2 border-${color} bg-${color} hover:scale-110 hover:bg-${color} active:scale-120 ${
selectedPriority === level ? "border-white" : ""
}`}
                        >
                            {label}
                        </Button>
                    ))}
            </div>

            {/* 🖥 Desktop View: Clickable rating boxes */}
            <div className="hidden md:flex flex-row gap-4">
                {[
                    { level: 1, label: "1 – Mastered", color: "green-600" },
                    { level: 2, label: "2 – Proficient", color: "lime-600" },
                    { level: 3, label: "3 – Good", color: "yellow-600" },
                    { level: 4, label: "4 – Fair", color: "orange-600" },
                    { level: 5, label: "5 – Bad", color: "red-600" },
                ].map(({ level, label, color }) => (
                        <div
                            key={level}
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRate(level);
                            }}

                            className={`px-3 py-1.5 bg-${color} rounded-sm text-white border-2 cursor-pointer hover:scale-105 transition-transform ${
selectedPriority === level ? "border-white" : `border-${color}`
}`}
                        >
                            {label}
                        </div>
                    ))}
            </div>

            {/* ⌨️ Keyboard hint only on desktop */}
            <div className="gap-2 hidden md:flex flex-row py-4 text-stone-400 font-semibold">
                Press
                {[1, 2, 3, 4, 5].map(n => (
                    <kbd
                        key={n}
                        className="inline-block px-2 py-0.5 text-sm font-mono bg-gray-800 rounded shadow-inner"
                    >
                        {n}
                    </kbd>
                ))}
                to rate
            </div>
        </div>
    );
}

