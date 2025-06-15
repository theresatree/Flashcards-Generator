export function getFileType(file: File) {
  const type = file.type;

  if (
    type === "application/msword" ||
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "docx";
  }

  if (type === "application/pdf") {
    return "pdf";
  }

  if( 
        type === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
    return "pptx";
  }

  return "unknown";
}
