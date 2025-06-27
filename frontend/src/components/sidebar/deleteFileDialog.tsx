import { useState } from "react";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select"
import type { FileItem } from "../../models/models";
import { removeItemByProjectIDAndFilename } from "../../db_utils/remove_item";
import { toast } from "sonner"; 

type Props={
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project_id: string;
    files: FileItem[];
}

export function DeleteFileDialog({open, onOpenChange, project_id, files }: Props){
    const[selectedFileName, setSelectedFileName] = useState("")

    async function removeItem(){
        if (selectedFileName == ""){
            toast.error("Please select a file")
            return;
        } else {
            await removeItemByProjectIDAndFilename(project_id, selectedFileName)
            toast.success("Delete successful. Reloading window")
            setTimeout(()=>{
                window.location.reload()
            },1000)
        }

    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="dark text-[#FEEEEE]">
                <AlertDialogHeader className="flex items-center mb-5">
                    <AlertDialogTitle>Choose a file to delete</AlertDialogTitle>
                    <Select onValueChange={setSelectedFileName}>
                        <SelectTrigger className="w-[500px] mt-3">
                            <SelectValue placeholder="Select a file" />
                        </SelectTrigger>
                        <SelectContent className="dark">
                            <SelectGroup>
                                {files.map(file => (
                                    <SelectItem value={file.filename}>
                                        {file.filename}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <AlertDialogDescription />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="flex flex-row justify-evenly w-full">
                        <AlertDialogCancel className="hover:scale-105 active:scale-110">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={()=> removeItem()} 
                            className="hover:scale-105 active:scale-110">
                            Delete 
                        </AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

}
