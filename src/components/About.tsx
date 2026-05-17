import { motion } from "motion/react";
import { Info, Map, Shield, Users } from "lucide-react";

export function About() {
  return (
    <div className="pt-32 pb-24 px-6 bg-white dark:bg-stone-950 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            <Info size={12} />
            <span>Our Mission</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-stone-900 dark:text-stone-100">Digitizing Travel in <br /><span className="text-amber-500">The Land of Festivals</span></h1>
          <p className="text-stone-500 dark:text-stone-400 text-lg max-w-2xl mx-auto">
            RouteNaga is Nagaland's first smart transport grid, designed to make travel reliable, safe, and transparent for locals and tourists alike.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 rounded-[2.5rem] shadow-sm">
            <div className="w-12 h-12 bg-amber-500/10 dark:bg-amber-500/5 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
              <Map size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-stone-900 dark:text-stone-100">Smart Connectivity</h3>
            <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
              We leverage real-time data to optimize routes across difficult terrains, ensuring you reach your destination efficiently.
            </p>
          </div>

          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 rounded-[2.5rem] shadow-sm">
            <div className="w-12 h-12 bg-amber-500/10 dark:bg-amber-500/5 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-stone-900 dark:text-stone-100">Safety First</h3>
            <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
              Our 24/7 SOS system and verified driver network provide peace of mind even in the most remote corners of the state.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
