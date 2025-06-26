import { useEffect, useState } from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarGroupLabel,
} from "../../components/ui/sidebar"
import { retrieveAllProjectIDs, retrieveAllFilesByProjectID } from "../../db_utils/retrieve_item";  
import type { FileItem } from "../../models/models";
import { GetSideBarMenuItems } from "./sidebarMenuItems";

import { CustomSidebarFooter } from "./sidebarFooter";


export function AppSidebar() {
    const[projectIDs, setProjectIDs] = useState<string[]>([])
    const [projectFilesMap, setProjectFilesMap] = useState<Record<string, FileItem[]>>({});


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


    return (
        <div className="dark">
            <Sidebar defaultChecked={true} className="border-none">
                <SidebarHeader/>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className="mx-auto text-md text-[#FEEEEE]">List of Projects</SidebarGroupLabel>
                        <hr className="bg-[#303030] mx-2 mt-1 mb-1"/>
                        <SidebarGroupContent>
                            <GetSideBarMenuItems projectIDs={projectIDs} projectFilesMap={projectFilesMap}/>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <CustomSidebarFooter />
            </Sidebar>
        </div>
    )
}
