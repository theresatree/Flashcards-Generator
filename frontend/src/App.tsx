
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import FirstPageUpload from "./pages/FirstPageUpload";
import ConfirmFlashCards from "./pages/ConfirmFlashCards";
import Dashboard from "./pages/Dashboard";  
import EditFlashCardsInProjects from "./components/sidebar/editFlashCardInProjects.tsx";
import { Toaster } from "./components/ui/sonner";
import { SidebarLayout } from "./utils/SidebarLayout";

//Routes + AnimatePresence
function AppRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <div className="fixed inset-0 bg-[#303030]">
                <Routes location={location} key={location.pathname}>
                    <Route element ={<SidebarLayout />}>
                        <Route path="/" element={<Dashboard />} />
                    </Route>
                    <Route path="/upload/:projectID?" element={<FirstPageUpload />} />
                    <Route path="/confirmation" element={<ConfirmFlashCards />} />
                    <Route path="/edit" element={<EditFlashCardsInProjects />} />
                </Routes>
            </div>
        </AnimatePresence>
    );
}

//Top-level App with Router & Toaster
function App() {
    return (
        <Router>
            <Toaster richColors position="top-center" />
            <AppRoutes />
        </Router>
    );
}

export default App;

