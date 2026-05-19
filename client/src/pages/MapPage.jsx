import { useEffect, useRef, useState, useCallback } from "react";
import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

const MANILA_CENTER = { lat: 14.5995, lng: 120.9842 };

// ─── Manual Autocomplete Input ────────────────────────────────────────────────
// Uses AutocompleteService directly instead of PlaceAutocompleteElement
// This avoids the shadow DOM / gmp-placeselect event bug in React
function PlaceInput({ placeholder, onPlaceSelect }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const placesLib = useMapsLibrary("places");
  const debounceRef = useRef(null);

  const fetchSuggestions = useCallback(async (value) => {
    if (!placesLib || value.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      // ✅ Uses new AutocompleteSuggestion API — no legacy service needed
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
  }, [placesLib]);

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
      console.log("✅ Place selected:", result);
      setInputValue(place.displayName);
      setSuggestions([]);
      setShowDropdown(false);
      onPlaceSelect(result);
    } catch (err) {
      console.error("Place details error:", err);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        placeholder={placeholder}
        className="w-full bg-transparent text-xs outline-none placeholder-neutral-400 text-black"
      />
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 top-full mt-1 w-[280px] bg-white border border-neutral-100 rounded-lg shadow-lg z-50 overflow-hidden">
          {suggestions.map((s, i) => {
            const pred = s.placePrediction;
            return (
              <button
                key={i}
                onMouseDown={() => handleSelect(s)}
                className="w-full text-left px-3 py-2 text-[11px] text-black hover:bg-[#faf7f2] border-b border-neutral-50 last:border-0 transition-colors"
              >
                <span className="font-medium block truncate">
                  {pred?.mainText?.toString() ?? ""}
                </span>
                <span className="text-neutral-400 text-[10px] block truncate">
                  {pred?.secondaryText?.toString() ?? ""}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Directions Renderer ──────────────────────────────────────────────────────
function DirectionsRenderer({ origin, destination, onRouteReady }) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!routesLib || !map) return;
    rendererRef.current = new routesLib.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#f4b400",
        strokeWeight: 5,
        strokeOpacity: 0.95,
      },
    });
    return () => {
      if (rendererRef.current) rendererRef.current.setMap(null);
    };
  }, [routesLib, map]);

  useEffect(() => {
    if (!routesLib || !rendererRef.current || !origin || !destination) return;

    const service = new routesLib.DirectionsService();

    // Try TRANSIT first (jeepney/bus/MRT routes)
    service.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: routesLib.TravelMode.TRANSIT,
        transitOptions: {
          modes: ["BUS", "RAIL", "SUBWAY", "TRAM"],
          routingPreference: "FEWER_TRANSFERS",
        },
      },
      (result, status) => {
        console.log("Transit status:", status);
        if (status === "OK") {
          rendererRef.current.setDirections(result);
          onRouteReady(result);
        } else {
          // Fallback to DRIVING
          console.warn("No transit route, falling back to driving");
          service.route(
            {
              origin: { lat: origin.lat, lng: origin.lng },
              destination: { lat: destination.lat, lng: destination.lng },
              travelMode: routesLib.TravelMode.DRIVING,
            },
            (r2, s2) => {
              if (s2 === "OK") {
                rendererRef.current.setDirections(r2);
                onRouteReady(r2);
              } else {
                onRouteReady(null);
              }
            }
          );
        }
      }
    );
  }, [routesLib, origin, destination]);

  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
