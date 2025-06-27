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
import { toast } from "sonner";
import { removeItemByProjectID } from "../../db_utils/remove_item";

type Props={
    open: boolean
    onOpenChange: (open: boolean) => void
    project_id: string
}

export function DeleteDialog({open, onOpenChange, project_id}: Props){

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="dark text-[#FEEEEE]">
                <AlertDialogHeader className="flex items-center">
                    <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
                    <AlertDialogDescription />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="flex flex-row justify-evenly w-full">
                        <AlertDialogCancel className="hover:scale-105 active:scale-110">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={()=>{
                            toast.success("Project successfully deleted")
                            setTimeout(()=>{
                                removeItemByProjectID(project_id)
                                window.location.reload()},1000)}}
                            className="hover:scale-105 active:scale-110">
                            Continue
                        </AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

}
