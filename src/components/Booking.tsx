import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Ticket, MapPin, Calendar, Clock, Download, Share2, ShieldCheck, ChevronRight, History, QrCode, Trash2, AlertCircle, Plus } from "lucide-react";
import { domToCanvas } from "modern-screenshot";
import { jsPDF } from "jspdf";
import { supabase } from "../lib/supabase";

interface BookedTicket {
  id: string;
  pnr: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seat: string;
  status: "confirmed" | "completed" | "in-transit";
  type: "Sumo" | "Bus";
  price: number;
}

const MY_BOOKINGS: BookedTicket[] = [
  {
    id: "1",
    pnr: "RN-8829-KHM",
    from: "Dimapur",
    to: "Kohima",
    date: "12 May, 2024",
    time: "07:30 AM",
    seat: "F1 (Front Row)",
    status: "confirmed",
    type: "Sumo",
    price: 350
  },
  {
    id: "2",
    pnr: "RN-4122-MKG",
    from: "Kohima",
    to: "Mokokchung",
    date: "15 May, 2024",
    time: "06:00 AM",
    seat: "B12 (Window)",
    status: "confirmed",
    type: "Bus",
    price: 650
  }
];

const PAST_BOOKINGS: BookedTicket[] = [
  {
    id: "3",
    pnr: "RN-2291-ZUN",
    from: "Dimapur",
    to: "Zunheboto",
    date: "02 May, 2024",
    time: "06:30 AM",
    seat: "M3",
    status: "completed",
    type: "Sumo",
    price: 800
  }
];

