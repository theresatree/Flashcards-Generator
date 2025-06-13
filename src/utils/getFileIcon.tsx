import { AiFillFilePdf, AiFillFileWord, AiFillFileImage, AiFillFileUnknown } from 'react-icons/ai';

export function getFileIcon(file: File) {
  const type = file.type;
  if (type === 'application/pdf') 
      return <AiFillFilePdf className="inline-block mr-2 text-red-600" />;
  if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    return <AiFillFileWord className="inline-block mr-2 text-blue-600" />;
  if (type.startsWith('image/')) 
      return <AiFillFileImage className="inline-block mr-2 text-green-600" />;
  return <AiFillFileUnknown className="inline-block mr-2 text-gray-400" />;
}

