import {
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "../ui/alert-dialog";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "../ui/select";
import { NumberSelect } from "../../utils/selectNumber";
import { Button } from "../ui/button";

type PromptInputsProps = {
    files: { filename: string }[];
    selectedFile: string;
    onFileChange: (value: string) => void;
    selectedFlashcardsAmount: number;
    setSelectedFlashcardsAmount: (value: number) => void;
    onSubmit: () => void;
    onCancel: () => void;
};

export default function AddFlashcardsPromptInputs({
    files,
    selectedFile,
    onFileChange,
    selectedFlashcardsAmount,
    setSelectedFlashcardsAmount,
    onSubmit,
    onCancel,
}: PromptInputsProps) {
    return (
        <>
            <AlertDialogHeader>
                <AlertDialogTitle>Add more flashcards</AlertDialogTitle>
                <AlertDialogDescription>
                    Select a file and choose the amount of flashcards to add
                </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex flex-col space-y-4 px-4">
                {/* File Selector */}
                <Select value={selectedFile} onValueChange={onFileChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a file…" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {files.map((f) => (
                                <SelectItem key={f.filename} value={f.filename}>
                                    {f.filename}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div className="flex flex-row ml-auto items-center gap-5 mb-3">
                    <span>
                        Choose amount of flashcards
                    </span>
                    <NumberSelect
                        value={selectedFlashcardsAmount}
                        onChange={(val) => {
                            setSelectedFlashcardsAmount(val);
                        }}
                    />
                </div>
            </div>

            <AlertDialogFooter>
                <div className="flex w-full justify-between space-x-2 px-4">
                    <AlertDialogCancel
                        className="px-6 hover:scale-110 active:scale-120"
                        onClick={onCancel}>
                        Cancel</AlertDialogCancel>
                    <Button 
                        className="px-6 hover:scale-110 active:scale-120"
                        onClick={onSubmit}>
                        Confirm</Button>
                </div>
            </AlertDialogFooter>
        </>
    );
}
