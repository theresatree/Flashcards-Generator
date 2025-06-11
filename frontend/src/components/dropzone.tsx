import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiFillFilePdf, AiFillFileWord, AiFillFileImage, AiFillFileUnknown } from 'react-icons/ai';
import { ImCross } from "react-icons/im";


const MAX_FILE_NAME_LENGTH = 30;
const MAX_FILE_SIZE = 20;

//////////////////////////////////////////////////////

function getFileIcon(file: File) {
  const type = file.type;
  if (type === 'application/pdf') 
      return <AiFillFilePdf className="inline-block mr-2 text-red-600" />;
  if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    return <AiFillFileWord className="inline-block mr-2 text-blue-600" />;
  if (type.startsWith('image/')) 
      return <AiFillFileImage className="inline-block mr-2 text-green-600" />;
  return <AiFillFileUnknown className="inline-block mr-2 text-gray-400" />;
}

function truncateFilename(name: string, maxLength: number = MAX_FILE_NAME_LENGTH) {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength) + '...';
}
/////////////////////////////////////////////////////
function Dropzone() {
    const [allFiles, setAllFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setAllFiles(prev => [...prev, ...acceptedFiles]);

        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                console.log(`File read successfully: ${file.name}`);
            };
            reader.readAsArrayBuffer(file);
        });
    }, []);

    const processFiles = () => {
        allFiles.forEach((file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', file.name);
            formData.append('file_size', file.size.toString());

          fetch('http://localhost:8000/api/upload', {
            method: 'POST',
            body: formData,
          })
            .then(res => res.json())
            .then(data => console.log('Uploaded:', data))
            .catch(err => console.error('Upload error:', err));
        });
    };

    const removeFileItem = (index: number) => {
        setAllFiles((previousFiles) => {
            const newFiles = [...previousFiles];
            newFiles.splice(index, 1);
            return newFiles
        })
    }

    const {
        fileRejections,
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'application/pdf': [],
            'application/msword': [], // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [], // .docx
            'application/vnd.ms-powerpoint': [], // .ppt
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': [], // .pptx
        },
        maxSize: MAX_FILE_SIZE * 1024 * 1024,
    });


    const files = allFiles.map((file, i) => (
      <li key={`${file.name}-${i}`} className="flex justify-between items-center pr-8 pl-5">
        <div className="flex items-center">
            <button className="mr-3 group"
                    onClick={() => removeFileItem(i)}>
              <ImCross className="w-: h-2 group-hover:text-red-500 group-hover:scale-150 transition-all ease-in-out"/>
            </button>
          {getFileIcon(file)}
          <span>{truncateFilename(file.name)}</span>
        </div>
        <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
      </li>
    ));


    const rejected = fileRejections.map(({ file }, index) => (
     <li key={`${file.name}-${index}`} className="flex justify-between items-center pr-8 pl-5">
        <div className="flex items-center">
            <button className="mr-3 group"
                onClick={() => removeFileItem(index)}>
              <ImCross className="w-: h-2 group-hover:text-red-500 group-hover:scale-150 transition-all ease-in-out"/>
            </button>
          {getFileIcon(file)}
          <span>{truncateFilename(file.name)}</span>
        </div>
        <span><strong>{(file.size / (1024 * 1024)).toFixed(2)} MB</strong></span>
      </li>
    ));

    return (
        <section className="container">
        <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md px-6 py-10 mt-1 transition-colors duration-200
            ${isDragActive ? 'bg-blue-50 border-blue-400' : 'bg-gray-100 border-gray-300'}
            text-gray-600 text-sm`}
            >
            <input {...getInputProps()} />
            <p>Click or drop files here</p>
            <p className="mt-5">Max: {MAX_FILE_SIZE}MB per file</p>
            </div>

            <aside>
            {allFiles.length > 0 && (
                <>
                <button
                    type = "button"
                    onClick = {processFiles}
                    className = "border-2 mt-5 mb-5 px-6 rounded-xl py-2 bg-blue-400 text-white \
                    hover:bg-blue-500 hover:scale-110 transition-all ease-in-out">
                   Process Files 
                </button>
                <ul className="text-sm text-gray-700 list-disc list-inside">{files}</ul>
                </>
            )}

            {fileRejections.length > 0 && (
                <>
                <h4 className="font-semibold mt-4 mb-2 text-red-600">Rejected Files</h4>
                <ul className="text-sm list-disc list-inside">{rejected}</ul>
                </>
            )}
            </aside>
            </section>
    );
}

export default Dropzone;