export function Booking() {
  const navigate = useNavigate();
  const [activeBookings, setActiveBookings] = useState<BookedTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [ticketToCancel, setTicketToCancel] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setActiveBookings(data as BookedTicket[]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Fallback to local storage if DB fails or for legacy support
      const saved = localStorage.getItem('my-bookings');
      if (saved) {
        try {
          setActiveBookings(JSON.parse(saved));
        } catch (e) {
          setActiveBookings(MY_BOOKINGS);
        }
      } else {
        setActiveBookings(MY_BOOKINGS);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (id: string) => {
    setTicketToCancel(id);
  };

  const confirmCancel = async () => {
    if (!ticketToCancel) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', ticketToCancel);

      if (error) throw error;

      const updated = activeBookings.filter(ticket => ticket.id !== ticketToCancel);
      setActiveBookings(updated);
      localStorage.setItem('my-bookings', JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting booking:', error);
      // Local fallback
      const updated = activeBookings.filter(ticket => ticket.id !== ticketToCancel);
      setActiveBookings(updated);
      localStorage.setItem('my-bookings', JSON.stringify(updated));
    } finally {
      setTicketToCancel(null);
    }
  };

  const handleDownload = async (ticket: BookedTicket) => {
    const ticketId = `ticket-${ticket.id}`;
    const ticketElement = document.getElementById(ticketId);
    if (!ticketElement) return;

    try {
      const canvas = await domToCanvas(ticketElement, {
        scale: 2,
        backgroundColor: "#1c1917", // Stone-900 equivalent
      });

      const imgData = canvas.toDataURL('image/png');
      const isLandscape = canvas.width > canvas.height;
      
      const pdf = new jsPDF({
        orientation: isLandscape ? 'l' : 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`RouteNaga-Booking-${ticket.pnr}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 pt-32 pb-20 px-4 md:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-8 h-[2px] bg-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Personal Travel Cloud</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-stone-900 dark:text-white tracking-tighter uppercase leading-[0.9]"
          >
            MY BOOKED <br />
            <span className="text-amber-600">TICKETS</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Active Tickets */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 mb-6 flex items-center gap-3">
              Upcoming Journeys
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {activeBookings.length > 0 ? (
                  activeBookings.map((ticket, idx) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: -50 }}
                      transition={{ 
                        opacity: { duration: 0.2 },
                        layout: { duration: 0.3 }
                      }}
                      layout
                      id={`ticket-${ticket.id}`}
                      className="bg-stone-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative group"
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-colors" />
                      
                      <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center relative z-10">
                        {/* Left: Route Info */}
                        <div className="flex-1 space-y-8 w-full">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-amber-500 text-neutral-950 text-[10px] font-black uppercase rounded-full">
                                  {ticket.type}
                                </span>
                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                                  PNR: <span className="text-white">{ticket.pnr}</span>
                                </span>
                              </div>
                              <button 
                                onClick={() => handleCancelClick(ticket.id)}
                                className="md:hidden p-2 text-stone-500 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                           </div>

                           <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                 <span className="text-stone-500 text-[10px] font-black uppercase tracking-widest mb-1">Departure</span>
                                 <span className="text-2xl font-black text-white">{ticket.from}</span>
                              </div>
                              <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform px-4">
                                 <div className="w-12 h-[1px] bg-stone-700 relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                 </div>
                              </div>
                              <div className="flex flex-col items-end">
                                 <span className="text-stone-500 text-[10px] font-black uppercase tracking-widest mb-1">Arrival</span>
                                 <span className="text-2xl font-black text-white">{ticket.to}</span>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                              <div className="flex items-center gap-3">
                                 <Calendar size={16} className="text-amber-500" />
                                 <span className="text-xs font-bold text-stone-300">{ticket.date}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <Clock size={16} className="text-amber-500" />
                                 <span className="text-xs font-bold text-stone-300">{ticket.time}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <ShieldCheck size={16} className="text-amber-500" />
                                 <span className="text-xs font-bold text-stone-300">{ticket.seat}</span>
                              </div>
                           </div>
                        </div>

                        {/* Right: Actions / QR Placeholder */}
                        <div 
                          data-html2canvas-ignore
                          className="w-full md:w-40 flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-[2rem] gap-6"
                        >
                           <div className="relative group/qr">
                             <QrCode size={56} className="text-stone-500 opacity-50 group-hover/qr:text-amber-500 group-hover/qr:opacity-100 transition-all" />
                           </div>
                           <button 
                             onClick={() => handleCancelClick(ticket.id)}
                             className="w-full py-2.5 border border-red-500/20 hover:bg-red-500/10 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                           >
                             <Trash2 size={12} /> Cancel Ticket
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-stone-50 dark:bg-stone-900/50 border border-dashed border-stone-200 dark:border-stone-800 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6">
                      <AlertCircle size={32} className="text-stone-300" />
                    </div>
                    <h3 className="text-xl font-black text-stone-900 dark:text-white uppercase tracking-tighter mb-2">No Active Bookings</h3>
                    <p className="text-stone-400 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto">You don't have any scheduled journeys. Start exploring to book your next trip!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[2.5rem] p-10">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-8 flex items-center gap-2">
                 <History size={14} /> Journey History
               </h3>
               
               <div className="space-y-6">
                  {PAST_BOOKINGS.map(ticket => (
                    <div key={ticket.id} className="group cursor-default">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-stone-900 dark:text-white font-bold text-sm tracking-tight">{ticket.from} → {ticket.to}</span>
                          <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">Completed</span>
                       </div>
                       <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{ticket.date} • ₹{ticket.price}</p>
                       <div className="h-[1px] w-full bg-stone-100 dark:bg-stone-800 mt-4 group-hover:bg-amber-500/30 transition-colors" />
                    </div>
                  ))}
               </div>

               <button className="w-full mt-10 py-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-amber-600 hover:border-amber-500/30 transition-all flex items-center justify-center gap-2">
                  Archive Management <ChevronRight size={12} />
               </button>
             </div>

             <button 
                onClick={() => navigate('/routes')}
                className="w-full bg-stone-900 rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group text-left hover:border-amber-500/50 transition-all"
              >
                <div className="absolute top-0 right-0 p-6 text-amber-500/20 group-hover:text-amber-500 transition-transform group-hover:scale-110">
                   <Ticket size={48} />
                </div>
                <div className="relative z-10">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-2">Buy New <br />Ticket</h3>
                   <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-6">Explore Nagaland routes</p>
                   <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center group-hover:bg-amber-400 transition-colors">
                     <Plus className="text-stone-900" size={20} />
                   </div>
                </div>
             </button>
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <AnimatePresence>
        {ticketToCancel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTicketToCancel(null)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-stone-900 w-full max-w-md rounded-[2.5rem] p-10 relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="text-red-500" size={32} />
                </div>
                <h3 className="text-2xl font-black text-stone-900 dark:text-white uppercase tracking-tighter mb-4">Cancel Journey?</h3>
                <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed mb-8">
                  Are you sure you want to cancel this booking? This action cannot be undone and your seat will be released.
                </p>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={confirmCancel}
                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                  >
                    Confirm Cancellation
                  </button>
                  <button 
                    onClick={() => setTicketToCancel(null)}
                    className="w-full py-4 bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-stone-200 dark:hover:bg-stone-700 transition-all"
                  >
                    Keep My Ticket
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
