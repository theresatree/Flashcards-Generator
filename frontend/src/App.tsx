import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';

GlobalWorkerOptions.workerSrc = '/pdf.worker.js';


import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import FirstPageUpload from "./pages/FirstPageUpload";
import ConfirmFlashCards from "./pages/ConfirmFlashCards";
import Dashboard from "./pages/Dashboard";  
import EditFlashCardsInProjects from "./components/sidebar/editFlashCardInProjects.tsx";
import { Toaster } from "./components/ui/sonner";
import { SidebarLayout } from "./utils/SidebarLayout";
import SharedPage from "./pages/SharedProject/index.tsx";

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
                    <Route path="/shared" element={<SharedPage />} />
                </Routes>
            </div>
        </AnimatePresence>
    );
}

//Top-level App with Router & Toaster
function App() {
    return (
        <Router >
            <Toaster richColors position="top-center" />
            <AppRoutes />
        </Router>
    );
}

export default App;

