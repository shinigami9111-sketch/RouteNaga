import { useState, useRef, useEffect, useMemo } from "react";
import { Message, Route } from "../types";
import { getWebhookChatResponse } from "../services/webhookService";
import { ROUTES } from "../transportData";
import { 
  Send, 
  Bot, 
  Trash2, 
  Sparkles, 
  X, 
  MessageSquare, 
  Ticket, 
  MapPin,
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  History,
  Info,
  Settings,
  HelpCircle,
  Menu,
  MoreVertical,
  Share2,
  Minimize2,
  Maximize2,
  Calendar,
  Clock,
  Users,
  CreditCard,
  ArrowRight,
  Armchair,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type AIMode = "chat" | "booking";

const SUGGESTED_PROMPTS = {
  chat: [
    "Tell me about Hornbill Festival",
    "Hidden gems in Nagaland?",
    "Local Naga food recommendations",
    "How to reach Dzukou Valley?"
  ],
  booking: [
    "Book a sumo from Dimapur to Kohima",
    "Check availability for Mokokchung bus",
    "Sumo rates for Zunheboto",
    "Next bus to Wokha"
  ]
};

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<AIMode>("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showBookingOptions, setShowBookingOptions] = useState(false);
  const [bookingStep, setBookingStep] = useState<"vehicle" | "destination" | "seat" | "confirm" | "success">("vehicle");
  const [selectedTicket, setSelectedTicket] = useState<Route | null>(null);
  const [sessionNonce, setSessionNonce] = useState(0);
  const [searchResults, setSearchResults] = useState<Route[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const sessionId = useMemo(() => {
    const key = `chalo-ai-session-${mode}`;
    // If nonce changed, force a new one
    if (sessionNonce > 0) {
      const newId = "session-" + Math.random().toString(36).substring(2, 11) + Date.now();
      sessionStorage.setItem(key, newId);
      return newId;
    }

    let id = sessionStorage.getItem(key);
    if (!id) {
      id = "session-" + Math.random().toString(36).substring(2, 11) + Date.now();
      sessionStorage.setItem(key, id);
    }
    return id;
  }, [mode, sessionNonce]);

  const scrollToBottom = (instant = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: instant ? "auto" : "smooth",
        block: "end"
      });
    }
  };

  useEffect(() => {
    // Only auto-scroll when AI is thinking or long messages arrive
    if (messages.length > 2 || isTyping) {
      const timer = setTimeout(() => scrollToBottom(), 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length, isTyping]);

  useEffect(() => {
    setShowBookingOptions(mode === "booking");
    setBookingStep("vehicle");
    const initialMessage = mode === "chat" 
      ? "Hi! How can I help with your Nagaland trip?"
      : "Pick a vehicle to start:";

    setMessages([
      {
        id: "welcome-" + mode,
        role: "assistant",
        content: initialMessage,
        timestamp: new Date(),
      }
    ]);
  }, [mode]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setShowBookingOptions(false);
    setSearchResults([]);

    // Basic state machine for booking steps
    if (mode === "booking") {
      const lowerText = text.toLowerCase();
      
      // Step: Seat Selection Detection
      if (lowerText.startsWith("book") && lowerText.includes("from") && lowerText.includes("to")) {
        setBookingStep("seat");
        setIsTyping(false);
        const assistantMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Great choice! Now, please select your preferred seat from the layout below. We recommend a Window Seat for the best views of the Naga hills!",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setTimeout(() => setShowBookingOptions(true), 500);
        return;
      }

      // Step: Booking Finish Detection
      if (lowerText.includes("select seat") || lowerText.includes("window seat") || lowerText.includes("aisle seat") || lowerText.startsWith("confirm seat")) {
        setBookingStep("confirm");
        setIsTyping(false);
        const assistantMessage: Message = {
          id: (Date.now() + 3).toString(),
          role: "assistant",
          content: "Seat selected! Would you like to confirm this booking and proceed to finalize your digital ticket?",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setTimeout(() => setShowBookingOptions(true), 500);
        return;
      }

      if (lowerText.includes("search") || lowerText.includes("available") || lowerText.includes("ticket")) {
        // Trigger mock search for now using ROUTES
        setTimeout(() => {
          setSearchResults(ROUTES.slice(0, 3));
          setIsTyping(false);
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "I've found some available tickets for popular routes in Nagaland. Take a look:",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }, 1500);
        return;
      }

      if (lowerText.includes("sumo") || lowerText.includes("bus") || lowerText.includes("taxi")) {
        setBookingStep("destination");
      } else if (DESTINATIONS.some(d => lowerText.includes(d.toLowerCase()))) {
        // Here we trigger search automatically when destination is picked
        handleSend("Search tickets");
        return;
      }
    }

    try {
      const response = await getWebhookChatResponse(text, sessionId);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, assistantMessage]);
      if (mode === "booking") {
        setTimeout(() => setShowBookingOptions(true), 500);
      }
    } catch (error) {
      setIsTyping(false);
      console.error("Chat Error:", error);
    }
  };

  const DESTINATIONS = [
    "Kohima", "Dimapur", "Mokokchung", "Wokha", "Phek", "Zunheboto", "Mon", "Chumoukedima"
  ];

  const clearChat = () => {
    setSessionNonce(prev => prev + 1);
    setMessages([messages[0]]);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-[#0a0a0a] overflow-hidden transition-colors duration-300">
      
      {/* Sidebar - Gemini Style */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 68 }}
        className="h-full bg-[#f8f9fa] dark:bg-[#131314] flex flex-col transition-all duration-300 border-r border-[#e3e3e3] dark:border-white/5 z-30"
      >
        <div className="p-4 flex items-center justify-between mb-2">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-stone-200 dark:hover:bg-[#28292a] rounded-full transition-colors"
          >
            <Menu size={20} className="text-[#444746] dark:text-[#c4c7c5]" />
          </button>
        </div>

        <div className="px-3">
          <button 
            onClick={() => {
              clearChat();
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-3 w-full p-4 rounded-[1.2rem] transition-all group overflow-hidden ${
              isSidebarOpen ? "bg-[#dde3ea] dark:bg-[#1e1f20] hover:bg-[#d3dae2] dark:hover:bg-[#28292a] shadow-sm" : "hover:bg-stone-200 dark:hover:bg-[#28292a]"
            }`}
          >
            <Plus size={20} className="text-amber-600 shrink-0" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-black uppercase tracking-widest text-stone-900 dark:text-white whitespace-nowrap"
                >
                  New Chat
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        <nav className="flex-1 px-3 mt-10 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            <button 
              onClick={() => setMode("chat")}
              className={`flex items-center gap-4 w-full p-4 rounded-full transition-all ${
                mode === "chat" ? "bg-[#dde3ea] dark:bg-[#1e1f20]" : "hover:bg-stone-100 dark:hover:bg-[#232425]"
              }`}
            >
              <MessageSquare size={18} className={mode === "chat" ? "text-amber-500" : "text-stone-400"} />
              {isSidebarOpen && <span className="text-sm font-bold tracking-tight">Intelligence</span>}
            </button>
            <button 
              onClick={() => setMode("booking")}
              className={`flex items-center gap-4 w-full p-4 rounded-full transition-all ${
                mode === "booking" ? "bg-[#dde3ea] dark:bg-[#1e1f20]" : "hover:bg-stone-100 dark:hover:bg-[#232425]"
              }`}
            >
              <Ticket size={18} className={mode === "booking" ? "text-emerald-500" : "text-stone-400"} />
              {isSidebarOpen && <span className="text-sm font-bold tracking-tight">Smart Booking</span>}
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-stone-200 dark:border-white/5 space-y-1">
          <button className="flex items-center gap-4 w-full p-3 rounded-full hover:bg-stone-100 dark:hover:bg-[#232425] transition-all">
            <Settings size={18} className="text-stone-400" />
            {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest opacity-60">Settings</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-screen bg-white dark:bg-[#030303] overflow-hidden relative">
        
        {/* Subtle Background Glows */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[150px] rounded-full" />
        </div>
 
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative z-10 px-6">
          <div className={`w-full max-w-4xl mx-auto flex flex-col transition-all duration-1000 ${messages.length > 2 ? 'pt-10' : 'h-full justify-center'}`}>
            
            {/* Landing State or Messages */}
            {messages.length <= 1 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center space-y-12"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-stone-900 dark:bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-10 group overflow-hidden relative cursor-pointer"
                  >
                    <Sparkles size={40} className="text-amber-500 relative z-10 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-amber-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                  <h2 className="text-5xl md:text-7xl font-black text-stone-900 dark:text-white tracking-tighter mb-4 leading-none">
                    WHERE TO <br /> <span className="text-amber-600 italic">NEXT?</span>
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.6em] text-stone-400">
                    {mode === 'chat' ? 'Neural Travel Assistant' : 'Booking Intelligence v2'}
                  </p>
                </div>

                {/* Central Chat Bar */}
                <div className="w-full max-w-2xl mx-auto">
                    <div className="p-2 bg-stone-50 dark:bg-white/[0.02] border border-stone-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl focus-within:ring-2 focus-within:ring-amber-500/20 transition-all outline-none">
                      <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                        className="flex items-end gap-2"
                      >
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder={mode === 'chat' ? "Ask about Nagaland..." : "Book a journey..."}
                          className="flex-1 bg-transparent border-none text-base text-stone-900 dark:text-stone-100 focus:ring-0 focus:outline-none focus-visible:outline-none py-4 px-6 min-h-[56px] max-h-[140px] resize-none custom-scrollbar font-medium placeholder:text-stone-400 dark:placeholder:text-stone-600"
                          rows={1}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSend(input);
                            }
                          }}
                        />
                        <button
                          type="submit"
                          disabled={!input.trim() || isTyping}
                          className={`w-12 h-12 rounded-2xl transition-all flex items-center justify-center shadow-lg focus:outline-none ${
                            input.trim() 
                              ? 'bg-amber-500 text-neutral-950 scale-100 opacity-100' 
                              : 'bg-stone-100 dark:bg-white/5 text-stone-300 dark:text-stone-800 scale-95 opacity-50'
                          }`}
                        >
                          <Send size={18} />
                        </button>
                      </form>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                      {SUGGESTED_PROMPTS[mode].map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleSend(prompt)}
                          className="px-4 py-2 bg-stone-50 dark:bg-white/[0.03] border border-stone-100 dark:border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-amber-500 hover:border-amber-500/50 transition-all"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-12 pb-48 pt-10">
                <AnimatePresence initial={false} mode="popLayout">
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                      className={`flex items-start gap-6 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {m.role === 'assistant' && (
                        <div className="w-10 h-10 rounded-[1.2rem] bg-stone-900 dark:bg-white flex items-center justify-center shadow-lg shrink-0 mt-1">
                          <Sparkles size={18} className="text-amber-500" />
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] ${m.role === 'user' ? 'w-full flex justify-end' : 'w-full'}`}>
                        <div className={`
                          text-base leading-relaxed 
                          ${m.role === 'assistant' 
                            ? 'text-stone-800 dark:text-stone-200 prose prose-stone dark:prose-invert max-w-none' 
                            : 'bg-stone-50 dark:bg-white/[0.03] px-6 py-4 rounded-[1.5rem] text-stone-900 dark:text-white font-medium shadow-sm border border-stone-100 dark:border-white/5'
                          }
                        `}>
                          {m.role === 'assistant' ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {m.content}
                            </ReactMarkdown>
                          ) : (
                            m.content
                          )}
                        </div>

                        {/* Render Search Results if present and this is the last assistant message */}
                        {m.role === 'assistant' && searchResults.length > 0 && messages.indexOf(m) === messages.length - 1 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 space-y-4"
                          >
                            {searchResults.map((route) => (
                              <div 
                                key={route.id}
                                className="p-6 bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/10 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-amber-500/30 transition-all group"
                              >
                                <div className="flex justify-between items-start mb-6">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-amber-500/10 dark:bg-amber-500/5 rounded-xl flex items-center justify-center text-amber-600">
                                      <Ticket size={20} />
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Route ID: {route.id}</p>
                                      <h4 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-tighter">
                                        {route.from} <ArrowRight size={14} className="inline mx-1 text-amber-500" /> {route.to}
                                      </h4>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Fare</p>
                                    <p className="text-xl font-black text-stone-900 dark:text-white font-mono">₹{route.price}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                  <div className="p-3 bg-stone-50 dark:bg-white/[0.02] rounded-2xl">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-stone-400 mb-1">Date</p>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-stone-800 dark:text-stone-200 uppercase">
                                      <Calendar size={12} className="text-amber-500" />
                                      {route.departureDate}
                                    </div>
                                  </div>
                                  <div className="p-3 bg-stone-50 dark:bg-white/[0.02] rounded-2xl">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-stone-400 mb-1">Time</p>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-stone-800 dark:text-stone-200 uppercase">
                                      <Clock size={12} className="text-emerald-500" />
                                      {route.departureTime}
                                    </div>
                                  </div>
                                  <div className="p-3 bg-stone-50 dark:bg-white/[0.02] rounded-2xl">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-stone-400 mb-1">Seats</p>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-stone-800 dark:text-stone-200 uppercase">
                                      <Users size={12} className="text-blue-500" />
                                      {route.availableSeats} Left
                                    </div>
                                  </div>
                                </div>

                                <button 
                                  onClick={() => {
                                    setSelectedTicket(route);
                                    handleSend(`Book ${route.vehicleType} from ${route.from} to ${route.to} for ₹${route.price}`);
                                  }}
                                  className="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-neutral-950 transition-all shadow-lg group-hover:shadow-amber-500/20"
                                >
                                  Book Now
                                </button>
                              </div>
                            ))}
                          </motion.div>
                        )}

                        <p className={`mt-3 text-[8px] font-black uppercase tracking-[0.3em] text-stone-300 dark:text-stone-700 ${m.role === 'user' ? 'text-right' : ''}`}>
                          {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {m.role === 'user' && (
                        <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center shadow-lg shrink-0 mt-1">
                          <span className="text-[7px] font-black text-amber-500">USER</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Interactive Booking Dashboard */}
                {mode === "booking" && showBookingOptions && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full pt-4"
                  >
                    {bookingStep === "vehicle" ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { label: "Book Sumo", desc: "Shared journeys", icon: <MapPin size={18} />, color: "bg-amber-500" },
                          { label: "Express Bus", desc: "Long distance", icon: <Bot size={18} />, color: "bg-emerald-500" },
                          { label: "Private Taxi", desc: "Personal travel", icon: <Sparkles size={18} />, color: "bg-blue-500" }
                        ].map((opt) => (
                          <button
                            key={opt.label}
                            onClick={() => handleSend(opt.label)}
                            className="flex flex-col items-start p-6 bg-white dark:bg-white/[0.02] border border-stone-200 dark:border-white/5 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-amber-500/30 transition-all group relative overflow-hidden"
                          >
                            <div className={`w-12 h-12 ${opt.color} rounded-2xl flex items-center justify-center text-neutral-950 mb-4 group-hover:scale-110 transition-transform`}>
                              {opt.icon}
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-stone-900 dark:text-white mb-1">{opt.label}</h4>
                            <p className="text-[10px] text-stone-400 font-medium">{opt.desc}</p>
                            <ChevronRight size={16} className="absolute bottom-6 right-6 text-stone-300 group-hover:translate-x-1 group-hover:text-amber-500 transition-all" />
                          </button>
                        ))}
                      </div>
                    ) : bookingStep === "destination" ? (
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4 px-2">Where would you like to go?</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {DESTINATIONS.map((dest) => (
                            <button
                              key={dest}
                              onClick={() => handleSend(dest)}
                              className="px-4 py-6 bg-white dark:bg-white/[0.02] border border-stone-200 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-900 dark:text-white hover:bg-amber-500 hover:text-neutral-950 transition-all text-center group"
                            >
                              <span className="block mb-2 opacity-40 group-hover:opacity-100">●</span>
                              {dest}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : bookingStep === "seat" ? (
                      <div className="space-y-6 bg-white dark:bg-[#131314] border border-stone-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-xl">
                        <div className="flex items-center justify-between px-2 mb-4">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-600">
                               <Armchair size={16} />
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Cabin Layout</p>
                           </div>
                           <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-amber-500 text-black rounded-full">Window Available</span>
                        </div>

                        <div className="bg-stone-900 dark:bg-black rounded-[2rem] p-8 border-4 border-stone-800 relative overflow-hidden">
                          <div className="absolute top-0 inset-x-0 h-4 bg-white/5 blur-xl"></div>
                          
                          <div className="space-y-6 max-w-[200px] mx-auto relative z-10">
                            {/* Driver and Front Row */}
                            <div className="flex justify-between items-center pr-2">
                               <button 
                                 onClick={() => handleSend("Confirm Seat: Front (Window)")}
                                 className="w-12 h-14 bg-amber-500 text-neutral-950 rounded-xl flex flex-col items-center justify-center border-2 border-white shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-110 transition-all"
                               >
                                 <Armchair size={18} />
                                 <span className="text-[6px] font-black mt-1">W1</span>
                               </button>
                               <div className="w-12 h-14 bg-white/5 rounded-xl flex flex-col items-center justify-center border border-white/10 opacity-30">
                                 <Users size={18} className="text-stone-500" />
                                 <span className="text-[5px] font-black mt-1">CAPTAIN</span>
                               </div>
                            </div>

                            {/* Middle Row */}
                            <div className="flex justify-between gap-2">
                               {[
                                 { id: "M1", label: "W2", pref: "window" },
                                 { id: "M2", label: "M2", pref: "middle" },
                                 { id: "M3", label: "A1", pref: "aisle" }
                               ].map(s => (
                                 <button 
                                   key={s.id}
                                   onClick={() => handleSend(`Confirm Seat: ${s.id} (${s.pref})`)}
                                   className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center border transition-all hover:scale-110 ${
                                     s.pref === "window" ? "bg-white/10 text-white border-white/20" : "bg-white/5 text-white/40 border-white/5"
                                   }`}
                                 >
                                   <Armchair size={18} />
                                   <span className="text-[6px] font-black mt-1">{s.label}</span>
                                 </button>
                               ))}
                            </div>

                            {/* Back Row */}
                            <div className="flex justify-between gap-2">
                               {[
                                 { id: "B1", label: "W3", pref: "window" },
                                 { id: "B2", label: "M3", pref: "middle" },
                                 { id: "B3", label: "A2", pref: "aisle" }
                               ].map(s => (
                                 <button 
                                   key={s.id}
                                   onClick={() => handleSend(`Confirm Seat: ${s.id} (${s.pref})`)}
                                   className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center border transition-all hover:scale-110 ${
                                    s.pref === "window" ? "bg-white/10 text-white border-white/20" : "bg-white/5 text-white/40 border-white/5"
                                   }`}
                                 >
                                   <Armchair size={18} />
                                   <span className="text-[6px] font-black mt-1">{s.label}</span>
                                 </button>
                               ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <button 
                             onClick={() => handleSend("Select Window Seat (W1)")}
                             className="p-4 bg-stone-50 dark:bg-white/[0.03] border border-stone-200 dark:border-white/10 rounded-2xl hover:border-amber-500 transition-all group flex items-center gap-3"
                           >
                             <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-600">
                               <Armchair size={16} />
                             </div>
                             <div className="text-left">
                               <h5 className="text-[10px] font-black text-stone-900 dark:text-white uppercase">Window Seat</h5>
                             </div>
                           </button>
                           <button 
                             onClick={() => handleSend("Select Aisle Seat (A2)")}
                             className="p-4 bg-stone-50 dark:bg-white/[0.03] border border-stone-200 dark:border-white/10 rounded-2xl hover:border-emerald-500 transition-all group flex items-center gap-3"
                           >
                             <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-600">
                               <Armchair size={16} />
                             </div>
                             <div className="text-left">
                               <h5 className="text-[10px] font-black text-stone-900 dark:text-white uppercase">Aisle Seat</h5>
                             </div>
                           </button>
                        </div>
                      </div>
                    ) : bookingStep === "confirm" ? (
                      <div className="flex flex-col items-center text-center space-y-6 bg-white dark:bg-[#131314] border border-stone-200 dark:border-white/5 p-10 rounded-[2.5rem] shadow-xl">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-2">
                          <HelpCircle size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-stone-900 dark:text-white uppercase tracking-tight mb-2">Confirm Booking?</h3>
                          <p className="text-xs text-stone-500 font-medium">Are you sure you want to book this ticket? You can still change your seat if you're not ready.</p>
                        </div>
                        <div className="flex gap-4 w-full">
                          <button 
                            onClick={() => {
                              setBookingStep("success");
                              const successMsg = "Yes, secure my seat and book it!";
                              const userMsg: Message = {
                                id: Date.now().toString(),
                                role: "user",
                                content: successMsg,
                                timestamp: new Date(),
                              };
                              setMessages(prev => [...prev, userMsg]);
                              
                              setTimeout(() => {
                                const assistantMsg: Message = {
                                  id: (Date.now()+1).toString(),
                                  role: "assistant",
                                  content: "Booking confirmed! Your Nagaland journey is secured. Click below to view your digital ticket.",
                                  timestamp: new Date(),
                                };
                                setMessages(prev => [...prev, assistantMsg]);
                                setShowBookingOptions(true);
                              }, 600);
                            }}
                            className="flex-1 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                          >
                            Yes, Confirm
                          </button>
                          <button 
                            onClick={() => {
                              setBookingStep("seat");
                              const backMsg = "I'd like to pick a different seat.";
                              const userMsg: Message = {
                                id: Date.now().toString(),
                                role: "user",
                                content: backMsg,
                                timestamp: new Date(),
                              };
                              setMessages(prev => [...prev, userMsg]);
                            }}
                            className="flex-1 py-4 border border-stone-200 dark:border-white/10 text-stone-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all"
                          >
                            No, Back
                          </button>
                        </div>
                      </div>
                    ) : bookingStep === "success" ? (
                      <div className="flex flex-col items-center text-center space-y-8 bg-stone-900 dark:bg-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="w-20 h-20 bg-emerald-500 text-neutral-950 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <ShieldCheck size={40} />
                        </div>
                        <div>
                          <h3 className="text-3xl font-black text-white dark:text-stone-900 tracking-tighter uppercase mb-2">Booking Done!</h3>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500">Your journey is officially confirmed</p>
                        </div>
                        <button
                          onClick={() => {
                            // Persistence Logic
                            const newBooking = {
                              id: Date.now().toString(),
                              pnr: "RN-" + Math.floor(1000 + Math.random() * 9000) + "-AI",
                              from: selectedTicket?.from || "Unknown",
                              to: selectedTicket?.to || "Unknown",
                              date: selectedTicket?.departureDate || "Pending",
                              time: selectedTicket?.departureTime || "06:00 AM",
                              seat: "W1 (Window)",
                              status: "confirmed",
                              type: selectedTicket?.vehicleType || "Sumo",
                              price: selectedTicket?.price || 500
                            };
                            
                            const existingRaw = localStorage.getItem('my-bookings');
                            let existing = [];
                            try {
                              existing = existingRaw ? JSON.parse(existingRaw) : [];
                            } catch (e) {
                              existing = [];
                            }
                            
                            localStorage.setItem('my-bookings', JSON.stringify([...existing, newBooking]));
                            navigate("/booking");
                          }}
                          className="px-10 py-5 bg-amber-500 text-neutral-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:scale-105 transition-all w-full md:w-auto"
                        >
                          Finish & View Tickets
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            setBookingStep("vehicle");
                            handleSend("Show vehicle options");
                          }}
                          className="px-10 py-5 bg-amber-500 text-neutral-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                        >
                          Restart Booking Process
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-6">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Sparkles size={18} className="text-amber-500 animate-pulse" />
                    </div>
                    <div className="flex gap-1.5 items-center h-10">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Global Input Bar - Only show when chatting has begun */}
        {messages.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-50">
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-2 bg-white/80 dark:bg-[#1e1f20] backdrop-blur-xl rounded-[2.5rem] border border-stone-200 dark:border-white/10 shadow-2xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/10 outline-none"
            >
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="flex items-end gap-2"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none text-base text-stone-900 dark:text-stone-100 focus:ring-0 focus:outline-none focus-visible:outline-none py-4 px-6 min-h-[56px] max-h-[140px] resize-none custom-scrollbar font-medium placeholder:text-stone-400 dark:placeholder:text-stone-600"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(input);
                    }
                  }}
                />
                <div className="flex items-center pb-1 pr-1">
                   <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className={`w-12 h-12 rounded-2xl transition-all flex items-center justify-center shadow-lg focus:outline-none ${
                      input.trim() 
                        ? 'bg-amber-500 text-neutral-950 scale-100 opacity-100 hover:scale-105' 
                        : 'bg-stone-100 dark:bg-white/5 text-stone-300 dark:text-stone-700 scale-95 opacity-50'
                    }`}
                   >
                     <Send size={18} />
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Top Controls Overlay */}
        <div className="fixed top-6 right-8 flex items-center gap-2 z-50">
           <button className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-white bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-full transition-all">
             <Share2 size={16} />
           </button>
           <button 
             onClick={clearChat}
             className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-white bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-full transition-all"
           >
             <MoreVertical size={16} />
           </button>
        </div>
      </main>

    </div>
  );
}

