import { Search, MapPin, Calendar, Users, ChevronRight, Activity, Globe, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { LOCATIONS } from "../transportData";
import { motion, AnimatePresence } from "motion/react";
import { DatePicker } from "./DatePicker";
import { useNavigate } from "react-router-dom";
import { VehicleType } from "../types";
import nagalandImg from "../assets/NAGALAND.jpg";
import newImg from "../New.png";
import nstImg from "../Nst.png";

const HERO_IMAGES = [
  { url: nagalandImg, label: "Nagaland Gateway" },
  { url: nstImg, label: "Nagaland State Transport" },
  { url: newImg, label: "RouteNaga Experience" },
];

export function Hero() {
  const navigate = useNavigate();
  const [travelDate, setTravelDate] = useState(new Date("2026-10-24"));
  const [from, setFrom] = useState("Dimapur");
  const [to, setTo] = useState("Kohima");
  const [vehicle, setVehicle] = useState<string>("all");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, [currentImageIndex]); // Reset timer on manual change

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (vehicle !== "all") params.set("vehicle", vehicle);
    navigate(`/routes?${params.toString()}`);
  };

  return (
    <section className="relative pt-32 pb-12 overflow-hidden bg-white dark:bg-stone-950 px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-emerald-50/50 to-amber-50/30 dark:from-stone-900 dark:to-stone-900 border border-emerald-500/10 dark:border-stone-800 p-8 md:p-12 rounded-[3rem] relative overflow-hidden shadow-sm"
        >
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative mb-12 min-h-[500px] flex items-center">
            <div className="max-w-2xl relative z-20 py-12">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 dark:border-amber-500/10 text-amber-700 dark:text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-sm"
              >
                <Activity size={12} />
                <span>Live in Nagaland</span>
              </motion.div>
              
              <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tighter mb-6 leading-[0.85] text-emerald-950 dark:text-stone-100 drop-shadow-sm">
                Smarter <br /> Shared <span className="text-amber-600">Transport</span>
              </h1>
              <p className="text-emerald-900/70 dark:text-stone-400 text-xl max-w-lg font-medium leading-relaxed">
                Powered by AI route guidance. <br />
                <span className="text-emerald-800/40 dark:text-stone-500">Trusted by over 5,000 local commuters in Kohima & beyond.</span>
              </p>
            </div>

            {/* Cinematic Image Blend */}
            <motion.div 
              initial={{ opacity: 0, scale: 1.05, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -right-32 -top-12 w-full max-w-[1000px] h-[120%] z-0 pointer-events-none md:pointer-events-auto"
            >
              <div className="relative w-full h-full overflow-hidden rounded-[4rem]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={HERO_IMAGES[currentImageIndex].url} 
                      alt={HERO_IMAGES[currentImageIndex].label} 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 dark:from-stone-900 via-emerald-50/20 dark:via-stone-900/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent"></div>
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5"></div>
              </div>
              
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                <motion.div 
                  key={currentImageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="px-5 py-2.5 bg-black/40 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{HERO_IMAGES[currentImageIndex].label}</span>
                </motion.div>

                {/* Premium Slide Controls */}
                <div className="flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 pointer-events-auto">
                  {HERO_IMAGES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                        currentImageIndex === index 
                          ? "w-8 bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]" 
                          : "w-2 bg-white/30 hover:bg-white/60"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="absolute top-0 right-0 z-20 flex gap-4 pointer-events-none">
               <div className="text-right hidden xl:block translate-y-8">
                  <p className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">Network</p>
                  <p className="text-emerald-700 dark:text-emerald-500 font-bold bg-white/80 dark:bg-stone-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-white dark:border-stone-700 shadow-xl">
                    ● <span className="ml-1">Active</span>
                  </p>
               </div>
               <div className="text-right hidden xl:block translate-y-8">
                  <p className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">Weather</p>
                  <p className="text-stone-800 dark:text-stone-200 font-bold bg-white/80 dark:bg-stone-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-white dark:border-stone-700 shadow-xl">
                    Kohima 18°C
                  </p>
               </div>
            </div>
          </div>
          
          {/* Search Form */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-[2rem] shadow-xl relative z-30 transition-colors">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 ml-4 tracking-widest">From</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                  <select 
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 p-4 pl-12 rounded-2xl focus:ring-1 focus:ring-amber-500/50 appearance-none text-sm font-medium focus:outline-none transition-all"
                  >
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 ml-4 tracking-widest">To</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/80" size={16} />
                  <select 
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 p-4 pl-12 rounded-2xl focus:ring-1 focus:ring-amber-500/50 appearance-none text-sm font-medium focus:outline-none transition-all"
                  >
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 ml-4 tracking-widest">Date</label>
                <DatePicker 
                  selectedDate={travelDate} 
                  onChange={setTravelDate} 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 ml-4 tracking-widest">Vehicle</label>
                <div className="relative">
                   <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400" size={16} />
                   <select 
                     value={vehicle}
                     onChange={(e) => setVehicle(e.target.value)}
                     className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 p-4 pl-12 rounded-2xl focus:ring-1 focus:ring-amber-500/50 appearance-none text-sm font-medium focus:outline-none transition-all"
                   >
                    <option value="all">Any Vehicle</option>
                    {Object.values(VehicleType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={handleSearch}
                  className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-2xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Search size={18} />
                  Search
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
