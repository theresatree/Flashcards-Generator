import {
    Card,
    CardContent,
    CardHeader,
} from "../../components/ui/card";
import { MarkdownRenderer } from "../markdownComponents";

type Props={
    text:string
}

export function DashboardFlashcard({text}: Props) {
    return (
        <Card className="bg-[#383838] border border-[#555] shadow-lg rounded-xl text-[#f5f5f5] max-w-[800px] w-full break-words mt-5">
            <CardHeader className="mb-1 pb-0 space-y-0">
                <CardContent className="overflow-auto text-sm text-[#ddd] pt-0">
                    <MarkdownRenderer content={text} />
                </CardContent>
            </CardHeader>

        </Card>
    );
}

export default DashboardFlashcard;
