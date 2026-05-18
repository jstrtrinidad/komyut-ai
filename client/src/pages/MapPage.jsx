import { useEffect, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

const MANILA_CENTER = { lat: 14.5995, lng: 120.9842 };

// ─── Place Autocomplete Input ─────────────────────────────────────────────────
function PlaceAutocompleteInput({ onPlaceSelect }) {
  const containerRef = useRef(null);
  const placesLib = useMapsLibrary("places");
  const onSelectRef = useRef(onPlaceSelect);

  useEffect(() => {
    onSelectRef.current = onPlaceSelect;
  }, [onPlaceSelect]);

  useEffect(() => {
    if (!placesLib || !containerRef.current) return;
    containerRef.current.innerHTML = "";

    const element = new placesLib.PlaceAutocompleteElement({
      componentRestrictions: { country: "ph" },
    });

    Object.assign(element.style, {
      width: "100%",
      border: "none",
      outline: "none",
      background: "transparent",
      fontSize: "12px",
      fontFamily: "inherit",
      color: "#000",
    });

    containerRef.current.appendChild(element);

    const handler = async (e) => {
      try {
        const place = e.placePrediction.toPlace();
        await place.fetchFields({
          fields: ["displayName", "formattedAddress", "location"],
        });
        const result = {
          name: place.displayName,
          address: place.formattedAddress,
          lat: place.location.lat(),
          lng: place.location.lng(),
        };
        console.log("Place selected:", result);
        onSelectRef.current(result);
      } catch (err) {
        console.error("Place select error:", err);
      }
    };

    element.addEventListener("gmp-placeselect", handler);

    return () => {
      element.removeEventListener("gmp-placeselect", handler);
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [placesLib]);

  return <div ref={containerRef} className="w-full" />;
}

// ─── Directions Renderer ──────────────────────────────────────────────────────
function DirectionsRenderer({ origin, destination, onRouteReady }) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const rendererRef = useRef(null);

  // Set up renderer once
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

  // Fetch route when origin/destination change
  useEffect(() => {
    if (!routesLib || !rendererRef.current || !origin || !destination) return;

    const service = new routesLib.DirectionsService();
    service.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: routesLib.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      },
      (result, status) => {
        console.log("Directions status:", status);
        if (status === "OK") {
          rendererRef.current.setDirections(result);
          onRouteReady(result);
        } else {
          console.error("Directions failed:", status);
          onRouteReady(null);
        }
      }
    );
  }, [routesLib, origin, destination]);

  return null;
}

// ─── Main Inner Component ─────────────────────────────────────────────────────
function MapPageInner() {
  const map = useMap();

  const [origin, setOrigin]           = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showRoute, setShowRoute]     = useState(false);
  const [error, setError]             = useState(null);

  const canSearch = origin && destination;

  // ── handlers ────────────────────────────────────────────────────────────────
  const handleFindRoute = () => {
    console.log("Find Route clicked — origin:", origin, "dest:", destination);
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
    map?.setCenter(MANILA_CENTER);
    map?.setZoom(12);
  };

  const leg = routeResult?.routes[0]?.legs[0];

  // ── render ──────────────────────────────────────────────────────────────────
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

            {/* Connector line */}
            <div className="absolute left-[11px] top-[20px] bottom-[20px] w-0.5 border-l-2 border-dashed border-neutral-200 z-10" />

            {/* FROM */}
            <div className="flex items-center gap-2.5 relative z-20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#f4b400] flex-shrink-0 shadow-[0_0_4px_#f4b400]" />
              <div className="w-full p-2 bg-[#f8f6f1] border border-neutral-100 rounded-lg focus-within:border-[#f4b400] transition-colors">
                <PlaceAutocompleteInput
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
                <PlaceAutocompleteInput
                  onPlaceSelect={(place) => {
                    setDestination(place);
                    setShowRoute(false);
                    setRouteResult(null);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action row */}
          <div className="flex items-center justify-between gap-1 mt-0.5">
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

          {error && (
            <p className="text-[10px] text-red-500 font-medium">{error}</p>
          )}
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

          {/* Selected but not searched */}
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

          {/* Route found */}
          {routeResult && leg && (
            <div className="flex flex-col gap-3">

              {/* Summary */}
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

              {/* From → To */}
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

              {/* Turn by turn */}
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