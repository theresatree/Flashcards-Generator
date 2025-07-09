import { StackedFlashCard } from "../stackedCards";
import type { Flashcard } from "../../models/models";

type Props = {
    flashcards: Flashcard[];
    projectID: string;
    filename: string;
};

export default function RenderFileFlashcardStack({ flashcards, projectID, filename }: Props) {
    return (
        <div className="ml-auto w-[850px] mb-8">
            <h3 className="text-lg font-semibold mb-2 text-[#FEEEEE]">
                {filename}
            </h3>
            <div className="relative w-full">
                {flashcards.map((fc, j) => (
                    <StackedFlashCard
                        key={j}
                        project_id={projectID}
                        filename={filename}
                        question={fc.question}
                        answer={fc.answer}
                        index={j}
                        isExpanded={true} // expanded by default
                        toggleStack={() => {}} // no-op since always expanded
                    />
                ))}
            </div>
        </div>
    );
}
