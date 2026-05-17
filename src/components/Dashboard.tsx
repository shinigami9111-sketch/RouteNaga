import { Activity, BookOpen, Clock, Heart, TrendingUp, Bell, Map as MapIcon, CreditCard } from "lucide-react";
import { motion } from "motion/react";

export function Dashboard() {
  return (
    <section id="dashboard" className="pt-32 pb-24 px-6 bg-white dark:bg-stone-950 min-h-[60vh] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600 dark:text-amber-500 mb-8">Personal Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-3xl group hover:bg-white dark:hover:bg-stone-800/50 transition-all shadow-sm">
            <p className="text-stone-400 dark:text-stone-500 text-[10px] uppercase font-bold mb-3 tracking-widest">Upcoming Trip</p>
            <h3 className="text-xl font-bold mb-1 text-stone-900 dark:text-stone-100">DMP → KOH</h3>
            <p className="text-amber-600 text-xs font-bold tracking-tight">Tomorrow, 7:00 AM</p>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-3xl group hover:bg-white dark:hover:bg-stone-800/50 transition-all border-l-4 border-l-amber-500 shadow-sm">
            <p className="text-stone-400 dark:text-stone-500 text-[10px] uppercase font-bold mb-3 tracking-widest">Safety Alert</p>
            <h3 className="text-xl font-bold text-amber-600 uppercase tracking-tighter">Heavy Fog</h3>
            <p className="text-stone-500 dark:text-stone-400 text-xs font-medium">Mokokchung Route</p>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-3xl group hover:bg-white dark:hover:bg-stone-800/50 transition-all shadow-sm">
            <p className="text-stone-400 dark:text-stone-500 text-[10px] uppercase font-bold mb-3 tracking-widest">Rewards</p>
             <div className="flex items-end gap-2 text-stone-900 dark:text-stone-100">
                <h3 className="text-xl font-bold">1,240</h3>
                <span className="text-[10px] text-amber-600 font-bold mb-1">Points</span>
             </div>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-3xl group hover:bg-white dark:hover:bg-stone-800/50 transition-all shadow-sm">
            <p className="text-stone-400 dark:text-stone-500 text-[10px] uppercase font-bold mb-3 tracking-widest">Profile Status</p>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-amber-500"></div>
               <span className="text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">Verified Local</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
