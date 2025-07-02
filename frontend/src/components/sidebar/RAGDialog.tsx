import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
} from "../../components/ui/alert-dialog"
import type { FileItem } from "../../models/models";
import RAGPromptInputs from "./RAGDialogPromptInput";
import RAGDialogOutput from "./RAGDialogOutput";
import { toast } from "sonner";

type Props={
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project_id: string;
    files: FileItem[];
}

export default function RAGDialog({open, onOpenChange, project_id, files }: Props){
    const[selectedFileName, setSelectedFileName] = useState("")
    const[promptText, setPromptText] = useState("")
    const[selectedPrompt, setSelectedPrompt] = useState(false)

    useEffect(()=>{
        if (open){
            setSelectedPrompt(false);
            setPromptText("")
            setSelectedFileName("")
        }
    },[open, project_id, files])

    function areInputsFilled() {
        if (selectedFileName === ""){
            toast.error("Please select a file!")
        } else if (promptText === ""){
            toast.error("Please input a prompt")
        } else {
            setSelectedPrompt(true)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {!selectedPrompt ? (
                <AlertDialogContent className="dark text-[#FEEEEE] w-full">
                    <RAGPromptInputs
                        files={files}
                        selectedFile={selectedFileName}
                        onFileChange={setSelectedFileName}
                        promptText={promptText}
                        onPromptChange={setPromptText}
                        onSubmit={areInputsFilled}
                        onCancel={() => onOpenChange(false)}
                    />
                </AlertDialogContent>
            ) : (
                    <AlertDialogContent className="dark text-[#FEEEEE] w-full">
                        <RAGDialogOutput
                            promptText={promptText}
                            selectedFileName={selectedFileName}
                            project_id={project_id}
                            onCancel={() => onOpenChange(false)}
                        />
                    </AlertDialogContent>
                )}
        </AlertDialog>
    )

}
