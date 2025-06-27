import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "../components/ui/drawer";
import { Button } from "./ui/button";
import { Clipboard } from 'lucide-react';
import { useState, useEffect } from "react";
import { toast } from "sonner";

const instructionMarkdown = 
`You are a helpful assistant.

Your task is to generate exactly [flashcardLimit] high-quality question-and-answer pairs based on the provided text.

**Formatting Rules:**
- Each question should be clearly labeled: **Q1**, **Q2**, etc.
- Each answer should follow immediately, labeled **A1**, **A2**, etc.
- Insert a **blank line** between each Q&A pair.
- Use **line breaks** and **indentation** to make the output human-readable.
- For inline math, use: $...$
- For block math, use: $$...$$
- For code snippets, wrap them in triple backticks with the language.
\`\`\`python
print("Hello World")
\`\`\`
Format your output exactly as:

Q1: …
A1: …

Q2: …
A2: …
`;

type DrawerShowProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DrawerShow({ open, onOpenChange }: DrawerShowProps) {

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(instructionMarkdown);
        setCopied(true);
    };

    useEffect(() => {
        if (copied) {
            toast.success("Successfully copied");
            setCopied(false);
        }
    }, [copied]);

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="bg-[#404040] text-gray-100">
                <DrawerHeader>
                    <DrawerTitle className="text-lg font-semibold text-[#FEEEEE]">
                        Copy this instruction, along with your documents to your LLM
                    </DrawerTitle>
                    <span className="font-semibold text-red-400 underline decoration-red-500  mb-[10px]">
                        Default: 10 flashcards
                    </span>
                    <DrawerDescription>
                        <pre className="relative mx-auto whitespace-pre-wrap text-left w-full p-2 rounded bg-zinc-800 text-gray-200 font-mono text-sm max-w-[800px]">
                            {instructionMarkdown}
                            <Button 
                                size="icon"
                                className="absolute top-2 right-2 px-2 py-1 rounded bg-zinc-700 text-gray-100 hover:bg-zinc-600 active:scale-110"
                                onClick={handleCopy}>
                                <Clipboard />
                            </Button>
                        </pre>
                    </DrawerDescription>

                </DrawerHeader>
                <DrawerFooter className="flex flex-row max-w-[800px] w-full mx-auto justify-between mb-[5px] pt-2">
                    <DrawerClose asChild>
                        <button className="px-4 py-2 rounded-md bg-zinc-600 text-gray-100 hover:text-black hover:font-semibold hover:bg-red-500 hover:scale-110 transition ease-in-out active:scale-120">
                            Close
                        </button>
                    </DrawerClose>
                    <button className="px-4 py-2 rounded-md bg-zinc-600 text-gray-100 hover:text-black hover:font-semibold hover:bg-green-500 hover:scale-110 transition ease-in-out active:scale-120">
                        Ready to proceed?
                    </button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

