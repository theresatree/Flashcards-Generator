import { motion } from "motion/react"
import { useEffect, useState } from "react";
import { getGeminiApiKey, getHFApiKey } from "../../utils/LocalStorageCRUD";    
import { retrieveAllProjectIDs } from "../../db_utils/retrieve_item";
import { SetupAPIGuide } from "../../components/setup_api_guide";
import { Loader } from "lucide-react";
import { useSidebarState } from "../../utils/SidebarContext";
import { Link } from "react-router-dom";


function Dashboard() {
{/*[0] - Gemini, [1] - HF*/}
    const[isAPISet, setIsAPISet] = useState<[boolean, boolean]>([false,false])
    const[anyProjectsAvail, setAnyProjectAvail] = useState(false)
    const[isLoading, setIsLoading] = useState(true)
    const{selectedProjectID, selectedProjectDetails}=useSidebarState()

    useEffect(() => {
        const geminiKey = getGeminiApiKey(); // Note: "" = false
        const hfKey = getHFApiKey();
        setIsAPISet([!!geminiKey, !!hfKey]);

        async function getProjects() {
            const projects = await retrieveAllProjectIDs();
            setAnyProjectAvail(projects.length > 0);
            setIsLoading(false)
        }
        getProjects();
    }, []);


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
            className="flex justify-center items-center w-full h-screen p-10"
        >
            {/* Show Main Content*/}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center text-[#FEEEEE]">
                    <Loader className="h-10 w-10 animate-spin mb-4" />
                    <p>Loading Information...</p>
                </div>
            ) : isAPISet[0] && isAPISet[1] ? (
                    anyProjectsAvail ? (
                        <div>
                            <h3>{selectedProjectID}</h3>
                            {(selectedProjectDetails[selectedProjectID]||[]).map((flashcard, index) => (
                                <div key={index}>
                                    {flashcard.question}
                                </div>
                            ))}
                        </div>
                    ) : (
                            <div className="flex justify-center items-center flex-col gap-7">
                                <div className="text-[#FEEEEE] text-3xl font-bold flex justify-center items-center">
                                    Please create a new project in settings
                                </div>
                                <Link
                                    to="/upload"
                                    className="bg-primary text-primary-foreground rounded-md px-10 py-3.5 hover:bg-stone-700 hover:scale-110 active:scale-120 active:bg-stone-500 transition-all ease-in-out">
                                    Create Project
                                </Link>
                            </div>
                        )
                ) : (
                        <SetupAPIGuide />
                    )}
        </motion.div>

    );
}

export default Dashboard;
