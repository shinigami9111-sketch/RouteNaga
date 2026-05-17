import { Map, Shield, User, Menu, X, ArrowRight, Sparkles, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Moon, Sun, Info, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval } from "date-fns";
import { supabase } from "../lib/supabase";
import logoRN from "../logoRN.png";

interface NavbarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

function MiniCalendar({ onClose }: { onClose: () => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <motion.div
      ref={calendarRef}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full mt-4 right-0 w-80 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-stone-200 dark:border-stone-800 rounded-[2rem] shadow-2xl p-6 z-[100] overflow-hidden"
    >
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/5 blur-[60px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-amber-600">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors text-stone-400 dark:text-stone-500 hover:text-amber-600"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors text-stone-400 dark:text-stone-500 hover:text-amber-600"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={`${day}-${idx}`} className="text-center text-[10px] font-bold text-stone-400 uppercase">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => (
            <div 
              key={idx}
              className={`
                aspect-square flex items-center justify-center text-xs rounded-xl transition-all relative group
                ${!isSameMonth(day, monthStart) ? 'text-stone-300 dark:text-stone-700' : 'text-stone-600 dark:text-stone-400'}
                ${isSameDay(day, new Date()) ? 'bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/20' : 'hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-amber-600'}
              `}
            >
              {format(day, 'd')}
              {isSameDay(day, new Date()) && (
                <motion.div 
                  layoutId="today-indicator"
                  className="absolute -bottom-1 w-1 h-1 bg-neutral-950 rounded-full"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Schedule</span>
            <span className="text-[10px] text-stone-600 dark:text-stone-400 mt-1">No trips planned</span>
          </div>
          <button className="text-[10px] font-bold text-amber-600 hover:underline">View All</button>
        </div>
      </div>
    </motion.div>
  );
}

export function Navbar({ isDarkMode, onToggleTheme }: NavbarProps) {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAIClick = () => {
    // Navigate handled by Link
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Routes", href: "/routes" },
    { name: "Tourist", href: "/tourist" },
    { name: "Tracking", href: "/tracking" },
    { name: "Safety", href: "/safety" },
    { name: "Partner", href: "/register" },
    { name: "Booking", href: "/booking" },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-[60] transition-all duration-300 ${
      isScrolled ? "bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 h-16" : "bg-transparent h-20"
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-full flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer shrink-0">
          <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <img src={logoRN} alt="RouteNaga Logo" className="w-full h-full object-contain relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight leading-none text-stone-900 dark:text-stone-100 transition-colors">RouteNaga</span>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-600 mt-1">Smart Travel</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1 p-1.5 bg-stone-50/50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`relative px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 z-10 ${
                  isActive ? "text-neutral-950 dark:text-neutral-50" : "text-stone-400 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/30 dark:shadow-amber-500/10 z-[-1]"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-6 relative shrink-0">
           {/* Date & Time Display (Clickable) */}
           <div className="relative border-r border-stone-200 dark:border-stone-800 pr-6">
             <button 
               onClick={() => setIsCalendarOpen(!isCalendarOpen)}
               className="flex flex-col items-end mr-2 group cursor-pointer"
             >
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 group-hover:text-amber-500 transition-colors">
                   {format(currentTime, 'EEE, MMM d')}
                 </span>
                 <CalendarIcon size={12} className="text-stone-400 dark:text-stone-500 group-hover:text-amber-600 transition-colors" />
               </div>
               <span className="text-[9px] font-bold text-stone-500 dark:text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors tracking-widest mt-0.5">
                 {format(currentTime, 'HH:mm')}
               </span>
             </button>

             <AnimatePresence>
               {isCalendarOpen && (
                 <MiniCalendar onClose={() => setIsCalendarOpen(false)} />
               )}
             </AnimatePresence>
           </div>

           <div className="relative">
             <Link 
               to="/ai"
               onClick={handleAIClick}
               className={`group relative flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-700 border ${
                 location.pathname === "/ai" 
                 ? "bg-amber-500 border-amber-400 text-neutral-950" 
                 : "bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-600 shadow-sm"
               }`}
             >
              <div className="relative">
                <Sparkles 
                  size={18} 
                  className={`transition-all duration-700 ${location.pathname === "/ai" ? "scale-125 rotate-12 text-neutral-950" : "group-hover:scale-125 group-hover:rotate-12"}`} 
                />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] hidden xl:block">AI Companion</span>
              
              {/* Notification Dot */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-stone-900 group-hover:animate-ping" />
           </Link>
           </div>

           <Link 
             to="/safety"
             className="px-6 py-2.5 bg-red-600 text-white border border-red-700 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-red-600/20"
           >
             SOS
           </Link>

           <div className="relative" ref={profileRef}>
             <button 
               onClick={() => setIsProfileOpen(!isProfileOpen)}
               className={`w-10 h-10 rounded-full bg-stone-900 dark:bg-amber-500 border-2 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-sm group overflow-hidden ${
                 isProfileOpen ? "border-amber-500 ring-4 ring-amber-500/20" : "border-stone-800 dark:border-amber-400"
               }`}
             >
                <span className="text-xs font-black text-amber-500 dark:text-stone-950 group-hover:scale-110 transition-transform">RN</span>
             </button>

             <AnimatePresence>
               {isProfileOpen && (
                 <motion.div
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   className="absolute top-full mt-4 right-0 w-72 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] shadow-2xl p-6 z-[100] overflow-hidden"
                 >
                   <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none" />
                   
                   <div className="relative z-10">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-stone-950 dark:bg-amber-500 flex items-center justify-center border-2 border-stone-800 dark:border-amber-400">
                          <span className="text-sm font-black text-amber-500 dark:text-stone-950">RN</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-stone-900 dark:text-stone-100 leading-none mb-1 tracking-tight">RouteNaga</h4>
                          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest leading-none">Smart Travel Account</p>
                        </div>
                     </div>

                     <div className="space-y-1 mb-6">
                        <Link 
                          to="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-all group"
                        >
                           <User size={16} className="text-stone-400 group-hover:text-amber-600 transition-colors" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-stone-600 dark:text-stone-300">My Dashboard</span>
                        </Link>
                        <Link 
                           to="/about"
                           onClick={() => setIsProfileOpen(false)}
                           className="flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-all group"
                         >
                            <Info size={16} className="text-stone-400 group-hover:text-amber-600 transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-600 dark:text-stone-300">About RouteNaga</span>
                         </Link>
                     </div>

                     <div className="p-1 bg-stone-50 dark:bg-stone-800/30 rounded-[2rem] border border-stone-100 dark:border-stone-800/50 mb-6 relative group/theme overflow-hidden">
                        {/* Premium Glow Effect on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 translate-x-[-100%] group-hover/theme:translate-x-[100%] transition-transform duration-1000" />
                        
                        <div className="flex items-center justify-between p-3 relative z-10">
                           <div className="flex items-center gap-3">
                              <motion.div 
                                initial={false}
                                animate={{ 
                                  backgroundColor: isDarkMode ? "#f59e0b" : "#ffffff",
                                  rotate: isDarkMode ? 360 : 0 
                                }}
                                className={`p-2 rounded-xl border ${isDarkMode ? "border-amber-600 shadow-lg shadow-amber-500/20" : "border-stone-100 shadow-sm"}`}
                              >
                                 {isDarkMode ? <Moon size={14} className="text-stone-950" /> : <Sun size={14} className="text-amber-500" />}
                              </motion.div>
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black uppercase tracking-[0.1em] text-stone-900 dark:text-stone-100">Appearance</span>
                                 <span className="text-[8px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">{isDarkMode ? "Premium Dark" : "Standard Light"}</span>
                              </div>
                           </div>
                           
                           <button 
                             onClick={onToggleTheme}
                             className={`w-14 h-7 rounded-full relative transition-all duration-500 p-1.5 overflow-hidden ${
                               isDarkMode ? "bg-stone-950 border border-stone-800" : "bg-stone-200 border border-stone-300"
                             }`}
                           >
                              {/* Inner background glow when dark */}
                              {isDarkMode && <div className="absolute inset-0 bg-amber-500/10 blur-sm" />}
                              
                              <motion.div 
                                animate={{ x: isDarkMode ? 28 : 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className={`w-4 h-4 rounded-full shadow-lg relative z-10 flex items-center justify-center ${
                                  isDarkMode ? "bg-amber-500" : "bg-white"
                                }`}
                              >
                                {isDarkMode && <div className="w-1 h-1 bg-stone-950 rounded-full animate-pulse" />}
                              </motion.div>
                           </button>
                        </div>
                     </div>

                     <button 
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setIsProfileOpen(false);
                        }}
                        className="w-full py-4 text-center text-red-600 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-500/20 flex items-center justify-center gap-2"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>


        <button 
          className="md:hidden text-stone-900 dark:text-stone-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 p-6 animate-in slide-in-from-top duration-300 shadow-xl">
           <div className="flex flex-col gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    to={link.href}
                    className={`relative px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                      isActive 
                        ? "bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/25 border border-amber-400" 
                        : "text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      {link.name}
                      {isActive && (
                        <div className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-neutral-950" />
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
              <hr className="border-stone-100 dark:border-stone-800" />
              
              <div className="flex items-center justify-between px-6 py-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isDarkMode ? "bg-amber-500 text-stone-950" : "bg-white text-amber-500 shadow-sm"}`}>
                    {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-900 dark:text-stone-100">Appearance</span>
                    <span className="text-[8px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
                  </div>
                </div>
                <button 
                  onClick={onToggleTheme}
                  className={`w-12 h-6 rounded-full relative transition-all duration-500 p-1 ${
                    isDarkMode ? "bg-amber-500" : "bg-stone-200"
                  }`}
                >
                  <motion.div 
                    animate={{ x: isDarkMode ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="w-full bg-red-600 text-white dark:text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-red-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  <LogOut size={16} />
                  Finish Session
                </button>
              </div>
           </div>
        </div>
      )}
    </nav>
  );
}
