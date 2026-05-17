import { useState, useEffect } from "react";
import { AlertOctagon, CloudRain, ShieldAlert, Phone, Share2, Map, TriangleAlert, Info, X, Zap, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const EMERGENCY_CONTACTS = [
  { name: "Police Control Room", number: "100", location: "DGP Office, Kohima", icon: <Phone size={20} /> },
  { name: "Medical Hotline", number: "102", location: "NHAK Kohima", icon: <AlertOctagon size={20} /> },
  { name: "Disaster Management", number: "1070", location: "Nagaland Secretariat", icon: <CloudRain size={20} /> },
  { name: "RouteNaga Help", number: "+91 9400-000-000", location: "24/7 Support", icon: <Info size={20} /> },
];

export function EmergencySupport() {
  const [sosState, setSosState] = useState<'idle' | 'activating' | 'active'>('idle');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sosState === 'activating') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setSosState('active');
        // Simulate sending location to authorities
        console.log("SOS Alert Sent! Current coordinates uploaded.");
      }
    }
    return () => clearTimeout(timer);
  }, [sosState, countdown]);

  const handleSOSClick = () => {
    if (sosState === 'idle') {
      setSosState('activating');
      setCountdown(5);
    }
  };

  const cancelSOS = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSosState('idle');
  };

  return (
    <section id="safety" className="pt-32 pb-24 px-6 bg-white dark:bg-stone-950 min-h-screen transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-12 rounded-[3.5rem] flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl shadow-stone-200 dark:shadow-none relative overflow-hidden transition-all duration-500">
          {/* Decorative background pulse for active state */}
          <AnimatePresence>
            {sosState !== 'idle' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 z-0 pointer-events-none opacity-20 ${sosState === 'activating' ? 'bg-amber-500' : 'bg-red-600'}`}
              />
            )}
          </AnimatePresence>

          <div className="max-w-xl relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-widest mb-6">
              <TriangleAlert size={12} />
              <span>Priority Response Only</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-none text-stone-900 dark:text-white transition-colors">One-Tap SOS <br /><span className="text-amber-600 dark:text-amber-500">Protection</span></h2>
            <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed font-medium transition-colors">
              Sends your live high-precision location, vehicle details, and passenger count to the state police and RouteNaga operators.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-6 relative z-10 w-full lg:w-auto">
            <button 
              onClick={handleSOSClick}
              disabled={sosState === 'active'}
              className={`w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative group ${
                sosState === 'idle' ? 'bg-amber-500 shadow-amber-500/20 hover:scale-105 active:scale-95' :
                sosState === 'activating' ? 'bg-stone-800 shadow-white/5' :
                'bg-red-600 shadow-red-600/40'
              }`}
            >
              {sosState === 'idle' && (
                <>
                  <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-20"></div>
                  <ShieldAlert size={80} className="text-neutral-950" />
                </>
              )}

              {sosState === 'activating' && (
                <div className="flex flex-col items-center">
                   <div className="text-6xl font-black text-white mb-2">{countdown}</div>
                   <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Hold to cancel</div>
                </div>
              )}

              {sosState === 'active' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center"
                >
                   <Zap size={80} className="text-white animate-bounce" />
                   <div className="text-sm font-black text-white uppercase tracking-widest mt-4">Responders Alerted</div>
                </motion.div>
              )}
            </button>
            
            <div className="h-6 flex items-center">
              {sosState === 'idle' && <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 animate-pulse">Touch to Activate</p>}
              {sosState === 'activating' && (
                <button 
                  onClick={cancelSOS}
                  className="px-10 py-4 bg-red-600 border border-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-red-700 transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-95 z-30 animate-pulse"
                >
                  Click to Abort
                </button>
              )}
              {sosState === 'active' && (
                 <button 
                  onClick={() => setSosState('idle')}
                  className="px-10 py-4 bg-stone-900 border border-stone-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-black transition-all shadow-xl active:scale-95 z-30"
                >
                  Dismiss Status
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contacts Grid */}
        <div className="mt-24">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
            <div>
              <h3 className="text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight leading-none mb-3">Nagaland Emergency Services</h3>
              <p className="text-stone-500 dark:text-stone-400 font-bold uppercase text-[10px] tracking-widest">Verified Contact Directory</p>
            </div>
            <div className="px-5 py-3 bg-stone-100 dark:bg-stone-900 rounded-2xl flex items-center gap-3 border border-stone-200 dark:border-stone-800">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black text-stone-600 dark:text-stone-400 uppercase tracking-widest">Agents Online</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {EMERGENCY_CONTACTS.map((contact, index) => (
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-stone-200 dark:hover:shadow-black transition-all hover:bg-stone-50 dark:hover:bg-stone-800/50"
               >
                  <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center mb-6 text-stone-900 dark:text-stone-100 group-hover:bg-amber-500 transition-all group-hover:scale-110">
                    {contact.icon}
                  </div>
                  <h4 className="text-lg font-black text-stone-900 dark:text-stone-100 mb-1 group-hover:text-amber-600 transition-colors">{contact.name}</h4>
                  <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-6">{contact.location}</p>
                  
                  <a 
                    href={`tel:${contact.number}`}
                    className="flex items-center justify-between w-full p-4 bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 rounded-2xl text-stone-900 dark:text-stone-100 font-bold text-sm tracking-tight group-hover:bg-white dark:group-hover:bg-stone-800 group-hover:border-amber-200 dark:group-hover:border-amber-900 transition-all"
                  >
                    {contact.number}
                    <ChevronRight size={16} className="text-stone-300 dark:text-stone-600 group-hover:text-amber-500" />
                  </a>
               </motion.div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}