function MapPageInner() {
  const map = useMap();

  const [origin, setOrigin]           = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showRoute, setShowRoute]     = useState(false);
  const [error, setError]             = useState(null);
  const [clearKey, setClearKey]       = useState(0);

  const canSearch = !!origin && !!destination;

  const handleFindRoute = () => {
    console.log("Find Route:", { origin, destination });
    if (!origin || !destination) return;
    setError(null);
    setRouteResult(null);
    setIsSearching(true);
    setShowRoute(true);
  };

  const handleRouteReady = (result) => {
    setIsSearching(false);
    if (!result) {
      setError("Hindi mahanap ang ruta. Subukan ang ibang lokasyon.");
      setShowRoute(false);
      return;
    }
    setRouteResult(result);
    if (map && result.routes[0]?.bounds) {
      map.fitBounds(result.routes[0].bounds, { padding: 60 });
    }
  };

  const handleClear = () => {
    setOrigin(null);
    setDestination(null);
    setRouteResult(null);
    setShowRoute(false);
    setIsSearching(false);
    setError(null);
    setClearKey((k) => k + 1);
    map?.setCenter(MANILA_CENTER);
    map?.setZoom(12);
  };

  const leg = routeResult?.routes[0]?.legs[0];

  return (
    <div className="relative w-screen h-screen font-sans antialiased overflow-hidden bg-[#f8f6f1]">

      {/* MAP */}
      <div className="absolute inset-0 z-0">
        <Map
          defaultCenter={MANILA_CENTER}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI
          style={{ width: "100%", height: "100%" }}
        >
          {showRoute && origin && destination && (
            <DirectionsRenderer
              origin={origin}
              destination={destination}
              onRouteReady={handleRouteReady}
            />
          )}
        </Map>
      </div>

      {/* SIDEBAR */}
      <div className="absolute top-0 left-0 bottom-0 z-10 w-full sm:w-[320px] md:w-[350px] lg:w-1/4 xl:w-1/5 max-w-[360px] flex flex-col bg-[#f8f6f1] text-black shadow-2xl border-r border-neutral-200">

        {/* Header */}
        <div className="p-4 flex flex-col gap-2 bg-white border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-xl font-black tracking-tight text-black">
              komyut <span className="text-[#f4b400]">AI</span>
            </span>
            <div className="text-[10px] font-bold px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-500">PH</div>
          </div>
          <div className="text-[10px] font-black tracking-wider text-[#f4b400]">DIRECTIONS</div>
        </div>

        {/* Inputs */}
        <div className="p-4 flex flex-col gap-3.5 bg-white border-b border-neutral-200">
          <div className="flex flex-col gap-2.5 relative">
            <div className="absolute left-[11px] top-[20px] bottom-[20px] w-0.5 border-l-2 border-dashed border-neutral-200 z-10" />

            {/* FROM */}
            <div className="flex items-center gap-2.5 relative z-20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#f4b400] flex-shrink-0 shadow-[0_0_4px_#f4b400]" />
              <div className="w-full p-2 bg-[#f8f6f1] border border-neutral-100 rounded-lg focus-within:border-[#f4b400] transition-colors">
                <PlaceInput
                  key={`from-${clearKey}`}
                  placeholder="Mula saan?"
                  onPlaceSelect={(place) => {
                    setOrigin(place);
                    setShowRoute(false);
                    setRouteResult(null);
                  }}
                />
              </div>
            </div>

            {/* TO */}
            <div className="flex items-center gap-2.5 relative z-20">
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full flex-shrink-0" />
              <div className="w-full p-2 bg-[#f8f6f1] border border-neutral-100 rounded-lg focus-within:border-[#f4b400] transition-colors">
                <PlaceInput
                  key={`to-${clearKey}`}
                  placeholder="Papunta saan?"
                  onPlaceSelect={(place) => {
                    setDestination(place);
                    setShowRoute(false);
                    setRouteResult(null);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Status indicators */}
          <div className="text-[9px] text-neutral-400 flex gap-2 justify-center">
            <span>{origin ? "🟡 " + origin.name : "⚪ From not set"}</span>
            <span>|</span>
            <span>{destination ? "🟡 " + destination.name : "⚪ To not set"}</span>
          </div>

          {/* Action row */}
          <div className="flex items-center justify-between gap-1">
            <div className="px-2.5 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 text-[10px] font-semibold rounded-md flex items-center gap-1 border border-neutral-200 cursor-pointer transition-colors">
              📅 Depart Now <span className="text-neutral-400 text-[8px]">▼</span>
            </div>
            <button
              onClick={handleFindRoute}
              disabled={!canSearch || isSearching}
              className="px-4 py-1.5 bg-[#f4b400] hover:bg-opacity-90 text-black text-[10px] font-bold rounded-full transition-all shadow-sm flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin inline-block" />
                  ...
                </span>
              ) : "Find Route"}
            </button>
          </div>

          {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
        </div>

        {/* Results */}
        <div className="flex-grow p-5 flex flex-col bg-[#f8f6f1] overflow-y-auto">

          {/* Empty */}
          {!origin && !destination && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-10 h-10 mb-2.5 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-base shadow-sm">📍</div>
              <p className="text-[11px] font-medium text-neutral-500 px-1 leading-relaxed">
                I-type ang iyong lokasyon at destinasyon para makita ang ruta.
              </p>
            </div>
          )}

          {/* Places picked, not searched yet */}
          {(origin || destination) && !isSearching && !routeResult && (
            <div className="flex flex-col gap-2">
              {origin && (
                <div className="w-full bg-white rounded-xl p-3 border border-neutral-100">
                  <p className="text-[9px] font-bold text-[#f4b400] uppercase tracking-wider mb-0.5">From</p>
                  <p className="text-[11px] font-semibold text-black truncate">{origin.name}</p>
                  <p className="text-[10px] text-neutral-400 truncate">{origin.address}</p>
                </div>
              )}
              {destination && (
                <div className="w-full bg-white rounded-xl p-3 border border-neutral-100">
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">To</p>
                  <p className="text-[11px] font-semibold text-black truncate">{destination.name}</p>
                  <p className="text-[10px] text-neutral-400 truncate">{destination.address}</p>
                </div>
              )}
              {origin && destination && (
                <p className="text-[10px] text-neutral-400 text-center mt-1">
                  Click <strong>Find Route</strong> to get directions
                </p>
              )}
            </div>
          )}

          {/* Searching */}
          {isSearching && (
            <div className="flex flex-col items-center justify-center h-full gap-1.5">
              <div className="w-5 h-5 border-2 border-[#f4b400] border-t-transparent rounded-full animate-spin" />
              <p className="text-[11px] text-neutral-500 font-medium">Kinakalkula ang ruta...</p>
            </div>
          )}

          {/* Route result */}
          {routeResult && leg && (
            <div className="flex flex-col gap-3">
              <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
                <div className="px-3 py-2 bg-[#f4b400]">
                  <p className="text-[10px] font-black text-black tracking-wider uppercase">Route Found</p>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 font-medium">Distance</span>
                    <span className="text-[12px] font-bold text-black">{leg.distance?.text ?? "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 font-medium">Travel Time</span>
                    <span className="text-[12px] font-bold text-black">{leg.duration?.text ?? "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 font-medium">Via</span>
                    <span className="text-[11px] font-semibold text-black text-right max-w-[120px] leading-tight">
                      {routeResult.routes[0]?.summary ?? "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-100 p-3 flex flex-col gap-2">
                <div>
                  <p className="text-[9px] font-bold text-[#f4b400] uppercase tracking-wider mb-0.5">From</p>
                  <p className="text-[11px] font-semibold text-black leading-tight">{origin?.name}</p>
                </div>
                <div className="h-px bg-neutral-100" />
                <div>
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">To</p>
                  <p className="text-[11px] font-semibold text-black leading-tight">{destination?.name}</p>
                </div>
              </div>

              {leg.steps?.length > 0 && (
                <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
                  <div className="px-3 py-2 border-b border-neutral-100">
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Turn-by-turn</p>
                  </div>
                  <div className="flex flex-col divide-y divide-neutral-50 max-h-[240px] overflow-y-auto">
                    {leg.steps.map((step, i) => (
                      <div key={i} className="px-3 py-2 flex items-start gap-2">
                        <span className="text-[10px] font-bold text-[#f4b400] mt-0.5 flex-shrink-0">{i + 1}</span>
                        <div>
                          <p
                            className="text-[10px] text-black leading-snug"
                            dangerouslySetInnerHTML={{ __html: step.instructions ?? "" }}
                          />
                          <p className="text-[9px] text-neutral-400 mt-0.5">{step.distance?.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleClear}
                className="w-full py-2 rounded-xl border border-neutral-200 text-[10px] font-semibold text-neutral-500 hover:bg-neutral-100 transition-colors"
              >
                ✕ Clear Route
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-white border-t border-neutral-200 text-center">
          <p className="text-[8px] font-medium text-neutral-400 tracking-wide">&copy; 2026 KOMYUT AI</p>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-1 shadow-md rounded-lg overflow-hidden border border-neutral-200">
        <button
          onClick={() => map?.setZoom((map.getZoom() ?? 12) + 1)}
          className="w-10 h-10 bg-white hover:bg-neutral-50 text-neutral-700 font-bold text-lg flex items-center justify-center transition-colors"
        >+</button>
        <button
          onClick={() => map?.setZoom((map.getZoom() ?? 12) - 1)}
          className="w-10 h-10 bg-white hover:bg-neutral-50 text-neutral-700 font-bold text-lg border-t border-neutral-100 flex items-center justify-center transition-colors"
        >−</button>
      </div>
    </div>
  );
}

export default MapPageInner;