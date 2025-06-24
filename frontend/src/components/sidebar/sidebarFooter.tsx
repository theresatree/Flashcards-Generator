import {
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../../components/ui/sidebar"
import { Settings } from "lucide-react";
import { DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "../../components/ui/dropdown-menu";

import { APIDialog } from "./setAPIDialog"; 
import { UploadDialog } from "./confirmRedirectDialog";
import { useState } from "react";


export function CustomSidebarFooter(){
    const [openAPISettings, setOpenAPISettings] = useState(false);
    const [openUploadSettings, setOpenUploadSettings] = useState(false);

    return(
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton>
                                <span>Settings</span>
                                <Settings className="ml-auto"/>
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="top"
                            className="w-[--radix-popper-anchor-width] dark"
                        >
                            <DropdownMenuItem className="mb-1" onClick={()=> setOpenUploadSettings(true)}>
                                <span>Add New Project</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={()=> setOpenAPISettings(true)}>
                                <span>Set API Keys</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>


            {/*This is for the API Keys*/}
            <APIDialog open={openAPISettings} onOpenChange={setOpenAPISettings} />
            <UploadDialog open={openUploadSettings} onOpenChange={setOpenUploadSettings} />
        </SidebarFooter>
    );
}
