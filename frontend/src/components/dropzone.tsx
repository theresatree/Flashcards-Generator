import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { FileItem } from '../models/models';
import { addItemWithKey } from '../db_utils/add_item';
import { getFileIcon } from '../utils/getFileIcon';
import { truncateFilename } from '../utils/truncateString';
import { generateProjectId } from '../utils/generateProjectID';

const MAX_FILE_NAME_LENGTH = 30;
const MAX_FILE_SIZE = 40;

/////////////////////////////////////////////////////

function Dropzone() {
    const navigate = useNavigate();
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


    const processFiles = async () => {
        const projectID = generateProjectId() 
        try {
            const results = await Promise.all(
                allFiles.map(async (file) => {
                    const item: FileItem = {
                        project_id: projectID,
                        filename: file.name,
                        file_size: file.size,
                        file: file,
                        flashcards: [],
                        chunks: [],
                        embeddings: [],
                    };

                    await addItemWithKey(item);
                    return { success: true };

                })
            );

            const allSuccessful = results.every(result => result.success);

            if (allSuccessful) {
                navigate("/confirmation");
                toast.success("Files successfully uploaded");

            } else {
                toast.error("Some files failed to upload");
            }
        } catch (error) {
            toast.error("An error occurred during file upload");
            console.error(error);
        }
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
            'application/pdf': [],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [], // .docx
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
                <span>{truncateFilename(file.name, MAX_FILE_NAME_LENGTH)}</span>
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
                <span>{truncateFilename(file.name, MAX_FILE_NAME_LENGTH)}</span>
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
