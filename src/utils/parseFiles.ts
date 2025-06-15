import type { FileItem } from "../models/models";
import { retrieveAllFilesByProjectID, retrieveAllProjectIDs } from "../db_utils/retrieve_item";

async function getMostRecentProjectID(): Promise<string>{
    const projectIDs: string[] = await retrieveAllProjectIDs()
    const sorted = Array.from(projectIDs).sort().reverse()
    return sorted[0] 
}

export async function parseMostRecentProject(){
    const projectID:string = await getMostRecentProjectID()
    const files : FileItem[] = await retrieveAllFilesByProjectID(projectID)
    return files
}
