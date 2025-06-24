import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "../components/ui/drawer"
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";   
import { Label } from "./ui/label";
import { updateFlashcard } from "../db_utils/update_item";
import { retrieveFlashcardByIndex } from "../db_utils/retrieve_item";    
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFlashcardContext } from "../utils/FlashcardContext";
import { retrieveAllFilesByProjectID } from "../db_utils/retrieve_item";    

type Props={
    filename:string
    project_id:string
    index: number
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditFlashcard({filename, project_id, index, open, onOpenChange}: Props) {
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const {setFiles} = useFlashcardContext();
 

    useEffect(() =>{
        async function getFlashCardInfo() {
            const flashcardContents = await retrieveFlashcardByIndex(project_id, filename, index);
            if (flashcardContents){
                setQuestion(flashcardContents.question)
                setAnswer(flashcardContents.answer)
            }
        }
        
        getFlashCardInfo()
    }, [project_id,filename,index])

    async function confirmClicked(){
        try {
            await updateFlashcard(project_id, filename, index, question, answer);
            toast.success("Flashcard updated!"); 
            onOpenChange(false);                 
            //  Refresh all files from DB
            const refreshed = await retrieveAllFilesByProjectID(project_id);
            setFiles(refreshed);

            onOpenChange(false);
        } catch (err) {
            toast.error("Update failed: " + (err as Error).message);
        }
    }


    return(
        <Drawer open={open} onOpenChange={onOpenChange} >
            <DrawerContent 
                className="bg-[#404040] text-gray-100"
                onClick={(e) => e.stopPropagation()}>
                <DrawerHeader className="text-left">
                    <DrawerTitle className="text-lg font-semibold text-[#FEEEEE]">
                        Edit Flashcard
                    </DrawerTitle>
                    <DrawerDescription>
                        {/* This is for Questions*/}
                        <Label
                            className="font-semibold mb-1 ml-2 text-white text-base">
                            Question {index + 1}
                        </Label> {/* Ensure that index is formatted from 1 to 10 */} 
                        <Textarea
                            className="text-white text-md bg-zinc-800 border-none"
                            rows={3}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />

                        {/* This is for Answers*/}
                        <Label
                            className="font-semibold mt-8 mb-1 ml-2 text-white text-base">
                            Answer {index + 1}
                        </Label> {/* Ensure that index is formatted from 1 to 10 */} 
                        <Textarea
                            className="text-white text-md bg-zinc-800 border-none"
                            rows={5}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="flex flex-row w-full mx-auto justify-between mb-[5px] pt-2">
                    <DrawerClose asChild>
                    <Button className="min-w-[300px] hover:scale-110 hover:bg-red-500 active:scale-115">Return</Button>
                    </DrawerClose>
                    <Button 
                        className="min-w-[300px] hover:scale-110 hover:bg-green-500 active:scale-115"
                        onClick={async () => confirmClicked()}    
                    >Confirm Edit</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
