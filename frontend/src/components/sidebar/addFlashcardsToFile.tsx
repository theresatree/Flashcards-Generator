import { useState, useEffect, useRef } from "react";

import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { generateAdditionalFlashcards } from "./generateAdditionalFlashcards";
import { toast } from "sonner";
import type { FileItem } from "../../models/models";
import { FlashcardContext } from "../../utils/FlashcardContext";
import RenderFileFlashcardStack from "./RenderFileFlashcardStack";
import { Loader } from "lucide-react";


function AddFlashcardsToFile(){
    const location = useLocation();
    const { project_id, projectFile, flashcardCount } = location.state;
    const[file, setFile] = useState<FileItem>()
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        async function run() {
            try {
                const generatedFlashcards = await generateAdditionalFlashcards(project_id, projectFile, flashcardCount);
                setFile(generatedFlashcards);
                toast.success(`${flashcardCount} flashcards generated`);
            } catch (err) {
                toast.error(`Failed to generate: ${err}`);
            }
        }

        run();
    }, [project_id, projectFile, flashcardCount]);

    return (


        <FlashcardContext.Provider value={{
            projectID: project_id,
            files: file ? [file] : [],
            setFiles: (files) => {
                // Expecting only one file, so just grab the first
                if (files.length > 0) setFile(files[0]);
            }
        }}>
            {(file) ?
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
                    className="fixed inset-0 overflow-auto pt-6"
                >
                    <div className="flex flex-row items-center justify-center w-full min-h-screen">
                        <div className="flex-col w-3/5 items-center justify-center min-w-[850px] pl-[50px]">
                            <RenderFileFlashcardStack flashcards={file.flashcards} projectID={project_id} filename={projectFile} />
                        </div>
                        <div className="flex flex-col w-2/5 gap-10 sticky self-start top-1/2 items-center xl:pl-[50px] xl:mr-auto xl:items-start">
                            <Link
                                to="/"
                                className="flex justify-center min-w-[200px] px-10 py-3 rounded-md border bg-white text-black-200 font-bold duration-200 hover:scale-115 hover:bg-green-500 hover:border-green-500 active:scale-125 transition-all ease-in-out">
                                Confirm
                            </Link>
                            <Link
                                to="/"
                                className="flex justify-center min-w-[200px] px-10 py-3 rounded-md bg-white font-bold transition-all ease-in-out duration-200 hover:scale-115 active:scale-125 hover:bg-red-500 hover:border-red-500">
                                Go back 
                            </Link>
                        </div>
                    </div>
                </motion.div>
                : 
                <div className="flex flex-col items-center justify-center min-h-screen text-[#FEEEEE]">
                    <Loader className="h-10 w-10 animate-spin mb-4" />
                    <p>Generating flashcards...</p>
                </div>
            }
        </FlashcardContext.Provider>
    );
}

export default AddFlashcardsToFile;


