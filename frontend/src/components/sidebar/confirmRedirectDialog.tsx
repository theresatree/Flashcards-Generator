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
import { useNavigate } from "react-router-dom";

type Props={
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UploadDialog({open, onOpenChange}: Props){
    const navigate = useNavigate();

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="dark text-[#FEEEEE]">
                <AlertDialogHeader className="flex items-center">
                    <AlertDialogTitle>Are you sure you want to add a new project?</AlertDialogTitle>
                    <AlertDialogDescription />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="flex flex-row justify-evenly w-full">
                        <AlertDialogCancel className="hover:scale-105 active:scale-110">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={()=>navigate("/upload")}
                            className="hover:scale-105 active:scale-110">
                            Continue
                        </AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

}
