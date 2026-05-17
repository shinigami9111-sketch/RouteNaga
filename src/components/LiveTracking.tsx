import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polyline, Polygon as LeafletPolygon } from "react-leaflet";
import L from "leaflet";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Navigation, Bus, Info, X } from "lucide-react";
import logoRN from "../logoRN.png";

// Nagaland Coordinates
const NAGALAND_CENTER: [number, number] = [26.1585, 94.5622];
const NAGALAND_BOUNDS: L.LatLngBoundsExpression = [
  [25.10, 93.30], // Southwest
  [27.10, 95.30]  // Northeast
];

const NAGALAND_BOUNDARY: [number, number][] = [
  [27.03, 95.12], 
  [27.08, 94.88],
  [26.78, 94.58],
  [26.54, 94.33],
  [26.24, 94.08],
  [25.99, 93.73], 
  [25.49, 93.58], 
  [25.14, 93.68], 
  [25.19, 94.23],
  [25.59, 94.68],
  [25.94, 94.93], 
  [26.34, 95.03],
  [26.74, 95.23],
  [27.03, 95.12]
];

const WORLD_MASK: [number, number][][] = [
  [
    [-90, -180],
    [-90, 180],
    [90, 180],
    [90, -180],
    [-90, -180]
  ],
  NAGALAND_BOUNDARY
];

const DISTRICTS = [
  { name: "Kohima", position: [25.67, 94.12] as [number, number], isCapital: true },
  { name: "Dimapur", position: [25.92, 93.72] as [number, number] },
  { name: "Mokokchung", position: [26.33, 94.53] as [number, number] },
  { name: "Wokha", position: [26.11, 94.26] as [number, number] },
  { name: "Zunheboto", position: [25.97, 94.52] as [number, number] },
  { name: "Phek", position: [25.67, 94.50] as [number, number] },
  { name: "Mon", position: [26.75, 95.06] as [number, number] },
  { name: "Tuensang", position: [26.28, 94.83] as [number, number] },
  { name: "Peren", position: [25.51, 93.59] as [number, number] },
  { name: "Kiphire", position: [25.90, 94.78] as [number, number] },
  { name: "Longleng", position: [26.48, 94.81] as [number, number] },
  { name: "Chumoukedima", position: [25.84, 93.79] as [number, number] },
];

const VEHICLES = [
  { 
    id: "v1", 
    name: "Sumo S1", 
    type: "Tata Sumo", 
    route: "Kohima - Dimapur", 
    position: [25.85, 93.95] as [number, number], 
    speed: 45,
    path: [
      [25.67, 94.12], // Kohima
      [25.75, 94.00], 
      [25.85, 93.95], // Current
      [25.90, 93.80], 
      [25.92, 93.72]  // Dimapur
    ] as [number, number][]
  },
  { 
    id: "v2", 
    name: "Sumo S4", 
    type: "Tata Sumo", 
    route: "Kohima - Mokokchung", 
    position: [26.15, 94.45] as [number, number], 
    speed: 40,
    path: [
      [25.67, 94.12], // Kohima
      [25.80, 94.25],
      [26.00, 94.35],
      [26.15, 94.45], // Current
      [26.30, 94.50],
      [26.33, 94.53]  // Mokokchung
    ] as [number, number][]
  },
  { 
    id: "v3", 
    name: "Bus NST-02", 
    type: "NST Bus", 
    route: "Dimapur - Wokha", 
    position: [26.05, 94.15] as [number, number], 
    speed: 35,
    path: [
      [25.92, 93.72], // Dimapur
      [26.00, 93.90],
      [26.05, 94.15], // Current
      [26.10, 94.25],
      [26.11, 94.26]  // Wokha
    ] as [number, number][]
  },
  { 
    id: "v4", 
    name: "Winger W1", 
    type: "Winger", 
    route: "Kohima - Zunheboto", 
    position: [25.95, 94.48] as [number, number], 
    speed: 50,
    path: [
      [25.67, 94.12], // Kohima
      [25.80, 94.30],
      [25.95, 94.48], // Current
      [26.00, 94.52],
      [25.97, 94.52]  // Zunheboto
    ] as [number, number][]
  },
];

// Custom Vehicle Icon using Leaflet DivIcon
const createVehicleIcon = (isSelected: boolean) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center transition-transform duration-300 ${isSelected ? 'scale-125 z-[1000]' : 'scale-100'}">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center p-2 shadow-2xl border ${
          isSelected 
          ? 'bg-[#061e16] border-[#fbbf24]' 
          : 'bg-white border-white'
        }">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? '#fbbf24' : '#064e3b'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s1-1.33 1-2c0-.67-1-2-1-2H2s-1 1.33-1 2c0 .67 1 2 1 2h3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
        </div>
        ${isSelected ? '<div class="absolute inset-0 bg-[#fbbf24] rounded-2xl animate-ping opacity-20 pointer-events-none"></div>' : ''}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

