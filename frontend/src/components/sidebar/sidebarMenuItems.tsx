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
import type { Flashcard, FileItem } from "../../models/models";
import { useSidebarState } from "../../utils/SidebarContext";
import { DeleteDialog } from "./confirmDeleteDialog";
import { DeleteFileDialog } from "./deleteFileDialog";
import { Link } from "react-router-dom";
import QRDialog from "./QRDialog";
import RAGDialog from "./RAGDialog";

type Props={
    projectIDs: string[],
    projectFilesMap: Record<string, FileItem[]>
}

export function GetSideBarMenuItems({projectIDs, projectFilesMap}: Props){
    const {setSelectedProjectDetails, setSelectedProjectID, setSelectedFileName} = useSidebarState();
    const [reversedFilenames, setReversedFilenames] = useState<Record<string, string>>({});
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openDeleteFileDialog, setOpenDeleteFileDialog] = useState(false)
    const [flashcardsForQR, setFlashcardsForQR] = useState<Flashcard[]>([])
    const [openQRDialog, setOpenQRDialog] = useState(false)
    const [openRAGDialog, setOpenRAGDialog] = useState(false)
    const MAX_FILE_LENGTH = 15;

    const [currentProjectId, setCurrentProjectId] = useState<string>("")
    const [currentProjectFiles, setCurrentProjectFiles] = useState<FileItem[]>([])

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
                <SidebarMenuButton onClick={() => selectedItems([file], projectID, file.filename)}>
                    {truncateFilename(file.filename, MAX_FILE_LENGTH)}
                </SidebarMenuButton>
            </SidebarMenuSubItem>
        ))
    }

    function selectedItems(file: FileItem[], projectID: string, fileName?:string) {
        const flashcards = file.flatMap(files => files.flashcards);
        setSelectedProjectID(projectID);

        if (!fileName){
            setSelectedProjectDetails({
                [projectID]: flashcards,
            });
            setSelectedFileName("")
        } else {
            setSelectedFileName(fileName);
            setSelectedProjectDetails({
                [fileName]: flashcards,
            });
        }
    }

    function QRCodeHelper(project_id: string) {
        const allFlashcards = projectFilesMap[project_id]?.flatMap(file => file.flashcards) || [];
        setFlashcardsForQR(allFlashcards)
        setCurrentProjectId(project_id)
        setOpenQRDialog(true)
    }


    const handleRAGDialog = (project_id: string) => {
        setCurrentProjectId(project_id)
        setCurrentProjectFiles(projectFilesMap[project_id] || [])
        setOpenRAGDialog(true)
    }

    const handleDeleteDialog = (project_id: string) => {
        setCurrentProjectId(project_id)
        setOpenDeleteDialog(true)
    }

    const handleDeleteFileDialog = (project_id: string) => {
        setCurrentProjectId(project_id)
        setCurrentProjectFiles(projectFilesMap[project_id] || [])
        setOpenDeleteFileDialog(true)
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
                                        selectedItems(projectFilesMap[id] || [], id);
                                    }}
                                >
                                    Test all from this project
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    className="mb-1"                                 
                                    onClick={() => {
                                        handleRAGDialog(id)
                                    }}
                                >
                                    Prompt a question 
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
                                    onClick={()=>handleDeleteFileDialog(id)}
                                    className="mb-1">
                                    Delete File
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={()=>{QRCodeHelper(id)}}>
                                    Share Project
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleDeleteDialog(id)}>
                                    Delete Project 
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </Collapsible>

            {currentProjectId && (
                <>
                    <QRDialog 
                        open={openQRDialog} 
                        onOpenChange={setOpenQRDialog} 
                        project_id={currentProjectId} 
                        files={flashcardsForQR}
                    />

                    <RAGDialog 
                        open={openRAGDialog}
                        onOpenChange={setOpenRAGDialog}
                        project_id={currentProjectId}
                        files={currentProjectFiles}
                    />

                    <DeleteDialog 
                        open={openDeleteDialog} 
                        onOpenChange={setOpenDeleteDialog} 
                        project_id={currentProjectId}
                    />

                    <DeleteFileDialog 
                        open={openDeleteFileDialog}
                        onOpenChange={setOpenDeleteFileDialog}
                        project_id={currentProjectId}
                        files={currentProjectFiles}
                    />
                </>
            )}

        </SidebarMenu>
    ));
}
