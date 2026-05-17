import { Route, VehicleType } from "../types";
import { Clock, Users, Shield, Search, TrendingUp, X, CheckCircle2, Ticket, ArrowRight, CreditCard, Armchair, Calendar, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { ROUTES, LOCATIONS } from "../transportData";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";
import logoRN from "../logoRN.png";
import { domToCanvas } from "modern-screenshot";
import { jsPDF } from "jspdf";
import { supabase } from "../lib/supabase";

interface Seat {
  id: string;
  label: string;
  isAvailable: boolean;
  row: number;
}

export function RouteFinder() {
  const [searchParams] = useSearchParams();
  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [vehicle, setVehicle] = useState<VehicleType | "all">((searchParams.get("vehicle") as VehicleType) || "all");
  const [results, setResults] = useState<Route[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [lastBooking, setLastBooking] = useState<{
    route: Route;
    seats: string[];
    bookingId: string;
    date: string;
  } | null>(null);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatMap, setSeatMap] = useState<Seat[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadToast, setShowDownloadToast] = useState(false);

  const [highlightCategory, setHighlightCategory] = useState<"all" | "taken" | "available" | "selected">("all");

  const generateSeatMap = (route: Route) => {
    let allSeats: Seat[] = [];
    
    if (route.vehicleType === VehicleType.SUMO) {
      allSeats = [
        { id: "front", label: "Front", isAvailable: true, row: 0 },
        { id: "m1", label: "M1", isAvailable: true, row: 1 },
        { id: "m2", label: "M2", isAvailable: true, row: 1 },
        { id: "m3", label: "M3", isAvailable: true, row: 1 },
        { id: "b1", label: "B1", isAvailable: true, row: 2 },
        { id: "b2", label: "B2", isAvailable: true, row: 2 },
        { id: "b3", label: "B3", isAvailable: true, row: 2 },
      ];
    } else if (route.vehicleType === VehicleType.BUS) {
      // Front row: 2 seats (as requested)
      allSeats.push({ id: "f1", label: "F1", isAvailable: true, row: 0 });
      allSeats.push({ id: "f2", label: "F2", isAvailable: true, row: 0 });

      // Left Column (16 seats, 8 rows of 2)
      for (let r = 1; r <= 8; r++) {
        allSeats.push({ id: `l${r}a`, label: `L${r}A`, isAvailable: true, row: r, col: 'left' } as any);
        allSeats.push({ id: `l${r}b`, label: `L${r}B`, isAvailable: true, row: r, col: 'left' } as any);
      }

      // Right Column (16 seats, 8 rows of 2)
      for (let r = 1; r <= 8; r++) {
        allSeats.push({ id: `r${r}a`, label: `R${r}A`, isAvailable: true, row: r, col: 'right' } as any);
        allSeats.push({ id: `r${r}b`, label: `R${r}B`, isAvailable: true, row: r, col: 'right' } as any);
      }

      // Back Row (5 seats)
      for (let i = 1; i <= 5; i++) {
        allSeats.push({ id: `back${i}`, label: `B${i}`, isAvailable: true, row: 9 });
      }
      
      // Total so far: 2 + 16 + 16 + 5 = 39. 
      // Adding 1 extra cabin seat to reachable exactly 40.
      allSeats.push({ id: "extra", label: "EX", isAvailable: true, row: 0 });
    }

    const numToBlock = Math.max(0, allSeats.length - route.availableSeats);
    const indices = Array.from({ length: allSeats.length }, (_, i) => i);
    const shuffledIndices = indices.sort(() => Math.random() - 0.5);
    const blockedIndices = shuffledIndices.slice(0, numToBlock);

    const finalMap = allSeats.map((s, idx) => ({
      ...s,
      isAvailable: !blockedIndices.includes(idx)
    }));

    setSeatMap(finalMap);
  };

  const handleBookClick = (route: Route) => {
    setSelectedRoute(route);
    setSelectedSeats([]);
    setShowSeatSelection(false);
    generateSeatMap(route);
  };

  const performSearch = (f: string, t: string, v: string) => {
    let filtered = ROUTES;
    if (f) filtered = filtered.filter(r => r.from.toLowerCase() === f.toLowerCase());
    if (t) filtered = filtered.filter(r => r.to.toLowerCase() === t.toLowerCase());
    if (v !== "all") filtered = filtered.filter(r => r.vehicleType === v);
    
    setResults(filtered);
    setHasSearched(true);
  };

  useEffect(() => {
    const f = searchParams.get("from") || "";
    const t = searchParams.get("to") || "";
    const v = (searchParams.get("vehicle") as VehicleType) || "all";
    
    setFrom(f);
    setTo(t);
    setVehicle(v);
    performSearch(f, t, v);
  }, [searchParams]);

  const handleSearch = () => {
    performSearch(from, to, vehicle);
  };

  const resetFilters = () => {
    setFrom("");
    setTo("");
    setVehicle("all");
    setResults(ROUTES);
    setHasSearched(false);
  };

  const confirmBooking = async () => {
    // Simulate booking process
    const bookingDetails = {
      route: selectedRoute!,
      seats: selectedSeats,
      bookingId: `RN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const newBooking = {
      pnr: bookingDetails.bookingId,
      from: selectedRoute!.from,
      to: selectedRoute!.to,
      date: selectedRoute!.departureDate,
      time: selectedRoute!.departureTime,
      seat: selectedSeats.length > 0 ? selectedSeats.join(", ") : "Assigned",
      status: "confirmed",
      type: selectedRoute!.vehicleType,
      price: selectedSeats.length > 0 ? selectedSeats.length * selectedRoute!.price : selectedRoute!.price
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from('bookings').insert({
          ...newBooking,
          user_id: user.id,
          created_at: new Date().toISOString()
        });
        if (error) throw error;
      }
    } catch (err) {
      console.error("Database save failed, using local storage:", err);
    }

    // Persist to localStorage for fallback
    const existingRaw = localStorage.getItem('my-bookings');
    let existing = [];
    try {
      existing = existingRaw ? JSON.parse(existingRaw) : [];
    } catch (e) {
      existing = [];
    }
    
    localStorage.setItem('my-bookings', JSON.stringify([...existing, { ...newBooking, id: Date.now().toString() }]));
    
    setTimeout(() => {
      setLastBooking(bookingDetails);
      setIsBookingSuccess(true);
      setSelectedRoute(null);
    }, 800);
  };

  const handleDownloadTicket = async () => {
    const ticketId = 'digital-ticket';
    const ticketElement = document.getElementById(ticketId);
    if (!ticketElement || isDownloading) return;

    try {
      setIsDownloading(true);
      const canvas = await domToCanvas(ticketElement, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const isLandscape = canvas.width > canvas.height;

      const pdf = new jsPDF({
        orientation: isLandscape ? 'l' : 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const fileName = `RouteNaga-Ticket-${lastBooking?.bookingId || 'Ticket'}.pdf`;
      pdf.save(fileName);
      
      // Show success toast
      setShowDownloadToast(true);
      setTimeout(() => setShowDownloadToast(false), 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleSeat = (seatId: string) => {
    setSelectedSeats(prev => {
      const isSelecting = !prev.includes(seatId);
      if (isSelecting && prev.length >= (selectedRoute?.availableSeats || 0)) {
        return prev; // Limit reached
      }
      return isSelecting 
        ? [...prev, seatId] 
        : prev.filter(id => id !== seatId);
    });
  };

  return (
    <section id="routes" className="pt-32 pb-24 px-6 bg-stone-50 dark:bg-stone-950 min-h-screen transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-black mb-2 text-emerald-950 dark:text-stone-100 tracking-tighter">Available Routes</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm">Real-time availability for Nagaland's primary transport network.</p>
          </div>
          <div className="flex gap-2">
             <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest leading-none">Live Network Active</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 rounded-[2.5rem] sticky top-24 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 dark:text-stone-500">Filter Routes</h3>
                {(from || to || vehicle !== "all") && (
                  <button 
                    onClick={resetFilters}
                    className="text-[10px] font-bold text-amber-600 hover:text-amber-700 transition-colors uppercase tracking-widest"
                  >
                    Reset
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase text-stone-400 dark:text-stone-500 font-black mb-2 ml-2 tracking-widest">Origin</label>
                  <select 
                    value={from} 
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 text-stone-900 dark:text-stone-100 outline-none transition-all appearance-none"
                  >
                    <option value="">Any Origin</option>
                    {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-stone-400 dark:text-stone-500 font-black mb-2 ml-2 tracking-widest">Destination</label>
                  <select 
                    value={to} 
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 text-stone-900 dark:text-stone-100 outline-none transition-all appearance-none"
                  >
                    <option value="">Any Destination</option>
                    {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-stone-400 dark:text-stone-500 font-black mb-2 ml-2 tracking-widest">Vehicle Type</label>
                  <select 
                    value={vehicle} 
                    onChange={(e) => setVehicle(e.target.value as VehicleType | "all")}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 text-stone-900 dark:text-stone-100 outline-none transition-all appearance-none"
                  >
                    <option value="all">All Vehicles</option>
                    {Object.values(VehicleType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <button 
                  onClick={handleSearch}
                  className="w-full bg-stone-900 dark:bg-amber-500 hover:bg-emerald-950 dark:hover:bg-amber-400 text-white dark:text-stone-950 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl shadow-stone-900/10 dark:shadow-amber-500/10 flex items-center justify-center gap-2"
                >
                  <Search size={16} />
                  Apply Filter
                </button>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((route) => (
                    <motion.div
                      key={route.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 rounded-[2.5rem] hover:border-emerald-500/30 dark:hover:border-amber-500/30 transition-all relative shadow-sm"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-2xl font-black text-emerald-950 dark:text-stone-100 tracking-tight">{route.from}</span>
                            <div className="h-[2px] w-8 bg-stone-200 dark:bg-stone-800 rounded-full"></div>
                            <span className="text-2xl font-black text-emerald-950 dark:text-stone-100 tracking-tight">{route.to}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                             <div className="flex items-center gap-2 text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
                                <TrendingUp size={12} />
                                {route.vehicleType}
                             </div>
                             {route.tags.map(tag => (
                               <span key={tag} className="text-[10px] bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 px-3 py-1.5 rounded-full uppercase font-black border border-amber-100 dark:border-amber-500/20 tracking-tighter">{tag}</span>
                             ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 md:gap-10 text-sm">
                          <div className="text-center">
                            <p className="text-[10px] uppercase font-black text-stone-400 dark:text-stone-500 mb-1 tracking-widest">Date</p>
                            <p className="font-mono text-stone-900 dark:text-stone-100 font-bold text-base">{route.departureDate}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] uppercase font-black text-stone-400 dark:text-stone-500 mb-1 tracking-widest">Departure</p>
                            <p className="font-mono text-emerald-600 dark:text-emerald-400 font-black text-lg">{route.departureTime}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] uppercase font-black text-stone-400 dark:text-stone-500 mb-1 tracking-widest">Ticket</p>
                            <p className="font-black text-stone-900 dark:text-stone-100 text-lg">₹{route.price}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] uppercase font-black text-stone-400 dark:text-stone-500 mb-1 tracking-widest">Seats</p>
                            <p className={`font-black text-lg ${route.availableSeats < 3 ? 'text-orange-500' : 'text-amber-600'}`}>{route.availableSeats}</p>
                          </div>
                          <button 
                            onClick={() => handleBookClick(route)}
                            className="bg-emerald-950 dark:bg-amber-500 text-white dark:text-stone-950 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-900 dark:hover:bg-amber-400 transition-all shadow-lg shadow-emerald-950/10 dark:shadow-amber-500/10 active:scale-95"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-stone-900 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center opacity-60"
                >
                  <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 text-stone-300 dark:text-stone-600">
                    <Search size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-2">No Routes Found</h3>
                  <p className="text-stone-500 dark:text-stone-400 max-w-xs mb-8">We couldn't find any transport matching your current filters. Try searching for other districts.</p>
                  <button 
                    onClick={resetFilters}
                    className="px-8 py-4 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-stone-800 dark:hover:bg-amber-400 transition-all"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <AnimatePresence>
        {selectedRoute && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoute(null)}
              className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`route-${selectedRoute.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-stone-900 tracking-tight">Confirm Booking</h3>
                  <button onClick={() => setSelectedRoute(null)} className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  {!showSeatSelection ? (
                    <div className="space-y-8">
                      <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100">
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Route Information</p>
                            <div className="flex items-center gap-4">
                              <span className="text-2xl font-black text-stone-900">{selectedRoute.from}</span>
                              <ArrowRight className="text-amber-500" size={20} />
                              <span className="text-2xl font-black text-stone-900">{selectedRoute.to}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Vehicle</p>
                            <span className="text-lg font-black text-amber-600 uppercase">{selectedRoute.vehicleType}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Date</p>
                            <div className="flex items-center gap-2 font-mono font-black text-stone-900 text-sm">
                              <Calendar size={14} className="text-amber-500" />
                              {selectedRoute.departureDate}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Departure</p>
                            <div className="flex items-center gap-2 font-mono font-black text-stone-900 text-sm">
                              <Clock size={14} className="text-emerald-500" />
                              {selectedRoute.departureTime}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Status</p>
                            <div className="flex items-center gap-2 font-black text-stone-900 text-sm">
                              <Users size={14} className="text-emerald-500" />
                              {selectedRoute.availableSeats} Left
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between px-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Standard Fare</p>
                          <p className="text-4xl font-black text-stone-900">₹{selectedRoute.price}</p>
                        </div>
                        <div className="text-[10px] bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-black border border-emerald-100 uppercase tracking-widest flex items-center gap-2">
                          <Shield size={12} />
                          Secure Booking
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          if (selectedRoute.vehicleType === VehicleType.SUMO || selectedRoute.vehicleType === VehicleType.BUS) {
                            setShowSeatSelection(true);
                          } else {
                            confirmBooking();
                          }
                        }}
                        className="w-full bg-neutral-900 hover:bg-black text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-stone-200"
                      >
                        {selectedRoute.vehicleType === VehicleType.SUMO || selectedRoute.vehicleType === VehicleType.BUS ? (
                          <>
                            <Armchair size={18} className="text-amber-500" />
                            Select & Book Seats
                          </>
                        ) : (
                          <>
                            <CreditCard size={18} />
                            Complete Reservation
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex gap-4">
                            <button 
                              onClick={() => setHighlightCategory(highlightCategory === "taken" ? "all" : "taken")}
                              className={`flex items-center gap-2 transition-all p-1 rounded-lg ${highlightCategory === "taken" ? "bg-stone-200" : ""}`}
                            >
                               <div className="w-3 h-3 bg-stone-900 border border-stone-800 rounded-sm"></div>
                               <span className="text-[9px] font-black uppercase text-stone-500">Taken</span>
                            </button>
                            <button 
                              onClick={() => setHighlightCategory(highlightCategory === "available" ? "all" : "available")}
                              className={`flex items-center gap-2 transition-all p-1 rounded-lg ${highlightCategory === "available" ? "bg-stone-200" : ""}`}
                            >
                               <div className="w-3 h-3 bg-white border border-stone-200 rounded-sm"></div>
                               <span className="text-[9px] font-black uppercase text-stone-500">Available</span>
                            </button>
                            <button 
                              onClick={() => setHighlightCategory(highlightCategory === "selected" ? "all" : "selected")}
                              className={`flex items-center gap-2 transition-all p-1 rounded-lg ${highlightCategory === "selected" ? "bg-stone-200" : ""}`}
                            >
                               <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
                               <span className="text-[9px] font-black uppercase text-stone-500">Selected</span>
                            </button>
                         </div>
                         <button 
                          onClick={() => {
                            setShowSeatSelection(false);
                            setHighlightCategory("all");
                          }}
                          className="text-[9px] font-black uppercase text-amber-600 tracking-widest border-b border-amber-600/30"
                         >
                            Back to Details
                         </button>
                      </div>

                      <div className="bg-stone-900 dark:bg-stone-950 rounded-[2rem] p-6 md:p-8 relative shadow-2xl border-4 border-stone-800 dark:border-stone-900 overflow-y-auto max-h-[400px] custom-scrollbar transition-colors">
                        {/* Decorative Cabin details */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-50" />
                        
                        {/* Dashboard / Steering Wheel */}
                        <div className="sticky top-0 z-20 pb-8 bg-stone-900/80 backdrop-blur-sm border-b border-white/5 mb-8 transition-colors">
                          <div className="absolute top-2 right-4 w-6 h-6 rounded-full border-2 border-amber-500/20 opacity-40"></div>
                          <div className="flex justify-between items-center">
                            <span className="text-[7px] font-black uppercase tracking-[0.3em] text-amber-500/60 font-black">RouteNaga Premier Fleet</span>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                              <span className="text-[6px] font-black uppercase text-emerald-500">Cabin Secured</span>
                            </div>
                          </div>
                        </div>

                        {selectedRoute.vehicleType === VehicleType.SUMO ? (
                          <div className="space-y-8 max-w-[240px] mx-auto relative z-10">
                            {/* Sumo Front Row */}
                            <div className="flex justify-between items-center gap-12">
                              <SeatButton 
                                seat={seatMap.find(s => s.id === "front")!} 
                                isSelected={selectedSeats.includes("front")}
                                onToggle={() => toggleSeat("front")}
                                highlight={highlightCategory === "all" || (highlightCategory === "available" && seatMap.find(s => s.id === "front")?.isAvailable) || (highlightCategory === "taken" && !seatMap.find(s => s.id === "front")?.isAvailable) || (highlightCategory === "selected" && selectedSeats.includes("front"))}
                                size="small"
                                isDarkMode={true}
                              />
                              <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex flex-col items-center justify-center pointer-events-none transition-colors">
                                <Users size={12} className="text-stone-500 mb-0.5" />
                                <span className="text-[6px] font-black uppercase text-stone-600">Captain</span>
                              </div>
                            </div>
                            {/* Sumo Middle Row */}
                            <div className="flex justify-between gap-3">
                              {seatMap.filter(s => s.row === 1).map(s => (
                                <SeatButton key={s.id} seat={s} isSelected={selectedSeats.includes(s.id)} highlight={highlightCategory === "all" || (highlightCategory === "available" && s.isAvailable) || (highlightCategory === "taken" && !s.isAvailable) || (highlightCategory === "selected" && selectedSeats.includes(s.id))} onToggle={() => toggleSeat(s.id)} size="small" isDarkMode={true} />
                              ))}
                            </div>
                            {/* Sumo Back Row */}
                            <div className="flex justify-between gap-3">
                              {seatMap.filter(s => s.row === 2).map(s => (
                                <SeatButton key={s.id} seat={s} isSelected={selectedSeats.includes(s.id)} highlight={highlightCategory === "all" || (highlightCategory === "available" && s.isAvailable) || (highlightCategory === "taken" && !s.isAvailable) || (highlightCategory === "selected" && selectedSeats.includes(s.id))} onToggle={() => toggleSeat(s.id)} size="small" isDarkMode={true} />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4 max-w-[280px] mx-auto relative z-10">
                            {/* Bus Front Row */}
                            <div className="flex justify-between items-center mb-8 pr-2">
                              <div className="flex gap-2">
                                {seatMap.filter(s => s.row === 0).map(s => (
                                  <SeatButton key={s.id} seat={s} isSelected={selectedSeats.includes(s.id)} highlight={highlightCategory === "all" || (highlightCategory === "available" && s.isAvailable) || (highlightCategory === "taken" && !s.isAvailable) || (highlightCategory === "selected" && selectedSeats.includes(s.id))} onToggle={() => toggleSeat(s.id)} size="tiny" isDarkMode={true} />
                                ))}
                              </div>
                              <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex flex-col items-center justify-center pointer-events-none transition-colors">
                                <Users size={12} className="text-stone-500" />
                                <span className="text-[5px] font-black uppercase text-stone-600">Captain</span>
                              </div>
                            </div>

                            {/* Bus Main Columns */}
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(rowNum => (
                              <div key={rowNum} className="flex justify-between items-center gap-6">
                                <div className="flex gap-2">
                                  {seatMap.filter(s => s.row === rowNum && (s as any).col === 'left').map(s => (
                                    <SeatButton key={s.id} seat={s} isSelected={selectedSeats.includes(s.id)} highlight={highlightCategory === "all" || (highlightCategory === "available" && s.isAvailable) || (highlightCategory === "taken" && !s.isAvailable) || (highlightCategory === "selected" && selectedSeats.includes(s.id))} onToggle={() => toggleSeat(s.id)} size="tiny" isDarkMode={true} />
                                  ))}
                                </div>
                                <div className="h-4 w-8 bg-black/40 rounded flex items-center justify-center transition-colors">
                                  <div className="w-[1px] h-full bg-white/5"></div>
                                </div>
                                <div className="flex gap-2">
                                  {seatMap.filter(s => s.row === rowNum && (s as any).col === 'right').map(s => (
                                    <SeatButton key={s.id} seat={s} isSelected={selectedSeats.includes(s.id)} highlight={highlightCategory === "all" || (highlightCategory === "available" && s.isAvailable) || (highlightCategory === "taken" && !s.isAvailable) || (highlightCategory === "selected" && selectedSeats.includes(s.id))} onToggle={() => toggleSeat(s.id)} size="tiny" isDarkMode={true} />
                                  ))}
                                </div>
                              </div>
                            ))}

                            {/* Bus Back Row */}
                            <div className="flex justify-center gap-1.5 pt-6 border-t border-white/5 mt-4 transition-colors">
                              {seatMap.filter(s => s.row === 9).map(s => (
                                <SeatButton key={s.id} seat={s} isSelected={selectedSeats.includes(s.id)} highlight={highlightCategory === "all" || (highlightCategory === "available" && s.isAvailable) || (highlightCategory === "taken" && !s.isAvailable) || (highlightCategory === "selected" && selectedSeats.includes(s.id))} onToggle={() => toggleSeat(s.id)} size="tiny" isDarkMode={true} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Selected</p>
                              <p className="text-xl font-black text-stone-900">{selectedSeats.length > 0 ? selectedSeats.length : '0'} Seats</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total</p>
                              <p className="text-2xl font-black text-emerald-600">₹{selectedSeats.length * selectedRoute.price}</p>
                           </div>
                        </div>

                        <button 
                          disabled={selectedSeats.length === 0}
                          onClick={confirmBooking}
                          className="w-full bg-emerald-950 hover:bg-emerald-900 disabled:opacity-30 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl"
                        >
                          <Ticket size={18} className="text-amber-500" />
                          Confirm & Pay
                        </button>
                      </div>
                    </motion.div>
                  )}
                  <p className="text-center text-[10px] text-stone-400 font-bold uppercase tracking-widest">Digital confirmation sent instantly</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {isBookingSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[110] w-[calc(100%-3rem)] md:w-[480px]"
          >
            <div className="bg-neutral-900 text-white p-8 rounded-[2.5rem] shadow-2xl overflow-hidden relative group">
              <div className="relative z-10 flex items-start gap-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-black tracking-tight mb-1">Booking Confirmed!</h4>
                  <p className="text-stone-400 text-xs font-medium mb-6">Your seat has been reserved. A digital ticket has been sent to your WhatsApp.</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setIsBookingSuccess(false);
                        setShowTicket(true);
                      }}
                      className="px-6 py-3 bg-white text-neutral-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-100 transition-colors flex items-center gap-2"
                    >
                      <Ticket size={14} />
                      View Ticket
                    </button>
                    <button 
                      onClick={() => setIsBookingSuccess(false)}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket Modal */}
      <AnimatePresence>
        {showTicket && lastBooking && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-stone-950/60 backdrop-blur-md">
            <motion.div
              id="digital-ticket"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl relative overflow-hidden print:shadow-none print:rounded-none"
            >
              {/* Ticket Header */}
              <div className="bg-emerald-950 p-8 text-white relative">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                      <img src={logoRN} alt="Logo" className="w-6 h-6 object-contain" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight leading-none mb-1">RouteNaga</h3>
                      <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest leading-none">Official Ticket</p>
                    </div>
                  </div>
                  <button 
                    data-html2canvas-ignore
                    onClick={() => setShowTicket(false)} 
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors print:hidden"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">From</p>
                    <p className="text-xl font-black">{lastBooking.route.from}</p>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-full h-[1px] bg-emerald-800/50 relative">
                      <ArrowRight className="absolute left-1/2 -translate-x-1/2 -top-2.5 text-amber-500" size={20} />
                    </div>
                    <span className="text-[8px] font-bold text-amber-500/80 uppercase mt-4 tracking-widest">{lastBooking.route.vehicleType}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">To</p>
                    <p className="text-xl font-black">{lastBooking.route.to}</p>
                  </div>
                </div>

                {/* Decorative circles for ticket punch effect */}
                <div className="absolute -bottom-4 left-0 w-8 h-8 bg-white rounded-full -translate-x-4"></div>
                <div className="absolute -bottom-4 right-0 w-8 h-8 bg-white rounded-full translate-x-4"></div>
              </div>

              {/* Ticket Details */}
              <div className="p-8 space-y-8 border-t-2 border-dashed border-stone-100 relative">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Passanger ID</p>
                    <p className="font-mono font-bold text-stone-900">{lastBooking.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Booking Date</p>
                    <p className="font-bold text-stone-900">{lastBooking.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Departure</p>
                    <p className="font-bold text-emerald-600 flex items-center gap-2">
                       <Clock size={12} />
                       {lastBooking.route.departureTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Seats Assigned</p>
                    <p className="font-black text-stone-900">
                      {lastBooking.seats.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-2xl p-6 flex items-center justify-between border border-stone-100">
                   <div>
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Total Paid</p>
                      <p className="text-2xl font-black text-stone-900">₹{lastBooking.seats.length * lastBooking.route.price}</p>
                   </div>
                   <div className="w-16 h-16 bg-white border border-stone-200 rounded-lg p-1.5 flex items-center justify-center">
                      {/* Placeholder for QR Code */}
                      <div className="grid grid-cols-3 gap-0.5 w-full h-full opacity-20">
                        {Array.from({length: 9}).map((_, i) => (
                           <div key={i} className={`bg-stone-900 ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <button 
                    data-html2canvas-ignore
                    disabled={isDownloading}
                    onClick={handleDownloadTicket}
                    className="w-full py-4 bg-stone-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 print:hidden disabled:opacity-50"
                  >
                    <Download size={14} className={isDownloading ? "animate-bounce" : ""} />
                    {isDownloading ? "Generating..." : "Download Digital Copy"}
                  </button>
                  <p className="text-center text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                    Present this code at the ticket counter
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Download Success Toast */}
      <AnimatePresence>
        {showDownloadToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-[200] bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest">Download Successful</p>
              <p className="text-[9px] font-bold text-white/80">Ticket saved to your device</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function SeatButton({ seat, isSelected, onToggle, highlight = true, size = "medium", isDarkMode = false }: { seat: Seat, isSelected: boolean, onToggle: () => void, highlight?: boolean, size?: "medium" | "small" | "tiny", isDarkMode?: boolean }) {
  if (!seat) return null;
  
  const sizeClasses = {
    medium: "w-14 h-16",
    small: "w-12 h-14 text-[9px]",
    tiny: "w-10 h-12 text-[8px]"
  };

  const iconSizes = {
    medium: 24,
    small: 18,
    tiny: 14
  };
  
  return (
    <button
      disabled={!seat.isAvailable}
      onClick={onToggle}
      className={`
        ${sizeClasses[size]} rounded-xl flex flex-col items-center justify-center transition-all duration-300 relative group
        ${seat.isAvailable 
          ? isSelected 
            ? 'bg-amber-500 text-neutral-950 scale-110 shadow-[0_0_20px_rgba(245,158,11,0.5)] z-20 border-2 border-white' 
            : 'bg-white/5 hover:bg-emerald-500/10 text-white/50 border border-white/10 shadow-sm'
          : 'bg-stone-800/40 text-stone-700 pointer-events-none'
        }
        ${!highlight ? 'opacity-20 contrast-50' : 'opacity-100'}
      `}
    >
      <Armchair size={iconSizes[size]} className={`${isSelected ? 'text-neutral-950' : seat.isAvailable ? 'text-white/30 group-hover:text-emerald-400 transition-colors' : 'text-stone-800'}`} />
      {size !== "tiny" && <span className="text-[7px] font-black uppercase mt-1 tracking-tighter opacity-60">{seat.label}</span>}
      
      {seat.isAvailable && !isSelected && (
        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
      )}

      {!seat.isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
           <X size={20} />
        </div>
      )}

      {isSelected && (
        <motion.div 
          layoutId="seatHighlight"
          className="absolute -inset-1 border-2 border-amber-500/30 rounded-2xl pointer-events-none"
        />
      )}
    </button>
  );
}
