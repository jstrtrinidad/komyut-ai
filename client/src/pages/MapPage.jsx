import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

import Navbar from "../components/layout/Navbar";

const MANILA_CENTER = { lat: 14.5995, lng: 120.9842 };

// ─── SVG Icons para sa AI Cards ───────────────────────────────────────────────
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
    <line x1="12" y1="20" x2="12" y2="4"></line>
  </svg>
);

const TransportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="16" rx="2" ry="2"></rect>
    <path d="M4 11h16"></path>
    <path d="M12 3v8"></path>
    <path d="M8 19l-2 3"></path>
    <path d="M16 19l2 3"></path>
    <path d="M8 15h.01"></path>
    <path d="M16 15h.01"></path>
  </svg>
);

const MinimizeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 12 22 20 14"></polyline>
    <polyline points="4 2 12 10 20 2"></polyline>
  </svg>
);

// ─── AI Insight Row Component ───
function AiInsightRow({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between p-2.5 bg-white bg-opacity-70 rounded-xl border border-neutral-100 shadow-sm">
      <div className="flex flex-col gap-0.5 flex-grow min-w-0">
        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{label}</span>
        <span className="text-[12px] font-black text-black leading-tight break-words pr-1" title={value}>{value}</span>
      </div>
      <div className="w-8 h-8 rounded-xl bg-[#fff8e6] text-[#f4b400] flex items-center justify-center flex-shrink-0 ml-2">
        {icon}
      </div>
    </div>
  );
}

// ─── Manual Autocomplete Input ───
function PlaceInput({ placeholder, onPlaceSelect, initialValue = "" }) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const placesLib = useMapsLibrary("places");
  const debounceRef = useRef(null);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const fetchSuggestions = useCallback(
    async (value) => {
      if (!placesLib || value.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const { suggestions: results } =
          await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: value,
            includedRegionCodes: ["ph"],
            locationRestriction: {
              north: 14.7877,
              south: 14.3466,
              east: 121.1338,
              west: 120.9300,
            },
          });
        setSuggestions(results ?? []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Autocomplete error:", err);
        setSuggestions([]);
      }
    },
    [placesLib],
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const handleSelect = async (suggestion) => {
    try {
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: ["displayName", "formattedAddress", "location"],
      });
      const result = {
        name: place.displayName,
        address: place.formattedAddress,
        lat: place.location.lat(),
        lng: place.location.lng(),
      };
      setInputValue(place.displayName);
      setSuggestions([]);
      setShowDropdown(false);
      onPlaceSelect(result);
    } catch (err) {
      console.error("Place details error:", err);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[13px] font-semibold outline-none placeholder-neutral-400 text-black"
      />
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={() => handleSelect(s)}
              className="w-full text-left px-4 py-3 text-[12px] text-black hover:bg-[#fffcf5] hover:text-[#f4b400] border-b border-neutral-100 last:border-0 transition-colors"
            >
              <span className="font-bold block truncate">
                {s.placePrediction?.mainText?.toString()}
              </span>
              <span className="text-neutral-400 font-medium text-[10px] block truncate mt-0.5">
                {s.placePrediction?.secondaryText?.toString()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Dynamic Multi-Route Layer Renderer ───
function MultiRouteRenderer({ directionsResult, selectedRouteIndex }) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const renderersRef = useRef([]);

  useEffect(() => {
    if (!routesLib || !map || !directionsResult) return;

    renderersRef.current.forEach((r) => r.setMap(null));
    renderersRef.current = [];

    renderersRef.current = directionsResult.routes.map((_, idx) => {
      const isSelected = idx === selectedRouteIndex;
     
      const renderer = new routesLib.DirectionsRenderer({
        map,
        directions: directionsResult,
        routeIndex: idx,
        suppressMarkers: !isSelected,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: isSelected ? "#f4b400" : "#fde047",
          strokeWeight: isSelected ? 6 : 4.5,
          strokeOpacity: isSelected ? 1.0 : 0.65,
          zIndex: isSelected ? 100 : 10,
        },
      });
     
      return renderer;
    });

    return () => {
      renderersRef.current.forEach((r) => r.setMap(null));
      renderersRef.current = [];
    };
  }, [routesLib, map, directionsResult, selectedRouteIndex]);

  return null;
}

