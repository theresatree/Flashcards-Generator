import { useState, useEffect } from "react";
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
import { DeleteDialog } from "./confirmDeleteDialog";
import { DeleteFileDialog } from "./deleteFileDialog";
import { Link } from "react-router-dom";

type Props={
    projectIDs: string[],
    projectFilesMap: Record<string, FileItem[]>
}

export function GetSideBarMenuItems({projectIDs, projectFilesMap}: Props){
    const {setSelectedProjectDetails, setSelectedProjectID} = useSidebarState();
    const [reversedFilenames, setReversedFilenames] = useState<Record<string, string>>({});
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openDeleteFileDialog, setOpenDeleteFileDialog] = useState(false)
    const MAX_FILE_LENGTH = 15;

    useEffect(() => {
        const newReversedFilenames: Record<string, string> = {};
        projectIDs.forEach(id => {
            newReversedFilenames[id] = `${reverseProjectIDDate(id)} - ${reverseProjectIDTime(id)}`;
        });
        setReversedFilenames(newReversedFilenames);
    }, [projectIDs]);

    function getProjectFilesInJSX(projectID: string){
        return (projectFilesMap[projectID] || []).map((file) => (
            <SidebarMenuSubItem key={file.filename} className="text-sm italic text-stone-400">
                <SidebarMenuButton onClick={() => selectedItems(file.filename, [file])}>
                    {truncateFilename(file.filename, MAX_FILE_LENGTH)}
                </SidebarMenuButton>
            </SidebarMenuSubItem>
        ))
    }

    function selectedItems(projectID: string, file: FileItem[]) {
        const flashcards = file.flatMap(files => files.flashcards);
        setSelectedProjectID(projectID);
        setSelectedProjectDetails({
            [projectID]: flashcards,
        });
    }

    return projectIDs.map((id) => (
        <SidebarMenu key={id}>
            <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild>
                            <button className="justify-between flex p-3 my-1 w-full text-left">
                                <div>{reversedFilenames[id] || 'Loading...'}</div>
                            </button>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {getProjectFilesInJSX(id)}
                        </SidebarMenuSub>
                    </CollapsibleContent>

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
                                <DropdownMenuItem 
                                    className="mb-1"                                 
                                    onClick={() => {
                                        selectedItems(id, projectFilesMap[id] || []);
                                    }}
                                >
                                    Test all from this project
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className=""/>
                                <DropdownMenuItem 
                                    className="mb-1">
                                    <Link 
                                        className="w-full"
                                        to="/edit" 
                                        state={{ project_id: id, projectFiles: projectFilesMap[id] }}
                                    >
                                        Edit flashcards
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    className="mb-1">
                                    <Link 
                                        className="w-full"
                                        to={`/upload/${id}`}>Add file</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={()=>setOpenDeleteFileDialog(true)}
                                    className="mb-1">
                                    Delete File
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {setOpenDeleteDialog(true)}}>
                                    Delete Project 
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </Collapsible>

            {/*This is for the Dialog to delete.*/}
            <DeleteDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog} project_id={id}/>
            <DeleteFileDialog 
                open={openDeleteFileDialog}
                onOpenChange={setOpenDeleteFileDialog}
                project_id={id}
                files={projectFilesMap[id] || []}/>
        </SidebarMenu>
    ));
}
