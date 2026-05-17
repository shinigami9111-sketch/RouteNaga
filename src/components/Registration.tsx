import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Truck, 
  User, 
  Phone, 
  MapPin, 
  ClipboardList, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Briefcase,
  IdCard,
  CarFront
} from "lucide-react";

enum RegistrationStep {
  PROFILE = 1,
  VEHICLE = 2,
  DOCUMENTS = 3,
  SUCCESS = 4
}

export function Registration() {
  const [step, setStep] = useState<RegistrationStep>(RegistrationStep.PROFILE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(RegistrationStep.SUCCESS);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-500">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 rounded-full font-black text-[10px] uppercase tracking-widest mb-4 border border-amber-200 dark:border-amber-500/20"
          >
            <Truck size={12} />
            Partner Registration
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-100 tracking-tight mb-4">Join the Network</h1>
          <p className="text-stone-500 dark:text-stone-400 font-medium">Start earning more with Nagaland's premier transport platform.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-stone-200 dark:bg-stone-800 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-[2px] bg-amber-500 -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
          
          {[1, 2, 3].map((s) => (
            <div key={s} className="relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= s ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-600'
              }`}>
                {step > s ? <CheckCircle2 size={20} /> : <span className="font-black">{s}</span>}
              </div>
              <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                step >= s ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400 dark:text-stone-600'
              }`}>
                {s === 1 ? 'Profile' : s === 2 ? 'Vehicle' : 'Security'}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-[3rem] shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-100 dark:border-stone-800 overflow-hidden transition-colors">
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {step === RegistrationStep.PROFILE && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 dark:text-stone-600" size={18} />
                        <input 
                          type="text" 
                          placeholder="Proprietor Name"
                          className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-medium text-stone-900 dark:text-stone-100"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-1">Phone Number</label>
                       <div className="relative">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 dark:text-stone-600" size={18} />
                         <input 
                           type="tel" 
                           placeholder="+91"
                           className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-medium text-stone-900 dark:text-stone-100"
                         />
                       </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-1">Operating Region</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 dark:text-stone-600" size={18} />
                      <select className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-medium appearance-none text-stone-900 dark:text-stone-100">
                        <option>Kohima</option>
                        <option>Dimapur</option>
                        <option>Mokokchung</option>
                        <option>Wokha</option>
                        <option>Tuensang</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === RegistrationStep.VEHICLE && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-1">Vehicle Type</label>
                      <div className="relative">
                        <CarFront className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 dark:text-stone-600" size={18} />
                        <select className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-medium appearance-none text-stone-900 dark:text-stone-100">
                          <option>Tata Sumo</option>
                          <option>Winger</option>
                          <option>Bus (Standard)</option>
                          <option>Bus (Premier)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-1">Vehicle Number</label>
                      <div className="relative">
                        <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 dark:text-stone-600" size={18} />
                        <input 
                          type="text" 
                          placeholder="NL 01 X XXXX"
                          className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-black uppercase text-stone-900 dark:text-stone-100"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-500/5 p-6 rounded-2xl border border-amber-100 dark:border-amber-500/10 flex gap-4">
                    <Briefcase className="text-amber-600 dark:text-amber-500 shrink-0" size={24} />
                    <div>
                      <p className="text-stone-900 dark:text-stone-100 font-bold mb-1">Fleet Management</p>
                      <p className="text-stone-500 dark:text-stone-400 text-sm">Registering more than 5 vehicles? Contact our enterprise desk for custom dashboard access.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === RegistrationStep.DOCUMENTS && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl hover:border-amber-500 dark:hover:border-amber-500 transition-colors group cursor-pointer text-center">
                      <IdCard className="mx-auto mb-4 text-stone-300 dark:text-stone-700 group-hover:text-amber-500" size={32} />
                      <p className="font-bold text-stone-900 dark:text-stone-100">Driving License</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-stone-400 dark:text-stone-500 mt-2">Upload Front & Back</p>
                    </div>
                    <div className="p-8 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl hover:border-amber-500 dark:hover:border-amber-500 transition-colors group cursor-pointer text-center">
                      <ShieldCheck className="mx-auto mb-4 text-stone-300 dark:text-stone-700 group-hover:text-amber-500" size={32} />
                      <p className="font-bold text-stone-900 dark:text-stone-100">RC Book</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-stone-400 dark:text-stone-500 mt-2">Registration Copy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-500 rounded-2xl border border-emerald-100 dark:border-emerald-500/10">
                    <CheckCircle2 size={20} />
                    <p className="text-xs font-bold uppercase tracking-widest">Digital KYC will be processed within 24 hours</p>
                  </div>
                </motion.div>
              )}

              {step === RegistrationStep.SUCCESS && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
                    <CheckCircle2 size={48} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-stone-900 dark:text-stone-100 mb-4">Application Submitted!</h2>
                  <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-md mx-auto">
                    Our verification team will review your documents and contact you on your registered phone number.
                  </p>
                  <button 
                     onClick={() => window.location.href = '/'}
                     className="px-8 py-4 bg-neutral-900 dark:bg-amber-500 text-white dark:text-stone-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-amber-400 transition-all"
                  >
                    Back to Home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {step < RegistrationStep.SUCCESS && (
              <div className="mt-12 flex items-center justify-between">
                <button 
                  onClick={prevStep}
                  className={`px-8 py-4 font-black text-xs uppercase tracking-widest transition-all ${
                    step === 1 ? 'opacity-0 pointer-events-none' : 'text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  Back
                </button>
                <button 
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-neutral-900 dark:bg-amber-500 hover:bg-black dark:hover:bg-amber-400 text-white dark:text-stone-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Processing...'
                  ) : (
                    <>
                      {step === 3 ? 'Complete Setup' : 'Next Step'}
                      <ArrowRight size={16} className="text-amber-500 dark:text-stone-950" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="text-center">
              <p className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-1">0%</p>
              <p className="text-[9px] font-black uppercase text-stone-400 dark:text-stone-500 tracking-widest">Platform Fees (First Month)</p>
           </div>
           <div className="text-center">
              <p className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-1">24/7</p>
              <p className="text-[9px] font-black uppercase text-stone-400 dark:text-stone-500 tracking-widest">Emergency Assistance</p>
           </div>
           <div className="text-center">
              <p className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-1">Weekly</p>
              <p className="text-[9px] font-black uppercase text-stone-400 dark:text-stone-500 tracking-widest">Payout Cycles</p>
           </div>
        </div>
      </div>
    </div>
  );
}