// ─── Traffic Layer Component ───
function TrafficLayerComponent({ show }) {
  const map = useMap();
  const trafficLayerRef = useRef(null);

  useEffect(() => {
    if (!map) return;
   
    if (!trafficLayerRef.current) {
      trafficLayerRef.current = new window.google.maps.TrafficLayer();
    }
   
    if (show) {
      trafficLayerRef.current.setMap(map);
    } else {
      trafficLayerRef.current.setMap(null);
    }
  }, [map, show]);

  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
function MapPage() {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const geocodingLib = useMapsLibrary("geocoding");
  const location = useLocation();
  const audioRef = useRef(null);
  const chatContainerRef = useRef(null);
  const lastAutoPrompt = useRef("");

  // ── States ──
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [arrivalTime, setArrivalTime] = useState("");
  const [initialOriginText, setInitialOriginText] = useState("");
  const [initialDestinationText, setInitialDestinationText] = useState("");
  const hasAutoRouted = useRef(false);

  const [routeResult, setRouteResult] = useState(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [aiInsights, setAiInsights] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);
  const [clearKey, setClearKey] = useState(0);

  // Chat & UI States
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isAiMinimized, setIsAiMinimized] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const canSearch = !!origin && !!destination;

  // ─── AI Chat Fetch Handler ───
  const handleAskAI = useCallback(async (customPrompt, contextRoute = null) => {
    if (!customPrompt.trim()) return;

    setChatHistory((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", text: customPrompt },
    ]);
    setChatInput("");
    setIsAiLoading(true);
    setIsAiMinimized(false);

    let routeContextText = "";
    if (contextRoute) {
      const leg = contextRoute.legs[0];
      const cleanSteps = leg.steps
        .map((s) => s.instructions.replace(/<[^>]*>?/gm, ""))
        .join(" -> ");

      routeContextText = `
        MAPS ROUTE DATA:
        Mode: TRANSIT (Commute)
        Distance: ${leg.distance.text}
        Duration: ${leg.duration.text}
        Summary: ${contextRoute.summary || "Transit Route"}
        Steps: ${cleanSteps}
      `;
    }

    try {
      const response = await fetch("http://localhost:5000/api/ai/commute-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt,
          origin: origin?.name || origin?.address,
          destination: destination?.name || destination?.address,
          routeContext: routeContextText,
        }),
      });
      const data = await response.json();

      let audioUrl = null;
      if (data.audioData) {
        const binaryString = window.atob(data.audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.mimeType || "audio/wav" });
        audioUrl = URL.createObjectURL(blob);
      }

      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ai",
          text: data.text || "Analysis complete.",
          audioUrl: audioUrl,
        },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ai",
          text: "Error connecting to AI.",
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  }, [origin, destination]);

  // ─── Fetch Directions ───
  const handleFindRoute = useCallback(() => {
    if (!canSearch || !routesLib) return;
    setRouteResult(null);
    setSelectedRouteIndex(0);
    setAiInsights(null);
    setIsSearching(true);
    setShowRoute(true);
    lastAutoPrompt.current = "";

    const service = new routesLib.DirectionsService();

    let transitOpts = { modes: ["BUS", "RAIL", "SUBWAY", "TRAM"], routingPreference: "FEWER_TRANSFERS" };
    if (arrivalTime) {
      const targetTime = new Date();
      const [hours, minutes] = arrivalTime.split(":");
      targetTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      transitOpts.arrivalTime = targetTime;
    }

    service.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: routesLib.TravelMode.TRANSIT,
        provideRouteAlternatives: true,
        transitOptions: transitOpts,
      },
      (result, status) => {
        setIsSearching(false);
        if (status === "OK") {
          setRouteResult(result);
          if (map && result.routes[0]?.bounds) {
            map.fitBounds(result.routes[0].bounds, { padding: 80 });
          }
          const routeSignature = `TRANSIT-${origin.name}-${destination.name}`;
          if (lastAutoPrompt.current !== routeSignature) {
            lastAutoPrompt.current = routeSignature;
            handleAskAI(
              `Please analyze this commute route from ${origin.name} to ${destination.name}.`,
              result.routes[0],
            );
          }
        } else {
          console.warn("Transit route request failed due to " + status);
          setShowRoute(false);
        }
      }
    );
  }, [canSearch, routesLib, arrivalTime, origin, destination, map, handleAskAI]);

  // ─── Auto-fill from location state ───
  useEffect(() => {
    const state = location.state;
    if (state?.originText && state?.destinationText && geocodingLib && routesLib && !hasAutoRouted.current) {
      setInitialOriginText(state.originText);
      setInitialDestinationText(state.destinationText);

      const geocoder = new geocodingLib.Geocoder();

      const geocode = (text) => {
        return new Promise((resolve) => {
          geocoder.geocode(
            { address: text, componentRestrictions: { country: "PH" } },
            (results, status) => {
              if (status === "OK" && results[0]) {
                const loc = results[0].geometry.location;
                resolve({
                  name: text,
                  address: results[0].formatted_address,
                  lat: loc.lat(),
                  lng: loc.lng(),
                });
              } else {
                console.warn(`Geocode failed for ${text}: ${status}`);
                resolve(null);
              }
            }
          );
        });
      };

      Promise.all([geocode(state.originText), geocode(state.destinationText)]).then(
        ([o, d]) => {
          if (o && d) {
            setOrigin(o);
            setDestination(d);
            hasAutoRouted.current = true;
          }
        }
      );
    }
  }, [location.state, geocodingLib, routesLib]);

  // ─── Auto-route trigger ───
  useEffect(() => {
    if (hasAutoRouted.current && origin && destination && !routeResult && !isSearching) {
      handleFindRoute();
    }
  }, [origin, destination, routeResult, isSearching, handleFindRoute]);

  // ─── Insights Extraction ───
  useEffect(() => {
    if (!routeResult) {
      setAiInsights(null);
      return;
    }

    const route = routeResult.routes[selectedRouteIndex];
    const leg = route?.legs[0];
    if (!leg) return;

    let bestTime = "ASAP";
    if (leg.departure_time) {
      bestTime = leg.departure_time.text;
    } else {
      const durationInSeconds = leg.duration?.value || 0;
      let targetTime = new Date();
      if (arrivalTime) {
        const [hours, minutes] = arrivalTime.split(":");
        targetTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        const depTime = new Date(targetTime.getTime() - (durationInSeconds * 1000) - (10 * 60000));
        bestTime = depTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }

    const transitSteps = leg.steps.filter(step => step.travel_mode === "TRANSIT");
    let transportMode = "Lakad Lamang";
    let estimatedFareText = "₱0.00 (Walk)";

    if (transitSteps.length > 0) {
      const lines = transitSteps.map(step => {
        return step.transit?.line?.short_name || step.transit?.line?.name || "Transit";
      });
      transportMode = lines.slice(0, 3).join(" ➔ ") + (lines.length > 3 ? "..." : "");

      let fareBreakdown = {};
      transitSteps.forEach(step => {
        const type = step.transit?.line?.vehicle?.type || "";
        const name = (step.transit?.line?.name || "").toUpperCase();
        const shortName = (step.transit?.line?.short_name || "").toUpperCase();
        const distanceKm = (step.distance?.value || 0) / 1000;

        let modeKey = "Jeep/UV";
        let stepFare = 15;

        if (type === "BUS" || name.includes("BUS") || shortName.includes("BUS")) {
          modeKey = "Bus";
          stepFare = 15 + Math.round(distanceKm * 2.1);
        } else if (
          type === "RAIL" || type === "SUBWAY" || type === "HEAVY_RAIL" ||
          name.includes("LRT") || name.includes("MRT") || name.includes("METRO") ||
          shortName.includes("LRT") || shortName.includes("MRT")
        ) {
          if (name.includes("LRT 1") || shortName.includes("L1")) modeKey = "LRT-1";
          else if (name.includes("LRT 2") || shortName.includes("L2")) modeKey = "LRT-2";
          else if (name.includes("MRT 3") || shortName.includes("M3")) modeKey = "MRT-3";
          else modeKey = "Tren";
          stepFare = 15 + Math.round(distanceKm * 1.6);
        } else {
          modeKey = "Jeep/UV";
          stepFare = 13 + Math.round(distanceKm * 1.8);
        }

        if (!fareBreakdown[modeKey]) fareBreakdown[modeKey] = 0;
        fareBreakdown[modeKey] += stepFare;
      });

      estimatedFareText = Object.entries(fareBreakdown)
        .map(([mode, fare]) => `${mode}: ₱${fare}`)
        .join(" • ");
    } else if (route.summary) {
      transportMode = route.summary;
    }

    setAiInsights({
      bestDeparture: bestTime,
      fare: estimatedFareText,
      transport: transportMode
    });
  }, [routeResult, arrivalTime, selectedRouteIndex]);

  // ─── Scroll Chat ───
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isAiLoading, isAiMinimized]);

  // ─── Audio Handlers ───
  const playAudio = (url, id, text) => {
    stopAudio();
    if (url) {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onplay = () => { setCurrentlyPlayingId(id); setIsPaused(false); };
      audio.onpause = () => setIsPaused(true);
      audio.onended = () => { setCurrentlyPlayingId(null); setIsPaused(false); };
      audio.play().catch((e) => console.error("Playback failed:", e));
    } else if ("speechSynthesis" in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onstart = () => { setCurrentlyPlayingId(id); setIsPaused(false); };
      utterance.onpause = () => setIsPaused(true);
      utterance.onresume = () => setIsPaused(false);
      utterance.onend = () => { setCurrentlyPlayingId(null); setIsPaused(false); };
      utterance.onerror = () => { setCurrentlyPlayingId(null); setIsPaused(false); };
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause();
    } else if ("speechSynthesis" in window) {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      else if (window.speechSynthesis.speaking) window.speechSynthesis.pause();
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setCurrentlyPlayingId(null);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-[#faf7f2] font-sans overflow-hidden">
      <Navbar />

      <div className="relative flex-grow w-full h-[calc(100vh-72px)] overflow-hidden">
        <Map defaultCenter={MANILA_CENTER} defaultZoom={12} disableDefaultUI style={{ width: "100%", height: "100%" }}>
          <TrafficLayerComponent show={showTraffic} />
          {showRoute && routeResult && (
            <MultiRouteRenderer
              directionsResult={routeResult}
              selectedRouteIndex={selectedRouteIndex}
            />
          )}
        </Map>

        <div className="absolute top-4 left-4 right-4 z-10 w-[calc(100%-2rem)] md:w-[360px] md:top-6 md:left-6 md:right-auto flex flex-col bg-white shadow-2xl border border-[#ece7dc] rounded-[24px] max-h-[50vh] md:max-h-[calc(100%-120px)] overflow-hidden pointer-events-auto">
          <div className="p-4 flex items-center justify-between border-b border-[#ece7dc] bg-[#faf7f2]">
            <span className="text-[12px] font-black uppercase tracking-widest text-black">Route Search</span>
            <button
              onClick={() => {
                setOrigin(null); setDestination(null); setArrivalTime("");
                setRouteResult(null); setShowRoute(false); setChatHistory([]);
                setClearKey((k) => k + 1); stopAudio();
              }}
              className="text-[11px] font-bold text-neutral-400 hover:text-black transition-colors px-2 py-1 rounded-md hover:bg-white"
            >
              Reset
            </button>
          </div>

          <div className="p-5 flex flex-col gap-4 border-b border-[#ece7dc]">
            <div className="relative flex flex-col gap-3">
              <div className="absolute left-[15px] top-[28px] bottom-[28px] w-0.5 border-l-2 border-dashed border-[#ece7dc] z-10" />
              <div className="flex items-center gap-3 relative z-20">
                <div className="w-3.5 h-3.5 rounded-full bg-[#f4b400] flex-shrink-0 shadow-[0_0_8px_#f4b400]" />
                <div className="w-full px-4 py-2 bg-[#f8f6f1] border border-[#ece7dc] rounded-xl focus-within:border-[#f4b400] focus-within:bg-white transition-all">
                  <PlaceInput
                    key={`from-${clearKey}`}
                    placeholder="Mula saan?"
                    initialValue={initialOriginText}
                    onPlaceSelect={(p) => { setOrigin(p); setShowRoute(false); }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 relative z-20">
                <div className="w-3.5 h-3.5 bg-black rounded-full flex-shrink-0" />
                <div className="w-full px-4 py-2 bg-[#f8f6f1] border border-[#ece7dc] rounded-xl focus-within:border-[#f4b400] focus-within:bg-white transition-all">
                  <PlaceInput
                    key={`to-${clearKey}`}
                    placeholder="Papunta saan?"
                    initialValue={initialDestinationText}
                    onPlaceSelect={(p) => { setDestination(p); setShowRoute(false); }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-1">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#f8f6f1] border border-[#ece7dc] rounded-xl focus-within:border-[#f4b400] transition-colors flex-grow">
                <span className="text-[11px] font-bold text-neutral-400 whitespace-nowrap">🏁 Arrive By</span>
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="bg-transparent outline-none text-[13px] font-black text-black flex-grow w-full cursor-pointer"
                />
              </div>
              <button
                onClick={handleFindRoute}
                disabled={!canSearch || isSearching}
                className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-[12px] font-bold rounded-xl transition-all shadow-md flex-shrink-0 disabled:opacity-50"
              >
                {isSearching ? "..." : "Search"}
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto bg-white custom-scrollbar">
            {isSearching && (
              <div className="p-10 flex flex-col items-center justify-center gap-2 text-center">
                <div className="w-6 h-6 border-2 border-[#f4b400] border-t-transparent rounded-full animate-spin" />
                <p className="text-[12px] text-neutral-400 font-bold">Naghahanap ng best commute option...</p>
              </div>
            )}
            {!routeResult && !isSearching && (
              <div className="h-64 flex flex-col items-center justify-center p-6 text-center opacity-50">
                <span className="text-2xl mb-2">🚌</span>
                <p className="text-[11px] font-bold text-neutral-500">I-type ang lokasyon para makita<br />ang mga suhestiyong ruta.</p>
              </div>
            )}
            {routeResult && (
              <div className="flex flex-col divide-y divide-neutral-100">
                <div className="p-4 bg-[#f8f6f1] border-b border-[#ece7dc]">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Suggested Commute Routes</p>
                </div>
                {routeResult.routes.map((route, idx) => {
                  const isSelected = selectedRouteIndex === idx;
                  return (
                    <div key={idx} className="flex flex-col">
                      <button
                        onClick={() => setSelectedRouteIndex(idx)}
                        className={`relative flex items-start justify-between p-4 border-l-4 text-left transition-all ${
                          isSelected ? "border-l-[#f4b400] bg-[#fffcf5]" : "border-l-transparent bg-white hover:bg-neutral-50"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          {idx === 0 && <span className="text-[9px] font-black text-[#f4b400] tracking-wider mb-1 uppercase flex items-center gap-1">⭐ Best Route</span>}
                          <span className="text-[14px] font-black text-black tracking-tight">{route.legs[0].duration.text}</span>
                          <span className="text-[11px] font-semibold text-neutral-500 truncate max-w-[200px]">via {route.summary || "Commute Line"}</span>
                        </div>
                        <span className="text-[11px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md mt-auto mb-auto">
                          {route.legs[0].distance.text}
                        </span>
                      </button>
                      {isSelected && (
                        <div className="px-5 pb-4 pt-1 bg-[#fffcf5]">
                          <div className="flex flex-col gap-3 pl-3 border-l-2 border-dashed border-[#f4b400] mt-1 relative">
                            <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[#f4b400]" />
                            {route.legs[0].steps.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-2.5">
                                <span className="text-[13px] mt-0.5 flex-shrink-0">{step.travel_mode === "TRANSIT" ? "🚌" : "🚶‍♂️"}</span>
                                <div className="flex flex-col">
                                  <span className="text-[11px] text-neutral-700 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: step.instructions }} />
                                  {step.transit && (
                                    <span className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                                      {step.transit.line?.short_name || step.transit.line?.name} • {step.transit.num_stops} stops
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                            <div className="absolute -left-[5px] -bottom-[2px] w-2 h-2 rounded-full bg-black" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-6 left-4 md:left-6 z-20 flex flex-col gap-1 shadow-md rounded-lg overflow-hidden border border-neutral-200">
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`w-9 h-9 flex items-center justify-center font-black text-md transition-colors border-b border-neutral-100 ${
              showTraffic ? 'bg-[#fffcf5] text-[#f4b400]' : 'bg-white hover:bg-neutral-50 text-neutral-500'
            }`}
            title="Toggle Traffic"
          >
            🚦
          </button>
          <button onClick={() => map?.setZoom((map.getZoom() ?? 12) + 1)} className="w-9 h-9 bg-white hover:bg-neutral-50 text-black font-black text-md flex items-center justify-center">+</button>
          <button onClick={() => map?.setZoom((map.getZoom() ?? 12) - 1)} className="w-9 h-9 bg-white hover:bg-neutral-50 text-black font-black text-md border-t border-neutral-100 flex items-center justify-center">−</button>
        </div>

        {routeResult && (
          <div className="absolute bottom-4 left-4 right-4 md:top-6 md:right-6 md:left-auto md:bottom-6 z-10 flex flex-col gap-4 pointer-events-none items-end w-[calc(100%-2rem)] md:w-[340px]">
            <button
              onClick={() => setIsAiMinimized(!isAiMinimized)}
              className="pointer-events-auto bg-white bg-opacity-95 backdrop-blur-md shadow-lg border border-[#ece7dc] rounded-full px-4 py-2 flex items-center gap-2 text-[11px] font-bold text-black hover:bg-neutral-50 transition-all z-20"
            >
              {isAiMinimized ? "🤖 Show AI Cards" : <><MinimizeIcon /> Minimize AI</>}
            </button>

            {!isAiMinimized && (
              <div className="w-full flex flex-col gap-4 max-h-[50vh] md:max-h-full pointer-events-none">
                {aiInsights && (
                  <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl border border-[#ece7dc] p-4 shadow-xl flex flex-col gap-2.5 pointer-events-auto transition-all animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-100">
                      <span className="text-xs">⚡</span>
                      <p className="text-[10px] font-black text-black tracking-wider uppercase">AI Quick Insights</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <AiInsightRow label={arrivalTime ? "Recommended Dep. Time" : "Estimated Dep. Time"} value={aiInsights.bestDeparture} icon={<ClockIcon />} />
                      <AiInsightRow label="Estimated Fare" value={aiInsights.fare} icon={<WalletIcon />} />
                      <AiInsightRow label="Primary Transport" value={aiInsights.transport} icon={<TransportIcon />} />
                    </div>
                  </div>
                )}

                <div className="flex-grow flex flex-col bg-white bg-opacity-95 backdrop-blur-md rounded-2xl border border-[#ece7dc] shadow-xl overflow-hidden pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[45vh] md:max-h-[55vh]">
                  <div className="px-4 py-3 bg-black flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#f4b400] animate-pulse" />
                      <span className="text-[11px] font-black text-white tracking-wider uppercase">Komyut AI Guide</span>
                    </div>
                  </div>

                  <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                    {chatHistory.map((msg) => (
                      <div key={msg.id} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                        {msg.role === "ai" && (
                          <div className="w-6 h-6 rounded-lg bg-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                            <span className="text-[#f4b400] text-[10px]">✨</span>
                          </div>
                        )}
                        <div className={`p-3 text-[12px] leading-relaxed shadow-sm rounded-xl max-w-[85%] ${
                          msg.role === "user" ? "bg-[#f4b400] text-black font-semibold rounded-tr-none" : "bg-white border border-[#ece7dc] text-neutral-800 font-medium rounded-tl-none"
                        }`}>
                          {msg.text}
                          {msg.role === "ai" && (
                            <div className="mt-2 pt-2 border-t border-neutral-50 flex items-center justify-end">
                              {currentlyPlayingId === msg.id ? (
                                <div className="flex items-center gap-1.5">
                                  <button onClick={toggleAudio} className="px-2 py-1 bg-neutral-100 text-black text-[10px] font-bold rounded">{isPaused ? "▶" : "⏸"}</button>
                                  <button onClick={stopAudio} className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded">⏹</button>
                                </div>
                              ) : (
                                <button onClick={() => playAudio(msg.audioUrl, msg.id, msg.text)} className="flex items-center gap-1 px-2 py-1 bg-[#f8f6f1] text-black text-[10px] font-bold rounded border border-neutral-200">
                                  🔊 <span className="text-[9px]">Listen</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isAiLoading && (
                      <div className="flex gap-2 items-center text-neutral-400 text-[11px] font-bold animate-pulse">
                        <span className="w-4 h-4 border-2 border-[#f4b400] border-t-transparent rounded-full animate-spin" />
                        KomyutAI is checking routes...
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAskAI(chatInput, routeResult?.routes[selectedRouteIndex]);
                    }}
                    className="p-3 border-t border-[#ece7dc] bg-white bg-opacity-80"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        disabled={!routeResult}
                        placeholder={routeResult ? "Ask about traffic..." : "Search a route..."}
                        className="w-full bg-[#f8f6f1] border border-[#ece7dc] pl-3 pr-9 py-2.5 rounded-xl text-[12px] font-medium outline-none focus:border-[#f4b400] transition-colors disabled:opacity-50"
                      />
                      <button type="submit" disabled={!chatInput.trim() || isAiLoading || !routeResult} className="absolute right-1.5 w-7 h-7 flex items-center justify-center bg-black text-[#f4b400] rounded-lg disabled:opacity-30">↑</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPage;
