import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription
} from "../../components/ui/alert-dialog"
import { toast } from "sonner";
import type { Flashcard } from "../../models/models";   
import { Clipboard } from "lucide-react";
import { Button } from "../ui/button";
import { reverseProjectIDDate, reverseProjectIDTime } from "../../utils/reverseProjectID";
import { encodeFlashcards } from "../../utils/QRCodeHelper";    
import { useEffect, useState } from "react";
import QRCodeGenerator from "../QRCodeImage";

type Props={
    open: boolean
    onOpenChange: (open: boolean) => void
    project_id: string
    files: Flashcard[];
}
const MAIN_URL = window.location.origin + "/Flashcards-Generator/";

export default function QRDialog({open, onOpenChange, project_id, files}: Props){
    const readableFileName = `${reverseProjectIDDate(project_id)} - ${reverseProjectIDTime(project_id)}`;
    const [showQRCode, setShowQRCode] = useState(true)
    const [showLink, setShowLink] = useState("")
    const [encodedSize, setEncodedSize] = useState(0)
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!open) return;
        const encodedData = encodeFlashcards(files)
        setEncodedSize(encodedData.length)
        const safeEncoded = encodeURIComponent(encodedData);
        if (encodedData.length <= 2500){
            toast.success("Link and QR successfully generated!")
            setShowLink(`shared?data=${safeEncoded}`)
        } else if (encodedData.length > 2500 && encodedData.length <=7500 ){
            toast.warning("File too big for QR code. Generating Link")
            setShowQRCode(false)
            setShowLink(`shared?data=${safeEncoded}`)
        } else {
            setShowQRCode(false)
            setShowLink("")
        }
        console.log(encodedSize)
        console.log(encodedData)
    },[files, open])


    const handleCopy = () => {
        navigator.clipboard.writeText(MAIN_URL+showLink);
        setCopied(true);
    };

    useEffect(() => {
        if (copied) {
            toast.success("Successfully copied");
            setCopied(false);
        }
    }, [copied]);


    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="dark text-[#FEEEEE]">
                <AlertDialogHeader className="flex items-center">
                    <AlertDialogTitle>Shareable Link for:{"  "}
                        <span className="underline text-red-300">{readableFileName}</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription />
                </AlertDialogHeader>
                {showQRCode && <QRCodeGenerator value={MAIN_URL+showLink}/>}
                <div className="overflow-hidden px-3 pb-3">
                    <div className="flex flex-row gap-5 items-center">
                        <div className="flex-1 min-w-0 overflow-x-auto bg-zinc-800 text-gray-200 font-mono text-sm p-2 rounded">
                            <div className="truncate">
                                {MAIN_URL+showLink}
                            </div>
                        </div>
                        <Button 
                            size="icon"
                            aria-label="Copy link"
                            className="px-2 py-1 rounded bg-zinc-700 text-gray-100 hover:bg-zinc-600 active:scale-110 flex-shrink-0"
                            onClick={handleCopy}>
                            <Clipboard />
                        </Button>
                    </div>
                </div>

                <AlertDialogFooter>
                    <div className="flex flex-row justify-evenly w-full">
                        <AlertDialogCancel className="hover:scale-105 active:scale-110 py-5">Return to Dashboard</AlertDialogCancel>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>    
    )

}
