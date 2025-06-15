import Flashcard from "../../components/flashcard";
import { FlashcardSkeleton } from "../../components/skeletons";
import { motion } from "motion/react";
import { parseMostRecentProject } from "../../utils/parseFiles";
import { useEffect, useRef } from "react";

function ConfirmFlashCards() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // ✅ already ran once
    ran.current = true;

    const run = async () => {
      const data = await parseMostRecentProject();
      console.log("Most recent project files:", data);
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
                Gay
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
            <FlashcardSkeleton />
        </motion.div>
    );
}


export default ConfirmFlashCards;

