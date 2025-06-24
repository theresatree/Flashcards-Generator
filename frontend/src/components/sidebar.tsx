import { useEffect, useState } from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
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
} from "../components/ui/sidebar"
import { reverseProjectIDTime, reverseProjectIDDate } from "../utils/reverseProjectID";
import { retrieveAllProjectIDs, } from "../db_utils/retrieve_item";  
import { CollapsibleContent, CollapsibleTrigger, Collapsible } from "../components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel } from "../components/ui/dropdown-menu";


export function AppSidebar() {
    const[projectIDs, setProjectIDs] = useState<string[]>([])


    useEffect(() => {
        async function getAllInformation(){
            const listOfProjectIDs = await retrieveAllProjectIDs();
            if (listOfProjectIDs)(
                setProjectIDs(listOfProjectIDs)
            )

        }
        getAllInformation()
    },[])

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
                                <SidebarMenuSubItem>
                                    <SidebarMenuButton>
                                        Hello
                                    </SidebarMenuButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuButton>
                                        Gay
                                    </SidebarMenuButton>
                                </SidebarMenuSubItem>
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
                                    <DropdownMenuItem>
                                        Edit flashcards
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
                        <SidebarGroupLabel className="text-[#FEEEEE]">List of Projects</SidebarGroupLabel>
                        <hr className="bg-[#303030] mx-2 mb-3"/>
                        <SidebarGroupContent>
                            {getSideBarMenuItems()}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter />
            </Sidebar>
        </div>
    )
}
