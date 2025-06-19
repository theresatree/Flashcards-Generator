import Dropzone from "../../components/dropzone.tsx";
import SplitText from "../../components/splitText.tsx";

import { Link } from "react-router-dom";
import { motion } from "motion/react"

function FirstPageUpload() {
    return (
        <motion.div 
           initial={{ scale: 0.3 }}
            animate={{
                scale: 1,
                transition: {
                    scale: { duration: 0.7, ease: "backOut" },
                },
            }}
            exit={{
                opacity: 0,
                transition: {
                    opacity: { duration: 0.3, ease: "easeIn" }
                }
            }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-[#303030]">
            <SplitText
                text="Upload files to begin"
                className="text-5xl font-semibold text-center mb-3 leading-relaxed text-[#FEEEEE]"
                delay={50}
                duration={0.3}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
            />
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl text-center">
                <Dropzone />
            </div>
            <div className="flex flex-col items-center justify-center text-sm mt-3 italic text-[#FEEEEE]">
                <span>
                    <Link to="/manual" className="underline text-[#ADD8E6]">Click here</Link> {" "}
                    to manually create flashcards from your own LLM 
                </span>
                <span className="mt-5">
                    This flashcard generator will <span className="underline decoration-red-500">only be able to parse text</span> from documents
                </span>
            </div>
        </motion.div>
    );
}

export default FirstPageUpload;
