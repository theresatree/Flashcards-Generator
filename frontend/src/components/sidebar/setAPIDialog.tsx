import { Button } from "../../components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { toast } from "sonner"

import { useState,useEffect } from "react"
import { getGeminiApiKey,getHFApiKey, setHFApiKey, setGeminiApiKey } from "../../utils/LocalStorageCRUD"

type Props={
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function APIDialog({open, onOpenChange}: Props) {
    const[geminiKey, setGeminiKey] = useState("")
    const[hfKey, setHFKey] = useState("")

    useEffect(() => {
        setGeminiKey(getGeminiApiKey());
        setHFKey(getHFApiKey())
    }, []);

    function saveAPIKey(){
        setGeminiApiKey(geminiKey)
        setHFApiKey(hfKey)
        toast.success("Successfully set API Keys, reloading window") 
        setTimeout(()=>{
            window.location.reload();
        },1000);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] dark text-[#FEEEEE]">
                <DialogHeader>
                    <DialogTitle>Set API keys</DialogTitle>
                    <DialogDescription>
                        Make sure to save changes
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4" >
                    <div className="grid gap-3">
                        <Label >Gemini Flash 2.0 API Key</Label>
                        <Input id="gemini" defaultValue={geminiKey} onChange={e => setGeminiKey(e.target.value)} />
                    </div>
                    <div className="grid gap-3">
                        <Label >Hugging Face API Key</Label>
                        <Input id="hf" defaultValue={hfKey} onChange={e => setHFKey(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <div className="flex flex-row justify-between w-full mt-8">
                        <DialogClose asChild>
                            <Button variant="outline" className="hover:scale-105 active:scale-110">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={()=>saveAPIKey()} className="hover:scale-105 active:scale-110">Save changes</Button>
                        </DialogClose>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>  )
}
