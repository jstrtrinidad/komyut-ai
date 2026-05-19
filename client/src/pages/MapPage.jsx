import { useEffect, useRef, useState, useCallback } from "react";
import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

const MANILA_CENTER = { lat: 14.5995, lng: 120.9842 };

// ─── Manual Autocomplete Input ────────────────────────────────────────────────
function PlaceInput({ placeholder, onPlaceSelect }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const placesLib = useMapsLibrary("places");
  const debounceRef = useRef(null);

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
            locationBias: {
              center: { lat: 14.5995, lng: 120.9842 },
              radius: 50000,
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
        className="w-full bg-transparent text-[13px] outline-none placeholder-neutral-400 text-neutral-800"
      />
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 top-full mt-2 w-[280px] bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={() => handleSelect(s)}
              className="w-full text-left px-4 py-3 text-[12px] text-black hover:bg-neutral-50 border-b border-neutral-100 last:border-0"
            >
              <span className="font-semibold block truncate">
                {s.placePrediction?.mainText?.toString()}
              </span>
              <span className="text-neutral-400 text-[11px] block truncate mt-0.5">
                {s.placePrediction?.secondaryText?.toString()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Directions Renderer ──────────────────────────────────────────────────────
function DirectionsRenderer({
  origin,
  destination,
  travelMode,
  routeIndex,
  onRouteReady,
}) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!routesLib || !map) return;
    rendererRef.current = new routesLib.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#0F53FF",
        strokeWeight: 5,
        strokeOpacity: 0.8,
      },
    });
    return () => {
      if (rendererRef.current) rendererRef.current.setMap(null);
    };
  }, [routesLib, map]);

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setRouteIndex(routeIndex);
    }
  }, [routeIndex]);

  useEffect(() => {
    if (!routesLib || !rendererRef.current || !origin || !destination) return;
    const service = new routesLib.DirectionsService();

    service.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: travelMode || routesLib.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        ...(travelMode === routesLib.TravelMode.TRANSIT && {
          transitOptions: { modes: ["BUS", "RAIL", "SUBWAY", "TRAM"] },
        }),
      },
      (result, status) => {
        if (status === "OK") {
          rendererRef.current.setDirections(result);
          onRouteReady(result);
        } else {
          console.warn("Directions request failed due to " + status);
          onRouteReady(null);
        }
      },
    );
  }, [routesLib, origin, destination, travelMode]);

  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
