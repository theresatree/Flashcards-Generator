import {
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "../ui/alert-dialog";
import { Loader } from "lucide-react";  
import { useState, useEffect } from "react";
import { PromptRAG } from "./PromptRAG";
import { MarkdownRenderer } from "../markdownComponents";

type Props = {
    promptText:string
    selectedFileName:string
    project_id:string
    onCancel: () => void;
};

export default function RAGDialogOutput({ onCancel, promptText, selectedFileName, project_id }: Props) {
    const[isLoading, setIsLoading]= useState(true)
    const[output, setOutput] = useState("")

    useEffect(()=>{
            setIsLoading(true)

        async function getOutputViaRAG(){
            const data = await PromptRAG({project_id, selectedFileName, promptText}) 
            if (data){
                setIsLoading(false)
                setOutput(data)
            }
        }

        getOutputViaRAG()
    },[promptText,selectedFileName,project_id])

return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {isLoading ? "Generating Answer" : "Output"}
        </AlertDialogTitle>
        <AlertDialogDescription />
      </AlertDialogHeader>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <div className="p-2 overflow-y-auto overflow-x-hidden  break-words max-h-[50vh]">
          <MarkdownRenderer content={output} />
        </div>
      )}

      <AlertDialogFooter>
        <div className="ml-auto px-4 mt-3">
          <AlertDialogCancel onClick={onCancel}>
            Return
          </AlertDialogCancel>
        </div>
      </AlertDialogFooter>
    </>
  );
}
