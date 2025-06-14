import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import FirstPageUpload from "./pages/FirstPageUpload";
import Dashboard from "./pages/Dashboard";
import { AnimatePresence } from "motion/react";
import { Toaster } from "./components/ui/sonner";

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<FirstPageUpload />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Toaster richColors position="top-center" />
      <AppRoutes />
    </Router>
  );
}

export default App;

