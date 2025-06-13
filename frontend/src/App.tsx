import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstPageUpload from "./pages/FirstPageUpload"; 
import Dashboard from "./pages/Dashboard";
import { Toaster } from "./components/ui/sonner";

function App() {
    return (
        <Router>
            <Toaster richColors position="top-center" />
            <Routes>
                <Route path="/" element={<FirstPageUpload />} />
                <Route path="/Dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
