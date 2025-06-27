import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../components/ui/alert-dialog"
import { toast } from "sonner";
import { removeFlashcardFromFile } from "../db_utils/remove_item";
import { retrieveAllFilesByProjectID } from "../db_utils/retrieve_item";
import { useFlashcardContext } from "../utils/FlashcardContext";

type Props={
    open: boolean
    onOpenChange: (open: boolean) => void
    project_id: string
    filename: string
    index: number
}

export default function EditFlashcardDeleteDialog({open, onOpenChange, project_id, filename, index}: Props){
    const { setFiles } = useFlashcardContext();

    async function deleteClicked() {
        try {
            // remove the card, re-fetch everything, update context
            await removeFlashcardFromFile(project_id, filename, index);
            toast.success("Flashcard deleted!");
            onOpenChange(false);
            const refreshed = await retrieveAllFilesByProjectID(project_id);
            setFiles(refreshed);
        } catch (err) {
            toast.error("Delete failed: " + (err as Error).message);
        }
    } 


    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="dark text-[#FEEEEE]">
                <AlertDialogHeader className="flex items-center">
                    <AlertDialogTitle>Are you sure you want to delete this flashcard?</AlertDialogTitle>
                    <AlertDialogDescription />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="flex flex-row justify-evenly w-full">
                        <AlertDialogCancel className="hover:scale-105 active:scale-110">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => {
                                e.stopPropagation();  
                                deleteClicked();
                            }}
                            className="hover:scale-105 active:scale-110">
                            Continue
                        </AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

}
