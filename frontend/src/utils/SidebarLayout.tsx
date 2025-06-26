import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/sidebar/sidebar";
import { Outlet } from "react-router-dom";
import { SidebarStateContextProvider } from "./SidebarContext";

export function SidebarLayout() {
    return (
        <SidebarStateContextProvider>
            <SidebarProvider>
                <AppSidebar/>
                <main className="w-full h-full">
                    <SidebarTrigger className="mx-2 mt-2 bg-zinc-600 hover:bg-zinc-900 hover:text-white active:scale-110"/>
                    <Outlet />
                </main>
            </SidebarProvider>
        </SidebarStateContextProvider>
    );
}
