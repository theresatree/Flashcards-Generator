import {
    AiFillFilePdf,
    AiFillFileWord,
    AiFillFileUnknown,
    AiFillFilePpt,
} from "react-icons/ai";
import { getFileType } from "./getFileType";

export function getFileIcon(file: File) {
    const file_type = getFileType(file)

    if (file_type == "pdf")
        return <AiFillFilePdf className="inline-block mr-2 text-red-600" />;

    if (file_type == "docx")
        return <AiFillFileWord className="inline-block mr-2 text-blue-600" />;

    if (file_type == "pptx")
        return <AiFillFilePpt className="inline-block mr-2 text-orange-600" />;

    return <AiFillFileUnknown className="inline-block mr-2 text-gray-400" />;
}

