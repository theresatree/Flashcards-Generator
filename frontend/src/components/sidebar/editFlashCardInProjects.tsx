import { useState } from "react";

import { motion } from "motion/react";
import RenderFlashcards from "../renderFlashcards";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import type { FileItem } from "../../models/models";

import { FlashcardContext } from "../../utils/FlashcardContext";



function EditFlashcardsInProjects(){
    const location = useLocation();
    const { project_id, projectFiles } = location.state as {
        project_id: string;
        projectFiles: FileItem[];
    };
    const [mostRecentFiles, setMostRecentFiles] = useState<FileItem[]>(projectFiles);

    return (
        <FlashcardContext.Provider value={{
            projectID: project_id,
            files: mostRecentFiles,
            setFiles: setMostRecentFiles
        }}>

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
                        <RenderFlashcards mostRecentFiles={mostRecentFiles} projectID={project_id} />
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
        </FlashcardContext.Provider>

    );
}

export default EditFlashcardsInProjects;


