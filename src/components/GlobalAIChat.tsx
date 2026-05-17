import { useState, useRef, useEffect, useMemo } from "react";
import { Message } from "../types";
import { getWebhookChatResponse } from "../services/webhookService";
import { Send, Bot, Trash2, Sparkles, X, Terminal, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SUGGESTED_PROMPTS = [
  "Best place to travel in Nagaland this week?",
  "Is it safe to travel to Kohima tomorrow?",
  "Suggest tourist places near Dimapur",
  "Which route is best during rainy season?",
];

interface GlobalAIChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function GlobalAIChat({ isOpen, onToggle }: GlobalAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create a unique session ID for this chat session
  const sessionId = useMemo(() => {
    const key = "chalo-ai-global-session-id";
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = "global-" + Math.random().toString(36).substring(2, 11) + Date.now();
      sessionStorage.setItem(key, id);
    }
    return id;
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      scrollToBottom();
      if (!hasOpenedBefore) {
        setHasOpenedBefore(true);
        setTimeout(() => {
          setMessages([
            {
              id: "1",
              role: "assistant",
              content: "Hi, I’m Chalo Ai, your travel companion. I can help you explore routes, weather conditions, tourist places, and safer travel options across Nagaland.",
              timestamp: new Date(),
            },
          ]);
        }, 800);
      }
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, messages, isTyping, hasOpenedBefore]);

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
    } catch (error) {
      setIsTyping(false);
      console.error("Chat Error:", error);
    }
  };

  const clearChat = () => {
    if (messages.length > 0) {
      setMessages([messages[0]]);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-6 bottom-6 z-[80] w-[calc(100%-3rem)] md:w-[420px] h-[500px] max-h-[calc(100vh-3rem)] bg-white/70 dark:bg-stone-900/70 backdrop-blur-2xl border border-white/40 dark:border-stone-800 shadow-[0_25px_60px_rgba(0,0,0,0.15)] flex flex-col rounded-[2.5rem] overflow-hidden transition-colors"
          >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            
            {/* Animated Light Sweep */}
            <motion.div 
              animate={{ x: [-500, 500] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-[200px] h-full bg-gradient-to-r from-transparent via-amber-500/5 to-transparent skew-x-[-25deg] pointer-events-none z-0"
            />

            <div className="p-5 border-b border-white/50 dark:border-stone-800 flex items-center justify-between relative z-10 bg-white/30 dark:bg-stone-900/30 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative group cursor-pointer" onClick={onToggle}>
                  <div className="w-10 h-10 bg-neutral-900 dark:bg-stone-800 rounded-xl flex items-center justify-center shadow-xl shadow-amber-500/10 group-hover:scale-105 transition-transform relative z-10 overflow-hidden">
                    <Sparkles size={18} className="text-amber-500 relative z-10" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-stone-800 rounded-full animate-pulse z-20"></div>
                </div>
                <div>
                  <h3 className="text-[11px] font-black text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-1.5 uppercase">
                    Chalo <span className="text-amber-600">Ai</span>
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">Premium Helper</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={clearChat}
                  className="p-2 text-stone-400 hover:text-amber-600 transition-colors bg-white/50 dark:bg-stone-800/50 rounded-lg border border-white/60 dark:border-stone-700 hover:shadow-sm"
                >
                  <Trash2 size={13} />
                </button>
                <button 
                  onClick={onToggle}
                  className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors bg-white/50 dark:bg-stone-800/50 rounded-lg border border-white/60 dark:border-stone-700 hover:shadow-sm"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide relative z-10">
              <AnimatePresence initial={false}>
                {messages.map((m, idx) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex flex-col gap-2 max-w-[95%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-4 text-xs leading-relaxed transition-all relative ${
                        m.role === 'assistant' 
                          ? 'bg-white/80 dark:bg-stone-800/80 border border-white dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded-[1.5rem] rounded-tl-none shadow-sm backdrop-blur-xl group/msg prose prose-stone prose-xs dark:prose-invert max-w-none' 
                          : 'bg-neutral-900 dark:bg-amber-500 text-white dark:text-stone-950 font-medium rounded-[1.5rem] rounded-tr-none shadow-xl shadow-stone-200/50'
                      }`}>
                        {m.role === 'assistant' && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 group-hover/msg:w-1.5 transition-all duration-300" />
                        )}
                        {m.role === 'assistant' ? (
                          <div className="markdown-body">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {m.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          m.content
                        )}
                      </div>
                      <span className={`text-[8px] font-black tracking-[0.2em] text-stone-400 dark:text-stone-500 uppercase ${m.role === 'user' ? 'mr-3' : 'ml-3'} flex items-center gap-2`}>
                        {m.role === 'assistant' ? (
                          <>
                            <div className="w-1 h-1 rounded-full bg-amber-500/30" />
                            CHALO AI
                          </>
                        ) : (
                          <>
                            YOU
                            <div className="w-1 h-1 rounded-full bg-stone-200 dark:bg-stone-800" />
                          </>
                        )}
                        <span className="opacity-30">•</span>
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/50 dark:bg-stone-800/50 border border-white/60 dark:border-stone-700 p-2.5 rounded-xl rounded-tl-none flex gap-1 items-center">
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-amber-500 rounded-full"></motion.div>
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-amber-500 rounded-full"></motion.div>
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-amber-500 rounded-full"></motion.div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-5 bg-white/20 dark:bg-stone-900/20 border-t border-white/50 dark:border-stone-800 relative z-10 backdrop-blur-md">
              {messages.length < 3 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="text-[8px] font-black tracking-wider uppercase px-3 py-1.5 bg-white dark:bg-stone-800 border border-white dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:text-amber-600 hover:border-amber-500 transition-all active:scale-95 shadow-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="relative group"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Inquire travel..."
                  className="w-full bg-white/80 dark:bg-stone-800/80 border border-white dark:border-stone-700 text-stone-900 dark:text-stone-100 p-3.5 pr-12 rounded-2xl focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600 text-[11px] shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-neutral-900 dark:bg-amber-500 hover:bg-neutral-800 dark:hover:bg-amber-400 disabled:opacity-20 text-white dark:text-stone-950 w-9 h-9 rounded-xl transition-all shadow-lg active:scale-90 flex items-center justify-center"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
