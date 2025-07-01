import { motion } from "motion/react"
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { decodeFlashcards } from "../../utils/QRCodeHelper";
import { Loader } from "lucide-react";
import type { Flashcard } from "../../models/models";
import SharedPageContent from "../../components/sharedPageViewer";


export default function SharedPage() {
    const [searchParams] = useSearchParams();
    const[isLoading, setIsLoading] = useState(true);
    const [flashcards, setFlashcards] = useState<Flashcard[]|null>(null);
    const [error, setError] = useState<string|null>(null);


    useEffect(() => {
        const encodedData = searchParams.get("data");
        console.log("🔍 raw data param:", encodedData);

        if (!encodedData) {
            setError("No flashcards found");
            return;
        }

        try {
            const safeDecoded = decodeURIComponent(encodedData);
            console.log("🔓 Decoded string:", safeDecoded);
            const decoded = decodeFlashcards(safeDecoded); // <- important
            console.log("✅ Decoded flashcards:", decoded);
            setFlashcards(decoded);
            setIsLoading(false);
        } catch (err) {
            console.error("❌ Flashcard decode failed:", err);
            setError("Invalid or corrupted flashcard data.");
        }
    }, [searchParams]);

    if (isLoading){
        return (
            <div className="flex flex-col items-center justify-center text-[#FEEEEE]">
                <Loader className="h-10 w-10 animate-spin mb-4" />
                <p>Loading Information...</p>
            </div>
        );

    }


    if (error) {
        return (
            <div className="text-center text-red-300 p-4">
                <h2 className="text-lg font-semibold">🚫 Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!flashcards?.length) {
        return (
            <div className="text-center text-yellow-300 p-4">
                <h2 className="text-lg font-semibold">No Flashcards</h2>
                <p>This link does not contain any QnA.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ scale: 0.3 }}
            animate={{
                scale: 1,
                transition: { scale: { duration: 0.7, ease: "backOut" } },
            }}
            exit={{
                opacity: 0,
                transition: { opacity: { duration: 0.3, ease: "easeIn" } },
            }}
            className="flex justify-center items-center w-full h-svh">
            <SharedPageContent selectedProjectDetails={flashcards}/>
        </motion.div>
    );
}

