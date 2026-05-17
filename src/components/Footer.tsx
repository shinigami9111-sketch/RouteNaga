import { Map, Facebook, Twitter, Instagram, Mail, Phone, ExternalLink, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import logoRN from "../logoRN.png";

export function Footer() {
  return (
    <footer className="bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-16 px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 group">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <img src={logoRN} alt="RouteNaga Logo" className="w-full h-full object-contain relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-none">RouteNaga</span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-600 mt-1">Smart Travel</span>
              </div>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-sm mb-6">
              Nagaland's first AI-powered transport network. Connecting Kohima, Dimapur, and beyond with safety and efficiency.
            </p>
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500 hover:text-amber-600 dark:hover:text-amber-500 cursor-pointer transition-colors border border-stone-200 dark:border-stone-700"><Facebook size={16} /></div>
              <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500 hover:text-amber-600 dark:hover:text-amber-500 cursor-pointer transition-colors border border-stone-200 dark:border-stone-700"><Instagram size={16} /></div>
              <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500 hover:text-amber-600 dark:hover:text-amber-500 cursor-pointer transition-colors border border-stone-200 dark:border-stone-700"><Twitter size={16} /></div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500 mb-6 underline decoration-amber-500 decoration-2 underline-offset-8">Quick Links</h4>
            <ul className="space-y-4">
              {['Routes', 'Tourist', 'Safety', 'About'].map(item => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-amber-600 transition-colors uppercase tracking-widest">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500 mb-6 underline decoration-amber-500 decoration-2 underline-offset-8">For Partners</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/register" className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 hover:text-amber-600 transition-colors uppercase tracking-widest group">
                  <Truck size={14} className="text-amber-500 group-hover:scale-110 transition-transform" />
                  Owner Registration
                </Link>
              </li>
              <li>
                <Link to="/register" className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 hover:text-amber-600 transition-colors uppercase tracking-widest group">
                  <Truck size={14} className="text-amber-500 group-hover:scale-110 transition-transform opacity-30" />
                  Driver Onboarding
                </Link>
              </li>
              <li className="pt-2">
                <span className="text-[9px] font-black uppercase text-stone-300 dark:text-stone-600 tracking-[0.2em] italic">Manage your fleet today</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-10 gap-6">
          <div className="flex gap-8 text-[10px] text-stone-400 dark:text-stone-500 font-bold tracking-widest uppercase items-center">
            <span className="flex items-center gap-2 border-r border-stone-200 dark:border-stone-800 pr-8 italic">Status: <span className="text-emerald-500 not-italic flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> All Routes Active</span></span>
            <span className="flex items-center gap-2 font-black">Dimapur <span className="text-stone-900 dark:text-stone-200 not-italic">28°C</span></span>
            <span className="flex items-center gap-2 font-black">Kohima <span className="text-stone-900 dark:text-stone-200 not-italic">18°C</span></span>
          </div>
          <p className="text-[10px] text-stone-300 dark:text-stone-700 font-bold uppercase tracking-widest">© 2026 RouteNaga Tech. Built for Nagaland.</p>
        </div>
      </div>
    </footer>
  );
}
