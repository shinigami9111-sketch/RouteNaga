import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { RouteFinder } from "./components/RouteFinder";
import { TouristMode } from "./components/TouristMode";
import { LiveTracking } from "./components/LiveTracking";
import { EmergencySupport } from "./components/EmergencySupport";
import { Dashboard } from "./components/Dashboard";
import { Registration } from "./components/Registration";
import { GlobalAIChat } from "./components/GlobalAIChat";
import { AIAssistant } from "./components/AIAssistant";
import { Booking } from "./components/Booking";
import { Footer } from "./components/Footer";

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage, default to light if not set
    const savedTheme = localStorage.getItem("theme");
    // Explicitly check for 'dark' value, otherwise stay false (light)
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
      // Ensure we don't accidentally have a stale 'dark' class on mount
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-amber-500/30 selection:text-amber-900 overflow-x-hidden relative font-sans transition-colors duration-500">
        <Navbar 
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/routes" element={<RouteFinder />} />
            <Route path="/tracking" element={<LiveTracking isDarkMode={isDarkMode} />} />
            <Route path="/tourist" element={<TouristMode />} />
            <Route path="/safety" element={<EmergencySupport />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/ai" element={<AIAssistant />} />
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
