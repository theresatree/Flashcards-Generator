import { Button } from "../ui/button";

type Props = {
    selectedPriority: number;
    onRate: (value: number) => void;
};

const COLOR_CLASSES: Record<number, { bg: string; border: string }> = {
    1: { bg: "bg-green-600", border: "border-green-600" },
    2: { bg: "bg-lime-600", border: "border-lime-600" },
    3: { bg: "bg-yellow-600", border: "border-yellow-600" },
    4: { bg: "bg-orange-600", border: "border-orange-600" },
    5: { bg: "bg-red-600", border: "border-red-600" },
};

export default function DashboardRating({ selectedPriority, onRate }: Props) {
    return (
        <div className="flex flex-col justify-center items-center w-full gap-2">
            <span className="text-stone-400 font-semibold mb-1">Rate your proficiency</span>

            {/* 🟩 Mobile View: Button-style */}
            <div className="flex flex-row gap-4 justify-center md:hidden w-full mb-3">
                {[1, 2, 3, 4, 5].map((level) => {
                    const { bg, border } = COLOR_CLASSES[level];
                    const label = ["Mastered", "Proficient", "Good", "Fair", "Bad"][level - 1];

                    return (
                        <Button
                            key={level}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRate(level);
                            }}
                            className={`text-white text-center px-3 py-1.5 flex-1 rounded border-2 ${bg} ${border} hover:scale-110 active:scale-120 ${
                                selectedPriority === level ? "border-white" : ""
                            }`}
                        >
                            {label}
                        </Button>
                    );
                })}
            </div>

            {/* 🖥 Desktop View: Clickable rating boxes */}
            <div className="hidden md:flex flex-row gap-4">
                {[1, 2, 3, 4, 5].map((level) => {
                    const { bg, border } = COLOR_CLASSES[level];
                    const label = `${level} – ${["Mastered", "Proficient", "Good", "Fair", "Bad"][level - 1]}`;

                    return (
                        <div
                            key={level}
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRate(level);
                            }}
                            className={`px-3 py-1.5 rounded-sm text-white border-2 cursor-pointer hover:scale-105 transition-transform ${
                                bg
                            } ${
                                selectedPriority === level ? "border-white" : border
                            }`}
                        >
                            {label}
                        </div>
                    );
                })}
            </div>

            {/* ⌨️ Keyboard hint only on desktop */}
            <div className="gap-2 hidden md:flex flex-row py-4 text-stone-400 font-semibold">
                Press
                {[1, 2, 3, 4, 5].map((n) => (
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
