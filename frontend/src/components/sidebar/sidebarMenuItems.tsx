import { useState } from "react";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuAction,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "../../components/ui/sidebar"
import { reverseProjectIDTime, reverseProjectIDDate } from "../../utils/reverseProjectID";
import { CollapsibleContent, CollapsibleTrigger, Collapsible } from "../../components/ui/collapsible";
import { DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel
} from "../../components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { truncateFilename } from "../../utils/truncateString";

import type { FileItem } from "../../models/models";
import { useSidebarState } from "../../utils/SidebarContext";


type Props={
    projectIDs: string[],
    projectFilesMap: Record<string, FileItem[]>
}


export function GetSideBarMenuItems({projectIDs, projectFilesMap}: Props){
    const { setSelectedProjectDetails, setSelectedProjectID} = useSidebarState();
    const [reversedFilename, setReversedFilename] = useState("")
    const MAX_FILE_LENGTH = 20

    function getProjectFilesInJSX(projectID:string){
        return (projectFilesMap[projectID] || []).map((file) => (
            <SidebarMenuSubItem key={file.filename} className="text-sm italics text-stone-400">
                <SidebarMenuButton onClick={()=>selectedItems(file.filename, [file])}>
                    {truncateFilename(file.filename,MAX_FILE_LENGTH)}
                </SidebarMenuButton>
            </SidebarMenuSubItem>
        ))

    };


    function selectedItems(projectID: string, file: FileItem[]) {
        const flashcards = file.flatMap(files => files.flashcards)

        setSelectedProjectID(projectID)
        setSelectedProjectDetails({
            [projectID]: flashcards,
        });
    }
    
    function reverseName(projectID:string){
        setReversedFilename(`${reverseProjectIDDate(projectID)} - ${reverseProjectIDTime(projectID)}`)
    }

    return projectIDs.map((id)=>(
        <SidebarMenu>
            <Collapsible className="group/collapsible">
                <SidebarMenuItem key={id}>
                    <CollapsibleTrigger asChild>

                        {/* Contents of the title.*/}
                        <SidebarMenuButton asChild>
                            <button 
                                className="justify-between flex p-3 my-1"
                                onClick={()=>reverseName(id)}
                            >
                                <div>{reversedFilename}</div>
                            </button>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {/* Contents of the collapsible*/}
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {getProjectFilesInJSX(id)}
                        </SidebarMenuSub>
                    </CollapsibleContent>

                    {/* This is for dropdownMenu*/}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuAction>
                                <MoreHorizontal />
                            </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start" className="w-50 dark">
                            <DropdownMenuLabel className="text-stone-400">
                                Functions Available
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="mb-1"                                 
                                    onClick={() => {
                                        selectedItems(reversedFilename, projectFilesMap[id]);
                                    }}>
                                    Test all from this project
                                </DropdownMenuItem>
                                <DropdownMenuItem className="mb-1">
                                    Add files
                                </DropdownMenuItem>
                                <DropdownMenuItem className="mb-1">
                                    Edit flashcards
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Delete Project 
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>


                </SidebarMenuItem>
            </Collapsible>
        </SidebarMenu>
    ));

}


