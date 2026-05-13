import { useState } from "react";

import {
  MapPin,
  Navigation,
  Sparkles,
} from "lucide-react";

import useCommuteAI from "../../hooks/useCommuteAI";

function RouteSearch() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <section className="relative z-20 bg-transparent px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto -mb-16 max-w-6xl rounded-[32px] border border-[#ece7dc] bg-white p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          {/* Inputs */}
          <div className="grid items-start gap-5 lg:grid-cols-[1fr_1fr_auto]">
            {/* FROM */}
            <div className="rounded-2xl border border-[#ece7dc] px-5 py-4">
              <p className="text-sm text-[#5f6368]">
                From
              </p>

              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Enter starting point"
                className="mt-2 w-full bg-transparent text-lg outline-none placeholder:text-[#9aa0a6]"
              />
            </div>

            {/* TO */}
            <div className="rounded-2xl border border-[#ece7dc] px-5 py-4">
              <p className="text-sm text-[#5f6368]">
                To
              </p>

              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Enter destination"
                className="mt-2 w-full bg-transparent text-lg outline-none placeholder:text-[#9aa0a6]"
              />
            </div>

            {/* BUTTON */}
            <button className="h-[72px] rounded-2xl bg-[#f4b400] px-10 text-lg font-semibold text-black transition hover:bg-[#ffca28]">
            Find Route
            </button>
          </div>

          {/* Chips */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-[#5f6368]">
              Popular:
            </p>

            {["Cubao", "Makati", "Pasig", "BGC", "Manila"].map(
              (place) => (
                <button
                  key={place}
                  className="rounded-full border border-[#ece7dc] px-5 py-2 text-sm font-medium text-[#5f6368] transition hover:bg-[#faf7f2]"
                >
                  {place}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default RouteSearch;