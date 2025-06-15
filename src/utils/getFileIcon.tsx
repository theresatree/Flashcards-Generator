import {
  AiFillFilePdf,
  AiFillFileWord,
  AiFillFileImage,
  AiFillFileUnknown,
  AiFillFilePpt,
} from "react-icons/ai";

export function getFileIcon(file: File) {
  const type = file.type;

  if (type === "application/pdf")
    return <AiFillFilePdf className="inline-block mr-2 text-red-600" />;

  if (
    type === "application/msword" ||
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return <AiFillFileWord className="inline-block mr-2 text-blue-600" />;

  if (
    type === "application/vnd.ms-powerpoint" ||
    type === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  )
    return <AiFillFilePpt className="inline-block mr-2 text-orange-600" />;

  if (type.startsWith("image/"))
    return <AiFillFileImage className="inline-block mr-2 text-green-600" />;

  return <AiFillFileUnknown className="inline-block mr-2 text-gray-400" />;
}

