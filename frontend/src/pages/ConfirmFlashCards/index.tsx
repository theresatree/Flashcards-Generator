import { FlashcardSkeleton } from "../../components/skeletons";
import { Progress } from "../../components/ui/progress";
import { RAG } from "../../utils/RAG";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { retrieveAllFilesByProjectID } from "../../db_utils/retrieve_item";
import RenderFlashcards from "../../components/renderFlashcards";
import type { FileItem } from "../../models/models";
import { FlashcardContext } from "../../utils/FlashcardContext";
import { removeItemByProjectID } from "../../db_utils/remove_item";

function ConfirmFlashCards() {
    const [progressValue, setProgressValue] = useState(0);
    const [progressText, setProgressText] = useState("");
    const [loading, setLoading] = useState(true)
    const [mostRecentFiles, setMostRecentFiles] = useState<FileItem[]>([]);
    const [mostRecentProjectID, setMostRecentProjectID] = useState("")
    const ran = useRef(false);
    const userConfirmed = useRef(false);

    const location = useLocation();
    const uploadedFilenames = useRef<Set<string>>(new Set(location.state?.uploadedFiles || []));


    useEffect(() => {
        if (ran.current) return;
        ran.current = true;

        const run = async () => {
            try {
                const projectID = await RAG((v, text) => {
                    setProgressValue(v);
                    setProgressText(text);
                });

                if (projectID) {
                    const files = await retrieveAllFilesByProjectID(projectID);
                    const filtered = files.filter(file =>
                        uploadedFilenames.current.has(file.filename)
                    );

                    setMostRecentProjectID(projectID);
                    setMostRecentFiles(filtered);
                    setLoading(false);
                } else {
                    toast.error("Error generating flashcard. Please restart");
                }
            } catch (error) {
                console.error("Caught RAG error:", error);
                toast.error("Error: " + (error instanceof Error ? error.message : String(error)));
            }
        };

        run();
    }, []);
    // Handle all types of navigation away from the page
    useEffect(() => {
        const deleteProject = async () => {
            if (!userConfirmed.current && mostRecentProjectID) {
                try {
                    await removeItemByProjectID(mostRecentProjectID);
                    console.log("Project deleted on navigation:", mostRecentProjectID);
                } catch (error) {
                    console.error("Error deleting project:", error);
                }
            }
        };

        // Handle browser back/forward navigation
        const handlePopState = () => {
            deleteProject();
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [mostRecentProjectID]);



    async function removeMostRecentProject(){
        await removeItemByProjectID(mostRecentProjectID) 
    }


    return (

        <FlashcardContext.Provider value={{
            projectID: mostRecentProjectID,
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
                {loading ? (
                    <div className="flex flex-col items-center justify-center text-[#FEEEEE] min-h-full">
                        <FlashcardSkeleton />
                        <Progress
                            value={progressValue}
                            className="w-[400px] h-[15px] mt-15 bg-blue-100"
                        />
                        <div className="t-m mt-5">{progressText}</div>
                    </div>
                ) : (
                        <div className="flex flex-row items-center justify-center w-full min-h-screen">
                            <div className="flex-col w-3/5 items-center justify-center min-w-[850px] pl-[50px]">
                                <RenderFlashcards mostRecentFiles={mostRecentFiles} projectID={mostRecentProjectID} />
                            </div>
                            <div className="flex flex-col w-2/5 gap-10 sticky self-start top-1/2 items-center xl:pl-[50px] xl:mr-auto xl:items-start">
                                <Link
                                    to="/"
                                    onClick={() => {
                                        userConfirmed.current = true;
                                    }}
                                    className="flex justify-center min-w-[200px] px-10 py-3 rounded-md border bg-white text-black-200 font-bold duration-200 hover:scale-115 hover:bg-green-500 hover:border-green-500 active:scale-125 transition-all ease-in-out">
                                    Confirm
                                </Link>
                                <Link
                                    to="/"
                                    onClick={async () => {
                                        userConfirmed.current = true;
                                        await removeMostRecentProject();
                                    }}
                                    className="flex justify-center min-w-[200px] px-10 py-3 rounded-md bg-white font-bold transition-all ease-in-out duration-200 hover:scale-115 active:scale-125 hover:bg-red-500 hover:border-red-500">
                                    Go back 
                                </Link>
                            </div>
                        </div>
                    )}
            </motion.div>
        </FlashcardContext.Provider>
    );
}

export default ConfirmFlashCards;
