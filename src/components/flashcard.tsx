import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

function Flashcard() {
  return (
    <Card className="bg-[#383838] border border-[#555] shadow-lg rounded-xl text-[#f5f5f5] min-w-[450px] max-w-[600px] w-full break-words mt-5">
      <CardHeader className="mb-1 pb-0 space-y-0">
        <CardTitle className="text-sm italic font-semibold m-0 p-0">
          Questions
        </CardTitle>
                <CardContent className="text-sm text-[#ddd] pt-0">
        Answers:
      </CardContent>
      </CardHeader>

    </Card>
  );
}

export default Flashcard;
