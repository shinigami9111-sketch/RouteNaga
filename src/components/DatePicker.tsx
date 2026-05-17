import { useState, useRef, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  label?: string;
}

export function DatePicker({ selectedDate, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer group"
      >
        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-hover:text-amber-600 transition-colors" size={16} />
        <div className="w-full bg-stone-50 border border-stone-200 text-stone-800 p-4 pl-12 rounded-2xl group-hover:border-amber-500/50 transition-all text-sm font-medium">
          {format(selectedDate, "dd MMM yyyy")}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute bottom-full mb-4 left-0 w-80 bg-white border border-stone-200 rounded-[2rem] shadow-2xl p-6 z-[100] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-amber-600">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevMonth(); }}
                  className="p-2 hover:bg-stone-100 rounded-xl transition-colors text-stone-400 hover:text-amber-600"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNextMonth(); }}
                  className="p-2 hover:bg-stone-100 rounded-xl transition-colors text-stone-400 hover:text-amber-600"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                <div key={`${day}-${idx}`} className="text-center text-[10px] font-bold text-stone-400 uppercase">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(day);
                    setIsOpen(false);
                  }}
                  className={`
                    aspect-square flex items-center justify-center text-xs rounded-xl transition-all relative group
                    ${!isSameMonth(day, monthStart) ? "text-stone-300" : "text-stone-600"}
                    ${isSameDay(day, selectedDate) ? "bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/20" : "hover:bg-stone-50 hover:text-amber-600"}
                    ${isSameDay(day, new Date()) && !isSameDay(day, selectedDate) ? "border border-amber-500/30" : ""}
                  `}
                >
                  {format(day, "d")}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <button 
                onClick={(e) => { e.stopPropagation(); onChange(new Date()); setIsOpen(false); }}
                className="text-[10px] font-bold text-amber-600 hover:underline px-2 py-1"
              >
                Today
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="text-[10px] font-bold text-stone-400 hover:text-stone-600 px-2 py-1"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
