
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import FirstPageUpload from "./pages/FirstPageUpload";
import ConfirmFlashCards from "./pages/ConfirmFlashCards";
import Dashboard from "./pages/Dashboard";  
import { Toaster } from "./components/ui/sonner";
import { SidebarLayout } from "./utils/SidebarLayout";

//Routes + AnimatePresence
function AppRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <div className="fixed inset-0 bg-[#303030]">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<FirstPageUpload />} />
                    <Route path="/confirmation" element={<ConfirmFlashCards />} />
                    <Route element ={<SidebarLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
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

