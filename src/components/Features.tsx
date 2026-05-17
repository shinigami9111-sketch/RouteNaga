import { Shield, Zap, Globe, Smartphone, Cloud, Bell, Users, Search, Map, Ticket, Heart, Clock } from "lucide-react";
import { motion } from "motion/react";

export function Features() {
  const features = [
    { title: "Online Seat Booking", desc: "Reserve your seat from anywhere in Nagaland with just a few taps.", icon: Ticket },
    { title: "Real-time Availability", desc: "No more waiting at stands. See live seat counts for Sumos and buses.", icon: Users },
    { title: "Smart Predictions", desc: "AI algorithms predict departure times based on passenger flow.", icon: Zap },
    { title: "Chalo Ai Travel Assistant", desc: "Your personal guide for routes, weather, and local tourism.", icon: Globe },
    { title: "Weather Planning", desc: "Get route suggestions that avoid landslide-prone areas during monsoon.", icon: Cloud },
    { title: "Tourist Recommendations", desc: "Recommendations curated by Chalo Ai based on the current season.", icon: Map },
    { title: "Emergency Support", desc: "24/7 SOS and safety monitoring for every trip.", icon: Shield },
    { title: "Route Management", desc: "Advanced tools for transport operators and drivers.", icon: Smartphone },
    { title: "Live Notifications", desc: "Stay updated on delays, road closures, and boarding status.", icon: Bell },
    { title: "Mobile Friendly", desc: "A seamless experience on any device, optimized for local networks.", icon: Smartphone },
    { title: "Offline Fallback", desc: "Access essential route info even with spotty connectivity.", icon: Clock },
    { title: "Digital Tickets", desc: "Environmentally friendly and impossible to lose.", icon: Heart },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-white dark:bg-stone-950 text-stone-900 duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-medium mb-4 text-stone-900 dark:text-stone-100">Powerful Features for Nagaland</h2>
          <p className="text-stone-500 dark:text-stone-400 text-lg max-w-2xl mx-auto">
            We've combined local transport insights with modern AI to solve Nagaland's unique travel challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="p-8 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl hover:border-amber-500 dark:hover:border-amber-500 hover:bg-white dark:hover:bg-stone-800 transition-all group shadow-sm"
            >
              <div className="w-12 h-12 bg-amber-500/10 dark:bg-amber-500/5 text-amber-600 dark:text-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-neutral-950 dark:group-hover:text-stone-950 transition-colors">
                <f.icon size={24} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-stone-900 dark:text-stone-100">{f.title}</h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
