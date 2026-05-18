import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapPage = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    const map = L.map('map', {
      center: [14.5995, 120.9842], // Manila
      zoom: 14,
      zoomControl: false,
    });

    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  const handleFindRoute = async (e) => {
    e.preventDefault();
    if (!fromLocation || !toLocation) return;

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="relative w-screen h-screen font-sans antialiased overflow-hidden bg-[#f8f6f1]">
      
      {/* MAP CONTAINER */}
      <div id="map" className="absolute inset-0 z-0"></div>

      {/* LEFT SIDEBAR OVERLAY - Pinakipit ang scaling para hindi mukhang dambuhala */}
      <div className="absolute top-0 left-0 bottom-0 z-10 w-full sm:w-[320px] md:w-[350px] lg:w-1/4 xl:w-1/5 max-w-[360px] flex flex-col bg-[#f8f6f1] text-black shadow-2xl border-r border-neutral-200 transition-all duration-300">
        
        {/* Header Section */}
        <div className="p-4 flex flex-col gap-2 bg-white border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-xl font-black tracking-tight text-black">
              komyut <span className="text-[#f4b400]">AI</span>
            </span>
            <div className="text-[10px] font-bold px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-500">PH</div>
          </div>
          <div className="text-[10px] font-black tracking-wider text-[#f4b400]">
            DIRECTIONS
          </div>
        </div>

        {/* Input & Search Section */}
        <form onSubmit={handleFindRoute} className="p-4 flex flex-col gap-3.5 bg-white border-b border-neutral-200 relative">
          <div className="flex flex-col gap-2.5 relative">
            
            {/* Connection Line Graphics */}
            <div className="absolute left-[11px] top-[20px] bottom-[20px] w-0.5 border-l-2 border-dashed border-neutral-200 z-10"></div>

            {/* From Input */}
            <div className="flex items-center gap-2.5 relative z-20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#f4b400] flex-shrink-0 shadow-[0_0_4px_#f4b400]"></div>
              <input 
                type="text" 
                placeholder="Mula saan?" 
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full p-2 bg-[#f8f6f1] text-black placeholder-neutral-400 border border-neutral-100 rounded-lg text-xs focus:outline-none focus:border-[#f4b400] transition-colors" 
              />
            </div>
            
            {/* To Input */}
            <div className="flex items-center gap-2.5 relative z-20">
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full flex-shrink-0"></div>
              <input 
                type="text" 
                placeholder="Papunta saan?" 
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full p-2 bg-[#f8f6f1] text-black placeholder-neutral-400 border border-neutral-100 rounded-lg text-xs focus:outline-none focus:border-[#f4b400] transition-colors" 
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-1 mt-0.5">
            <div className="px-2.5 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 text-[10px] font-semibold rounded-md flex items-center gap-1 border border-neutral-200 cursor-pointer transition-colors truncate">
              📅 Depart Now <span className="text-neutral-400 text-[8px]">▼</span>
            </div>
            <button 
              type="submit"
              className="px-4 py-1.5 bg-[#f4b400] hover:bg-opacity-90 text-black text-[10px] font-bold rounded-full transition-all shadow-sm flex-shrink-0"
            >
              {isSearching ? '...' : 'Find Route'}
            </button>
          </div>
        </form>

        {/* Dynamic Status / Route Results Panel */}
        <div className="flex-grow p-5 flex flex-col items-center justify-center text-center bg-[#f8f6f1] overflow-y-auto">
          {!fromLocation || !toLocation ? (
            <>
              <div className="w-10 h-10 mb-2.5 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-400 text-base shadow-sm">
                📍
              </div>
              <p className="text-[11px] font-medium text-neutral-500 px-1 leading-relaxed">
                I-type ang iyong lokasyon at destinasyon para makita ang ruta.
              </p>
            </>
          ) : isSearching ? (
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-5 h-5 border-2 border-[#f4b400] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">Kinakalkula ang ruta...</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 mb-2.5 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-500 text-base shadow-sm">
                🚌
              </div>
              <p className="text-[11px] font-bold text-black mb-0.5">Backend Ready</p>
              <p className="text-[10px] text-neutral-500 px-1 leading-relaxed">
                Dito ipapakita ang AI step-by-step route cards kapag nakuha na ang response mula sa server.
              </p>
            </>
          )}
        </div>

        {/* Minimal Clean Footer */}
        <div className="p-2.5 bg-white border-t border-neutral-200 text-center">
          <p className="text-[8px] font-medium text-neutral-400 tracking-wide">
            &copy; 2026 KOMYUT AI
          </p>
        </div>

      </div>

      {/* CLEAN ZOOM CONTROLS (Floating) */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-1 shadow-md rounded-lg overflow-hidden border border-neutral-200">
        <button 
          onClick={() => mapRef.current?.zoomIn()}
          className="w-10 h-10 bg-white hover:bg-neutral-50 text-neutral-700 font-bold text-lg flex items-center justify-center transition-colors"
        >
          +
        </button>
        <button 
          onClick={() => mapRef.current?.zoomOut()}
          className="w-10 h-10 bg-white hover:bg-neutral-50 text-neutral-700 font-bold text-lg border-t border-neutral-100 flex items-center justify-center transition-colors"
        >
          -
        </button>
      </div>

    </div>
  );
};

export default MapPage;