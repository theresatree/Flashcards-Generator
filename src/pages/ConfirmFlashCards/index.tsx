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
            </h3>
        ));
    }


    ////////******** PUT ALL THE ONES ABOVE IN A FUNCTION

    return (
        <motion.div
            initial={{ scale: 0.3}}
            animate={{
                scale: 1,
                transition: {
                    scale: { duration: 0.7, ease: "backOut" },
                }
            }}
            className="fixed inset-0 flex flex-col items-center justify-center text-[#FEEEEE]">
            {loading 
                ? (<FlashcardSkeleton />)
                : (<div>Hello</div> )
            }
            <Progress value={progressValue} className="w-[400px] h-[15px] mt-10 bg-blue-100"/>
        </motion.div>
    );
}


export default ConfirmFlashCards;