export function LiveTracking({ isDarkMode }: { isDarkMode: boolean }) {
  const [selectedVehicle, setSelectedVehicle] = useState<typeof VEHICLES[0] | null>(null);
  const [showRoute, setShowRoute] = useState(false);

  const handleVehicleSelect = (vehicle: typeof VEHICLES[0]) => {
    setSelectedVehicle(vehicle);
    setShowRoute(false);
  };

  const mapUrl = isDarkMode 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div className="pt-24 min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-500">
      <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8 pb-12">
        
        {/* Left Sidebar: Vehicle List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-stone-900 p-8 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden relative">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-emerald-950 dark:bg-amber-500 rounded-xl flex items-center justify-center transition-colors">
                  <Bus className="text-amber-500 dark:text-stone-950" size={20} />
               </div>
               <div>
                  <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight leading-none mb-1">Live Fleet</h2>
                  <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-none">OSM Tracking</p>
               </div>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto scrollbar-hide">
              {VEHICLES.map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => handleVehicleSelect(vehicle)}
                  className={`w-full p-5 rounded-2xl border text-left transition-all ${
                    selectedVehicle?.id === vehicle.id 
                    ? "bg-emerald-950 dark:bg-amber-500 border-emerald-900 dark:border-amber-400 shadow-xl shadow-emerald-950/10 dark:shadow-amber-500/20" 
                    : "bg-stone-50 dark:bg-stone-800/50 border-stone-100 dark:border-stone-800 hover:border-amber-500/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      selectedVehicle?.id === vehicle.id ? "text-amber-500 dark:text-stone-900" : "text-stone-400 dark:text-stone-500"
                    }`}>
                      {vehicle.type}
                    </span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                       <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                  <h3 className={`font-black tracking-tight ${
                    selectedVehicle?.id === vehicle.id ? "text-white dark:text-stone-950 text-lg" : "text-stone-900 dark:text-stone-100"
                  }`}>
                    {vehicle.name}
                  </h3>
                  <p className={`text-[11px] font-medium mt-1 ${
                    selectedVehicle?.id === vehicle.id ? "text-emerald-200/60 dark:text-stone-800/60" : "text-stone-500 dark:text-stone-400"
                  }`}>
                    {vehicle.route}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-amber-500 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-black text-neutral-950 tracking-tight mb-2">OSM Enabled</h3>
              <p className="text-neutral-900/60 text-xs font-bold leading-relaxed mb-6">
                Now using OpenStreetMap for verified vehicle tracking in Nagaland.
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-6 py-3 bg-neutral-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
              >
                Focus Map
              </button>
            </div>
            <Navigation className="absolute -bottom-4 -right-4 w-32 h-32 text-neutral-900/5 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>

        {/* Main Map View */}
        <div className="lg:col-span-3 h-[70vh] lg:h-[80vh] bg-stone-100 dark:bg-stone-900 rounded-[3rem] overflow-hidden border border-stone-200 dark:border-stone-800 shadow-2xl relative transition-colors duration-500">
          <MapContainer 
            key={mapUrl} // Re-mount map when theme changes
            center={NAGALAND_CENTER} 
            zoom={9} 
            minZoom={8}
            maxBounds={NAGALAND_BOUNDS}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url={mapUrl}
            />

            {/* Nagaland Boundary Mask - Hides everything outside Nagaland */}
            <LeafletPolygon
              positions={WORLD_MASK}
              pathOptions={{
                fillColor: isDarkMode ? "#0c0a09" : "#f1f5f9",
                fillOpacity: 1,
                color: isDarkMode ? "#292524" : "#e7e5e4",
                weight: 2,
                stroke: true
              }}
            />
            
            <ZoomControl position="topright" />
            
            {/* Displaying District/Town markers for better visibility */}
            {DISTRICTS.map((district) => (
              <Marker
                key={district.name}
                position={district.position}
                icon={L.divIcon({
                  className: 'district-label',
                  html: `
                    <div class="flex flex-col items-center group">
                      <div class="w-1.5 h-1.5 ${district.isCapital ? 'bg-amber-500 scale-125' : 'bg-stone-400'} rounded-full shadow-lg group-hover:scale-150 transition-transform"></div>
                      <span class="mt-1 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest ${
                        isDarkMode ? 'text-stone-400 group-hover:text-amber-500' : 'text-stone-500 group-hover:text-emerald-900'
                      } bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm rounded-sm transition-colors whitespace-nowrap">
                        ${district.name}
                      </span>
                    </div>
                  `,
                  iconSize: [60, 20],
                  iconAnchor: [30, 10],
                })}
              />
            ))}

            {/* Displaying Route Line if a vehicle is selected and tracking is active */}
            {selectedVehicle && showRoute && (
              <>
                <Polyline 
                  positions={selectedVehicle.path} 
                  pathOptions={{ 
                    color: isDarkMode ? '#fbbf24' : '#064e3b', 
                    weight: 8, 
                    opacity: 0.2,
                    lineCap: 'round'
                  }} 
                />
                <Polyline 
                  positions={selectedVehicle.path} 
                  pathOptions={{ 
                    color: isDarkMode ? '#fbbf24' : '#f59e0b', 
                    weight: 3, 
                    opacity: 1,
                    dashArray: '1, 8',
                    lineCap: 'round'
                  }} 
                />
              </>
            )}

            {VEHICLES.map((vehicle) => (
              <Marker 
                key={vehicle.id} 
                position={vehicle.position}
                icon={createVehicleIcon(selectedVehicle?.id === vehicle.id)}
                eventHandlers={{
                  click: () => {
                    setSelectedVehicle(vehicle);
                    setShowRoute(false);
                  },
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">{vehicle.type}</p>
                    <h4 className="text-sm font-black text-stone-900">{vehicle.name}</h4>
                    <p className="text-[10px] text-stone-500 mt-1">{vehicle.route}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Floating UI on Map */}
          <div className="absolute top-8 left-8 pointer-events-none z-[1000]">
             <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-white/20 dark:border-stone-800 p-6 rounded-3xl shadow-xl space-y-4 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-emerald-500 dark:bg-amber-500 flex items-center justify-center transition-colors">
                       <MapPin className="text-white dark:text-stone-950" size={16} />
                   </div>
                   <div>
                      <p className="text-[8px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-none mb-1">State Boundaries</p>
                      <h4 className="text-sm font-black text-stone-900 dark:text-stone-100 leading-none">Nagaland, India</h4>
                   </div>
                </div>
             </div>
          </div>

          <AnimatePresence>
            {selectedVehicle && (
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                className="absolute bottom-6 right-6 left-6 lg:left-auto lg:w-72 pointer-events-auto z-[1000]"
              >
                <div className="bg-white dark:bg-stone-900 p-5 rounded-[2rem] shadow-2xl border border-stone-100 dark:border-stone-800 relative overflow-hidden transition-colors">
                   <button 
                    onClick={() => {
                      setSelectedVehicle(null);
                      setShowRoute(false);
                    }}
                    className="absolute top-4 right-4 p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors z-20"
                   >
                     <X size={16} className="text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-100" />
                   </button>

                   <div className="flex items-start gap-3 mb-5">
                      <div className="w-10 h-10 bg-stone-900 dark:bg-stone-800 rounded-xl flex items-center justify-center shrink-0 border border-stone-800 dark:border-stone-700">
                         <img src={logoRN} alt="Logo" className="w-5 h-5 object-contain" />
                      </div>
                      <div>
                         <h3 className="text-base font-black text-stone-900 dark:text-stone-100 tracking-tight leading-none mb-1">{selectedVehicle.name}</h3>
                         <p className="text-[8px] font-bold text-amber-600 uppercase tracking-[0.2em]">{selectedVehicle.type}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800 transition-colors">
                         <p className="text-[7px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">Speed</p>
                         <p className="text-xs font-black text-stone-900 dark:text-stone-100">{selectedVehicle.speed} <span className="text-[8px]">km/h</span></p>
                      </div>
                      <div className="bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800 transition-colors">
                         <p className="text-[7px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">Status</p>
                         <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                            <p className="text-xs font-black text-emerald-600 dark:text-emerald-500 tracking-tight">Active</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2.5 mb-5 px-1">
                      <div className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-stone-200 dark:bg-stone-700" />
                         <span className="text-[10px] font-bold text-stone-600 dark:text-stone-400 tracking-tight">{selectedVehicle.route.split(" - ")[0]}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                         <span className="text-[10px] font-black text-stone-900 dark:text-stone-100 tracking-tight">{selectedVehicle.route.split(" - ")[1]}</span>
                      </div>
                   </div>

                   <button 
                    onClick={() => setShowRoute(!showRoute)}
                    className={`w-full py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-lg ${
                      showRoute 
                      ? "bg-amber-500 text-neutral-950 shadow-amber-500/20" 
                      : "bg-stone-900 dark:bg-amber-500/10 text-white dark:text-amber-500 border dark:border-amber-500/20 shadow-stone-950/10 hover:bg-black dark:hover:bg-amber-500/20"
                    }`}
                   >
                      {showRoute ? "Hide Journey Path" : "Track Journey Details"}
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Leak CSS to fix Leaflet attribution z-index if needed (though UI handles it) */}
      <style>{`
        .leaflet-container {
          background-color: ${isDarkMode ? '#0c0a09' : '#f1f5f9'} !important;
          border-radius: 3rem;
        }
        .leaflet-tile {
          filter: ${isDarkMode ? 'brightness(0.6) invert(100%) hue-rotate(180deg) saturate(0.8)' : 'saturate(1.2)'} !important;
        }
        .leaflet-tile-pane {
           filter: ${isDarkMode ? 'brightness(0.8) contrast(1.2)' : 'none'} !important;
        }
        .leaflet-popup-content-wrapper {
          background-color: ${isDarkMode ? '#1c1917' : '#ffffff'} !important;
          color: ${isDarkMode ? '#f5f5f4' : '#0c0a09'} !important;
          border-radius: 1rem !important;
          padding: 4px !important;
          border: 1px solid ${isDarkMode ? '#292524' : '#e7e5e4'} !important;
        }
        .leaflet-popup-tip {
          background: ${isDarkMode ? '#1c1917' : 'white'} !important;
        }
      `}</style>
    </div>
  );
}

