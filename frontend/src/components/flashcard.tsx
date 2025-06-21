import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { MarkdownRenderer } from "./markdownComponents";

interface flashcardParams{
    questions: string,
    answers: string,
}

function Flashcard(details: flashcardParams) {
    return (
        <Card className="bg-[#383838] border border-[#555] shadow-lg rounded-xl text-[#f5f5f5] max-w-[800px] w-full break-words mt-5">
            <CardHeader className="mb-1 pb-0 space-y-0">
                <CardTitle className="text-sm italic font-semibold m-0 mb-2 p-0">
                    <MarkdownRenderer content={details.questions} />
                </CardTitle>
                <CardContent className="overflow-auto text-sm text-[#ddd] pt-0">
                    <MarkdownRenderer content={details.answers} />
                </CardContent>
            </CardHeader>

        </Card>
    );
}

export default Flashcard;
