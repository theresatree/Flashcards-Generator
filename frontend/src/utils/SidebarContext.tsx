import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Flashcard } from "../models/models";

type SidebarStateContextType = {
    selectedProjectID: string;
    setSelectedProjectID: (projectID:string) => void;
    selectedProjectDetails: Record<string,Flashcard[]>;
    setSelectedProjectDetails: (details: Record<string, Flashcard[]>) => void;
};

const SidebarStateContext = createContext<SidebarStateContextType | undefined>(undefined);

export function SidebarStateContextProvider({ children }: { children: ReactNode }) {
    const [selectedProjectID, setSelectedProjectID] = useState("")
    const [selectedProjectDetails, setSelectedProjectDetails] = useState<Record<string, Flashcard[]>>({});

    return (
        <SidebarStateContext.Provider value={{ selectedProjectID, setSelectedProjectID, selectedProjectDetails, setSelectedProjectDetails}}>
            {children}
        </SidebarStateContext.Provider>
    );
}

export function useSidebarState() {
    const ctx = useContext(SidebarStateContext);
    if (!ctx) throw new Error("useSidebarState must be used within SidebarStateProvider");
    return ctx;
}

