import { TOURIST_SPOTS } from "../transportData";
import { Compass, Calendar, Info, MapPin, ArrowUpRight, CloudSun } from "lucide-react";
import { motion } from "motion/react";
import dzukouImg from "../assets/dzukou.jpg";
import khonomaImg from "../assets/khonoma.jpg";
import tripleFallsImg from "../assets/tripllefalls.jpg";

export function TouristMode() {
  const getSpotImage = (name: string) => {
    switch (name) {
      case "Dzukou Valley": return dzukouImg;
      case "Khonoma Village": return khonomaImg;
      case "Triple Falls": return tripleFallsImg;
      default: return undefined;
    }
  };

  return (
    <section id="tourist" className="pt-32 pb-24 px-6 bg-white dark:bg-stone-950 min-h-screen transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-black mb-2 text-emerald-950 dark:text-stone-100 tracking-tighter">Tourist Mode <span className="text-xs font-bold text-amber-500 ml-2 uppercase tracking-widest border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded-full">Chalo Ai Suggested</span></h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-lg">Discover Nagaland's hidden gems with Chalo Ai assisted travel planning.</p>
          </div>
          <button className="px-8 py-3 bg-stone-900 border border-stone-800 rounded-2xl text-xs font-black hover:bg-stone-800 dark:hover:bg-amber-500 dark:hover:text-stone-950 text-white transition-all uppercase tracking-widest shadow-xl shadow-stone-900/10 active:scale-95">
            Explore More
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {TOURIST_SPOTS.slice(0, 3).map((spot, idx) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group cursor-pointer bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/20 transition-all shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 dark:hover:shadow-none"
            >
              <div className="relative h-64 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img 
                  src={getSpotImage(spot.name)} 
                  alt={spot.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <p className="text-2xl font-black text-white tracking-tight leading-none mb-1">{spot.name}</p>
                  <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.2em]">{spot.category} • {spot.bestTime}</p>
                </div>
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-white border border-white/20 tracking-widest uppercase">
                   {spot.location}
                </div>
              </div>
              <div className="p-8">
                <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed mb-8 font-medium">
                  {spot.description}
                </p>
                <div className="flex items-center justify-between">
                   <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-white dark:border-stone-900 flex items-center justify-center text-[10px] font-black text-stone-400 overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?img=${i + idx * 5}`} alt="User" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border-2 border-white dark:border-stone-900 flex items-center justify-center text-[8px] font-black text-emerald-600 dark:text-emerald-500">
                        +2k
                      </div>
                   </div>
                   <button className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-all">
                      Plan Trip
                      <ArrowUpRight size={14} />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Coming Soon Feature: Tourist Guide */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="group relative bg-emerald-950 border border-emerald-900 rounded-[2.5rem] overflow-hidden flex flex-col p-10 shadow-xl"
          >
            <div className="absolute top-6 right-6 px-3 py-1 bg-amber-500 rounded-full text-[8px] font-black text-neutral-900 uppercase tracking-widest animate-pulse">
              Coming Soon
            </div>
            
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-amber-500 group-hover:border-amber-400 transition-all duration-500">
              <Compass className="text-amber-500 group-hover:text-neutral-950" size={30} />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight mb-4 group-hover:text-amber-400 transition-colors">Tourist Guide Network</h3>
            <p className="text-emerald-200/60 text-sm leading-relaxed mb-10 flex-1">
              Connect with certified local guides across Nagaland. Guides can register their expertise, and travelers can book curated experiences directly.
            </p>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Partner Program</span>
              <div className="flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                Pre-register <ArrowUpRight size={12} />
              </div>
            </div>
          </motion.div>

          {/* Coming Soon Feature: HomeStay */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="group relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] overflow-hidden flex flex-col p-10 hover:shadow-2xl dark:hover:shadow-none transition-all"
          >
            <div className="absolute top-6 right-6 px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-[8px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              Coming Soon
            </div>
            
            <div className="w-14 h-14 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center mb-8 border border-stone-100 dark:border-stone-700 group-hover:scale-110 group-hover:bg-emerald-950 group-hover:border-emerald-900 transition-all duration-500">
              <CloudSun className="text-emerald-950 dark:text-amber-500 group-hover:text-amber-500" size={30} />
            </div>

            <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">RouteHome Stays</h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-10 flex-1">
              Authentic Nagaland homestays integrated into your travel route. Easy registration for hosts and seamless booking for travelers.
            </p>

            <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <span className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em]">Hospitality Deck</span>
              <div className="flex items-center gap-2 text-emerald-950 dark:text-stone-300 text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                Join Beta <ArrowUpRight size={12} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
