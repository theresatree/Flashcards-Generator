import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
} from "../../components/ui/alert-dialog"
import type { FileItem } from "../../models/models";
import AddFlashcardsPromptInputs from "./FlashcardDialogPromptInputs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Props={
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project_id: string;
    files: FileItem[];
}

export default function AddFlashcardDialog({open, onOpenChange, project_id, files }: Props){
    const[selectedFileName, setSelectedFileName] = useState("")
    const[selectedFlashcardsAmount, setSelectedFlashcardsAmount]= useState(0);

    const navigate = useNavigate();

    useEffect(()=>{
        if (open){
            setSelectedFlashcardsAmount(0)
            setSelectedFileName("")
        }
    },[open, project_id, files])

    function areInputsFilled() {
        if (selectedFileName === ""){
            toast.error("Please select a file!")
        } else if (selectedFlashcardsAmount === 0){
            toast.error("Please enter a number!")
        } else {
            navigate("/generate", {
                state: {
                    project_id,
                    projectFile: selectedFileName,
                    flashcardCount: selectedFlashcardsAmount
                }
            });
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="dark text-[#FEEEEE] w-full">
                <AddFlashcardsPromptInputs
                    files={files}
                    selectedFile={selectedFileName}
                    onFileChange={setSelectedFileName}
                    selectedFlashcardsAmount={selectedFlashcardsAmount}
                    setSelectedFlashcardsAmount={setSelectedFlashcardsAmount}
                    onSubmit={areInputsFilled}
                    onCancel={() => onOpenChange(false)}
                />
            </AlertDialogContent>
        </AlertDialog>
    )

}
