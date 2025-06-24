import { useEffect, useState } from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarGroupLabel,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuAction,
} from "../../components/ui/sidebar"
import { reverseProjectIDTime, reverseProjectIDDate } from "../../utils/reverseProjectID";
import { retrieveAllProjectIDs, retrieveAllFilesByProjectID } from "../../db_utils/retrieve_item";  
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
import type { FileItem } from "../../models/models";
import { truncateFilename } from "../../utils/truncateString";

import { CustomSidebarFooter } from "./sidebarFooter";


export function AppSidebar() {
    const[projectIDs, setProjectIDs] = useState<string[]>([])
    const [projectFilesMap, setProjectFilesMap] = useState<Record<string, FileItem[]>>({});
    const MAX_FILE_LENGTH = 20


      useEffect(() => {
        async function getAllInformation() {
          const listOfProjectIDs = await retrieveAllProjectIDs();
          if (listOfProjectIDs) {
            const sortedDescending = listOfProjectIDs.sort((a, b) => Number(b) - Number(a));
            setProjectIDs(sortedDescending);

            // Also fetch files for each project:
            const filesMap: Record<string, FileItem[]> = {};
            for (const id of sortedDescending) {
              const files = await retrieveAllFilesByProjectID(id);
              filesMap[id] = files;
            }
            setProjectFilesMap(filesMap);
          }
        }
        getAllInformation();
      }, []);


    async function getProjectFiles(projectID:string){
        return (projectFilesMap[projectID] || []).map((file) => (
            <SidebarMenuSubItem key={file.filename} className="text-sm italics text-stone-400">
                <SidebarMenuButton>
                    {truncateFilename(file.filename,MAX_FILE_LENGTH)}
                </SidebarMenuButton>
            </SidebarMenuSubItem>
        ))
    };


    function getSideBarMenuItems(){
        return projectIDs.map((id)=>(
            <SidebarMenu>
                <Collapsible className="group/collapsible">
                    <SidebarMenuItem key={id}>
                        <CollapsibleTrigger asChild>

                            {/* Contents of the title.*/}
                            <SidebarMenuButton asChild>
                                <button className="justify-between flex p-3 my-1">
                                    <div>{reverseProjectIDDate(id)} - {reverseProjectIDTime(id)}</div>
                                </button>
                            </SidebarMenuButton>
                        </CollapsibleTrigger>

                        {/* Contents of the collapsible*/}
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {getProjectFiles(id)}
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



    return (
        <div className="dark">
            <Sidebar defaultChecked={true} className="border-none">
                <SidebarHeader/>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className="mx-auto text-md text-[#FEEEEE]">List of Projects</SidebarGroupLabel>
                        <hr className="bg-[#303030] mx-2 mt-1 mb-1"/>
                        <SidebarGroupContent>
                            {getSideBarMenuItems()}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <CustomSidebarFooter />
            </Sidebar>
        </div>
    )
}
