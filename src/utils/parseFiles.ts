import * as mammoth from "mammoth";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import JSZip from "jszip";

import type { FileItem } from "../models/models";
import { retrieveAllFilesByProjectID, retrieveAllProjectIDs } from "../db_utils/retrieve_item";
import { getFileType } from "./getFileType";
import { toast } from "sonner";


GlobalWorkerOptions.workerSrc = "/pdf.worker.js";


async function getMostRecentProjectID(): Promise<string>{
    const projectIDs: string[] = await retrieveAllProjectIDs()
    const sorted = Array.from(projectIDs).sort().reverse()
    return sorted[0] 
}

export async function parseMostRecentProject(): Promise<string[]>{
    const projectID:string = await getMostRecentProjectID()
    const files : FileItem[] = await retrieveAllFilesByProjectID(projectID)
    let file_contents: string = ""
    const all_file_contents: string[] = [];

    for (const item of files){
        const file: File = item.file as File // convert blob to File 
        const file_type = getFileType(file)         
        if (file_type == "pdf"){
             file_contents = await parsePDF(file)
        } else if (file_type == "docx"){
            file_contents = await parseDocx(file)
        } else if (file_type == "pptx"){
            file_contents = await parsePPTX(file)
        } else{
            toast.error(`Failed to parse ${file.name}`)
            continue;
        }
        toast.success(`Successfully parsed ${file.name}`)
        all_file_contents.push(file_contents)
    }

    return all_file_contents
}


// --- DOCX ---
async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// --- PDF ---
async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
 const pdf = await getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => ('str' in item ? item.str : '')).join(" ");
    text += pageText + "\n";
  }
  return text;
}

// --- PPTX ---
async function parsePPTX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const slides = [];
  const slideFiles = Object.keys(zip.files).filter(name =>
    name.startsWith("ppt/slides/slide")
  );
  for (const slideName of slideFiles) {
    const xmlContent = await zip.files[slideName].async("string");
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
    const texts = xmlDoc.getElementsByTagName("a:t");
    for (const t of texts) {
      slides.push(t.textContent);
    }
  }
  return slides.join("\n");
}