function MapPageInner() {
  const map = useMap();
  const audioRef = useRef(null);

  // Track auto-prompts to prevent React Strict Mode double-firing
  const lastAutoPrompt = useRef("");

  // Map States
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [travelMode, setTravelMode] = useState("DRIVING");

  const [isSearching, setIsSearching] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [clearKey, setClearKey] = useState(0);

  // Chat & AI Audio States
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const chatContainerRef = useRef(null);
  const canSearch = !!origin && !!destination;

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isAiLoading]);

  // ─── Audio Handlers (With Native Fallback) ──────────────────────────────
  const playAudio = (url, id, text) => {
    // Always stop anything currently playing first
    stopAudio();

    if (url) {
      // 1. Play Gemini API Audio
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onplay = () => {
        setCurrentlyPlayingId(id);
        setIsPaused(false);
      };
      audio.onpause = () => setIsPaused(true);
      audio.onended = () => {
        setCurrentlyPlayingId(null);
        setIsPaused(false);
      };
      audio.play().catch((e) => console.error("Playback failed:", e));
    } else if ("speechSynthesis" in window && text) {
      // 2. Native Browser TTS Fallback
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;

      utterance.onstart = () => {
        setCurrentlyPlayingId(id);
        setIsPaused(false);
      };
      utterance.onpause = () => setIsPaused(true);
      utterance.onresume = () => setIsPaused(false);
      utterance.onend = () => {
        setCurrentlyPlayingId(null);
        setIsPaused(false);
      };
      utterance.onerror = () => {
        setCurrentlyPlayingId(null);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      // Toggle API Audio
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else if ("speechSynthesis" in window) {
      // Toggle Native Audio
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentlyPlayingId(null);
    setIsPaused(false);
  };

  // Cleanup native speech if component unmounts
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ─── AI Fetch Handler ────────────────────────────────────────────────────
  const handleAskAI = async (customPrompt, contextRoute = null) => {
    if (!customPrompt.trim()) return;

    setChatHistory((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", text: customPrompt },
    ]);
    setChatInput("");
    setIsAiLoading(true);

    let routeContextText = "";
    if (contextRoute) {
      const leg = contextRoute.legs[0];
      const cleanSteps = leg.steps
        .map((s) => s.instructions.replace(/<[^>]*>?/gm, ""))
        .join(" -> ");

      routeContextText = `
        MAPS ROUTE DATA:
        Mode: ${travelMode}
        Distance: ${leg.distance.text}
        Duration: ${leg.duration.text}
        Summary: ${contextRoute.summary || "Direct"}
        Steps: ${cleanSteps}
      `;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/commute-info",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: customPrompt,
            origin: origin?.name || origin?.address,
            destination: destination?.name || destination?.address,
            routeContext: routeContextText,
          }),
        },
      );
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
  };

  const handleFindRoute = () => {
    if (!canSearch) return;
    setRouteResult(null);
    setSelectedRouteIndex(0);
    setIsSearching(true);
    setShowRoute(true);
    lastAutoPrompt.current = ""; // Reset tracker on new search
  };

  const handleRouteReady = (result) => {
    setIsSearching(false);
    if (!result) {
      setShowRoute(false);
      return;
    }
    setRouteResult(result);
    if (map && result.routes[0]?.bounds) {
      map.fitBounds(result.routes[0].bounds, { padding: 80 });
    }

    const routeSignature = `${travelMode}-${origin.name}-${destination.name}`;

    // Only fire the AI prompt if we haven't already done it for this exact search
    if (lastAutoPrompt.current !== routeSignature) {
      lastAutoPrompt.current = routeSignature;
      handleAskAI(
        `Please analyze this ${travelMode.toLowerCase()} commute from ${origin.name} to ${destination.name}.`,
        result.routes[0],
      );
    }
  };

  useEffect(() => {
    if (showRoute) handleFindRoute();
  }, [travelMode]);

  return (
    <div className="relative w-screen h-screen flex bg-neutral-100 font-sans">
      {/* SIDEBAR */}
      <div className="relative z-10 w-[400px] flex flex-col bg-white shadow-xl border-r border-neutral-200 h-full">
        <div className="p-4 flex items-center justify-between border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-black text-[#f4b400] text-sm">
              ✨
            </div>
            <span className="text-lg font-bold">
              Komyut<span className="text-[#f4b400]">AI</span>
            </span>
          </div>
          <button
            onClick={() => {
              setOrigin(null);
              setDestination(null);
              setRouteResult(null);
              setShowRoute(false);
              setChatHistory([]);
              setClearKey((k) => k + 1);
              stopAudio();
            }}
            className="text-[11px] font-semibold text-neutral-400"
          >
            Reset
          </button>
        </div>

        {/* Travel Modes */}
        <div className="flex items-center justify-center gap-6 py-3 border-b border-neutral-100 bg-neutral-50">
          <button
            onClick={() => setTravelMode("DRIVING")}
            className={`p-2 rounded-full transition-colors ${travelMode === "DRIVING" ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-neutral-500 hover:bg-neutral-200"}`}
          >
            🚗
          </button>
          <button
            onClick={() => setTravelMode("TRANSIT")}
            className={`p-2 rounded-full transition-colors ${travelMode === "TRANSIT" ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-neutral-500 hover:bg-neutral-200"}`}
          >
            🚆
          </button>
          <button
            onClick={() => setTravelMode("WALKING")}
            className={`p-2 rounded-full transition-colors ${travelMode === "WALKING" ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-neutral-500 hover:bg-neutral-200"}`}
          >
            🚶
          </button>
        </div>

        {/* Search Inputs */}
        <div className="p-4 flex flex-col gap-3 border-b border-neutral-100">
          <div className="relative flex flex-col gap-3">
            <div className="absolute left-[15px] top-[28px] bottom-[28px] w-0.5 border-l-2 border-dashed border-neutral-200 z-10" />
            <div className="flex items-center gap-3 relative z-20">
              <div className="w-3 h-3 rounded-full bg-transparent border-2 border-[#1a73e8] flex-shrink-0 bg-white" />
              <div className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg">
                <PlaceInput
                  key={`from-${clearKey}`}
                  placeholder="Choose starting point..."
                  onPlaceSelect={(p) => {
                    setOrigin(p);
                    setShowRoute(false);
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 relative z-20">
              <div className="w-3 h-3 bg-[#ea4335] rounded-full flex-shrink-0" />
              <div className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg">
                <PlaceInput
                  key={`to-${clearKey}`}
                  placeholder="Choose destination..."
                  onPlaceSelect={(p) => {
                    setDestination(p);
                    setShowRoute(false);
                  }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleFindRoute}
            disabled={!canSearch || isSearching}
            className="w-full py-2.5 mt-1 bg-[#1a73e8] text-white text-[13px] font-bold rounded-lg disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search Routes"}
          </button>
        </div>

        {/* Route Alternatives */}
        {routeResult && (
          <div className="flex flex-col border-b border-neutral-100 bg-white flex-shrink-0 max-h-[30vh] overflow-y-auto custom-scrollbar">
            {routeResult.routes.map((route, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedRouteIndex(idx);
                  handleAskAI(
                    `Analyze alternative route via ${route.summary}`,
                    route,
                  );
                }}
                className={`flex items-start justify-between p-4 border-l-4 border-b border-b-neutral-100 text-left transition-all ${
                  selectedRouteIndex === idx
                    ? "border-l-[#1a73e8] bg-[#f8faff]"
                    : "border-l-transparent bg-white hover:bg-neutral-50"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="text-[14px] font-semibold text-[#188038]">
                    {route.legs[0].duration.text}
                  </div>
                  <div className="text-[13px] font-medium text-neutral-800">
                    via {route.summary || "Main Route"}
                  </div>
                </div>
                <div className="text-[12px] text-neutral-500">
                  {route.legs[0].distance.text}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Chat Area */}
        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto p-5 flex flex-col gap-5 bg-white custom-scrollbar"
        >
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}
            >
              {/* AI Avatar */}
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <span className="text-[#f4b400] text-sm">✨</span>
                </div>
              )}

              {/* Chat Bubble */}
              <div
                className={`relative max-w-[85%] p-4 text-[13px] leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-[#f4b400] text-black font-medium rounded-2xl rounded-tr-sm"
                    : "bg-white border border-neutral-200 text-neutral-800 rounded-2xl"
                }`}
              >
                {msg.text}

                {/* --- AUDIO PUCK CONTROLS --- */}
                {/* Shows unconditionally for AI messages now, using native fallback if audioUrl is null */}
                {msg.role === "ai" && (
                  <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-end">
                    {currentlyPlayingId === msg.id ? (
                      <div className="flex items-center gap-2">
                        {/* Audio visualizer dots */}
                        {!isPaused && (
                          <div className="flex gap-0.5 opacity-70 mr-2">
                            <div
                              className="w-0.5 h-2 bg-black animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-0.5 h-3 bg-black animate-bounce"
                              style={{ animationDelay: "100ms" }}
                            />
                            <div
                              className="w-0.5 h-2 bg-black animate-bounce"
                              style={{ animationDelay: "200ms" }}
                            />
                          </div>
                        )}

                        <button
                          onClick={toggleAudio}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-[11px] font-bold rounded-lg border border-neutral-200 transition-colors"
                        >
                          {isPaused ? "▶ Resume" : "⏸ Pause"}
                        </button>
                        <button
                          onClick={stopAudio}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold rounded-lg border border-red-100 transition-colors"
                        >
                          ⏹ Stop
                        </button>
                      </div>
                    ) : (
                      /* The standard "Listen" Puck */
                      <button
                        onClick={() =>
                          playAudio(msg.audioUrl, msg.id, msg.text)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-[11px] font-bold rounded-lg border border-neutral-200 transition-colors"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-[#1a73e8]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Listen
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isAiLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">✨</span>
              </div>
              <div className="text-neutral-400 text-[12px] font-medium animate-pulse">
                Analyzing route...
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAI(chatInput, routeResult?.routes[selectedRouteIndex]);
          }}
          className="p-3 border-t border-neutral-100 bg-white"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask AI about this route..."
            className="w-full bg-neutral-100 px-4 py-2.5 rounded-full text-[13px] outline-none"
          />
        </form>
      </div>

      {/* MAP */}
      <div className="relative flex-grow">
        <Map defaultCenter={MANILA_CENTER} defaultZoom={12} disableDefaultUI>
          {showRoute && origin && destination && (
            <DirectionsRenderer
              origin={origin}
              destination={destination}
              travelMode={travelMode}
              routeIndex={selectedRouteIndex}
              onRouteReady={handleRouteReady}
            />
          )}
        </Map>
      </div>
    </div>
  );
}

export default MapPageInner;
