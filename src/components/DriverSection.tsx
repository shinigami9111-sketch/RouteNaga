import { Truck, Users, LayoutDashboard, Route as RouteIcon, IndianRupee, BellRing, ClipboardList, Info } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export function DriverSection() {
  return (
    <section id="driver" className="py-24 px-6 bg-white dark:bg-stone-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="bg-amber-500 p-12 rounded-[3.5rem] flex flex-col lg:flex-row items-center justify-between gap-12 group shadow-xl shadow-amber-500/10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-950 mb-6 tracking-tight">Own a Sumo or Bus? <br /><span className="text-white group-hover:text-amber-50 transition-colors italic">Grow with RouteNaga</span></h2>
            <p className="text-neutral-900 text-lg font-medium leading-relaxed mb-8">
              Join Nagaland's smartest transport network. Get more bookings, automated seat management, and real-time route optimization.
            </p>
            <div className="flex flex-wrap gap-8">
               <div className="flex flex-col">
                  <span className="text-2xl font-bold text-neutral-950">20%</span>
                  <span className="text-[10px] uppercase font-bold text-neutral-800 tracking-widest">More Earnings</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl font-bold text-neutral-950">Live</span>
                  <span className="text-[10px] uppercase font-bold text-neutral-800 tracking-widest">Tracking</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl font-bold text-neutral-950">2k+</span>
                  <span className="text-[10px] uppercase font-bold text-neutral-800 tracking-widest">Drivers Joined</span>
               </div>
            </div>
          </div>
          <Link to="/register" className="px-10 py-5 bg-neutral-950 text-amber-500 hover:bg-white hover:text-neutral-950 transition-all rounded-3xl font-bold text-lg shadow-2xl active:scale-95 group-hover:px-12 border border-white/10 text-center">
            Register as Operator
          </Link>
        </div>
      </div>
    </section>
  );
}
