import Flashcard from "../../components/flashcard";
import { FlashcardSkeleton } from "../../components/skeletons";
import { Progress } from "../../components/ui/progress";

import { motion } from "motion/react";
import { parseMostRecentProject } from "../../utils/parseFiles";
import { useEffect, useRef, useState, Suspense } from "react";

function ConfirmFlashCards() {
    const [progressValue, setProgressValue] = useState(0)
    const [loading, setLoading] = useState(true)
    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return; // ✅ already ran once
        ran.current = true;

        const run = async () => {
            const data = await parseMostRecentProject();
            console.log("Most recent project files:", data);
            setProgressValue(100);
            setLoading(false);
        };
        run();
    }, []);

    function listOfFlashcards(count: number){
        return Array.from({ length: count }).map((_, index) => (
            <Flashcard key={index} />
        ));
    }

    function listOfFlashcardTitles(count: number){
        return Array.from({ length: count }).map((_, index) => (
            <h3 key={index} className="text-xl ">
                Title of flashcard
            </h3>
        ));
    }


    ////////******** PUT ALL THE ONES ABOVE IN A FUNCTION

    return (
        <motion.div
            initial={{ scale: 0.3 }}
            animate={{
                scale: 1,
                transition: {
                    scale: { duration: 0.7, ease: "backOut" },
                },
            }}
            className="fixed inset-0 flex items-center justify-center"
        >
            {loading ? (
                <div className="flex flex-col items-center justify-center text-[#FEEEEE]">
                    <FlashcardSkeleton />
                    <Progress
                        value={progressValue}
                        className="w-[400px] h-[15px] mt-10 bg-blue-100"
                    />
                </div>
            ) : (
                    <div className="flex flex-col gap-10">
                    <div className="relative min-w-[450px] max-w-[600px] w-full">
                        <div className="absolute -top-5 left-1 text-[#FEEEEE]">
                            {listOfFlashcardTitles(1)}
                        </div>
                        <div className="flex flex-col  justify-center">
                            {listOfFlashcards(1)}
                        </div>
                    </div>
                    <div className="relative min-w-[450px] max-w-[600px] w-full">
                        <div className="absolute -top-5 left-1 text-[#FEEEEE]">
                            {listOfFlashcardTitles(1)}
                        </div>
                        <div className="flex flex-col  justify-center">
                            {listOfFlashcards(2)}
                        </div>
                    </div>
                    </div>
                )}
        </motion.div>
    );
}


export default ConfirmFlashCards;

