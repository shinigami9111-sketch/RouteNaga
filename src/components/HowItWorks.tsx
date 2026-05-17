import { Search, Info, MessageSquare, Ticket, Send } from "lucide-react";
import { motion } from "motion/react";

export function HowItWorks() {
  const steps = [
    { title: "Search a Route", desc: "Enter your origin and destination to see available transport options.", icon: Search },
    { title: "Check Availability", desc: "See live seat counts and boarding status for your preferred vehicle.", icon: Info },
    { title: "AI Advice", desc: "Chat with the AI companion for weather updates and travel tips.", icon: MessageSquare },
    { title: "Book a Seat", desc: "Secure your spot instantly with our easy digital booking system.", icon: Ticket },
    { title: "Travel Safely", desc: "Receive real-time alerts and travel with peace of mind.", icon: Send },
  ];

  return (
    <section className="py-24 px-6 bg-white dark:bg-stone-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-display font-medium mb-4 text-stone-900 dark:text-stone-100">How It Works</h2>
          <p className="text-stone-500 dark:text-stone-400 text-lg">Your journey across Nagaland, simplified in five simple steps.</p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-stone-200 dark:bg-stone-800 -translate-y-1/2 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative z-10 text-center"
              >
                <div className="w-16 h-16 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm text-amber-600 group hover:border-amber-500 transition-colors">
                  <step.icon size={28} />
                </div>
                <div className="px-4">
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Step 0{idx + 1}</div>
                  <h3 className="text-xl font-medium mb-4 text-stone-900 dark:text-stone-100">{step.title}</h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
