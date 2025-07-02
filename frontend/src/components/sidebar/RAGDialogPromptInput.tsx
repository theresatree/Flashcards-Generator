import {
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "../ui/alert-dialog";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

type PromptInputsProps = {
    files: { filename: string }[];
    selectedFile: string;
    onFileChange: (value: string) => void;
    promptText: string;
    onPromptChange: (value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
};

export default function RAGPromptInputs({
    files,
    selectedFile,
    onFileChange,
    promptText,
    onPromptChange,
    onSubmit,
    onCancel,
}: PromptInputsProps) {
    return (
        <>
            <AlertDialogHeader>
                <AlertDialogTitle>Ask a Question</AlertDialogTitle>
                <AlertDialogDescription>
                    Select a file and type your prompt below.
                </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4 px-4">
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

                {/* Prompt Textarea */}
                <Textarea
                    className="w-full"
                    placeholder="Type your prompt here…"
                    value={promptText}
                    onChange={(e) => onPromptChange(e.target.value)}
                    onKeyDownCapture={e => {
                        // Prevent Space, Digits, etc. from bubbling up
                        e.stopPropagation();
                    }}
                    rows={4}
                />
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
                        Prompt</Button>
                </div>
            </AlertDialogFooter>
        </>
    );
}
