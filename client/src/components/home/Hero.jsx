import { useState } from "react";
import heroBg from "../../assets/images/hero-background.png";

function Hero() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#f8f6f1]/20"></div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#fff4d6] px-4 py-2 text-sm font-medium text-[#c58b00] backdrop-blur-sm">
            Smart Metro Manila Commutes
          </div>

          {/* Heading */}
          <h1 className="max-w-2xl text-5xl font-bold leading-[1.02] tracking-tight text-black md:text-6xl">
            Smarter Commutes.
            <br />
            Better
            <span className="text-[#f4b400]"> Everyday.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-lg text-sm leading-6 text-[#5f6368] md:text-base">
            Komyut AI helps you find the best commute routes across Metro
            Manila with real-time updates and AI-powered suggestions.
          </p>

          {/* Decorative */}
          <div className="mt-6 h-1.5 w-14 rounded-full bg-[#f4b400]"></div>

          {/* Search Bar */}
          <div className="mt-8 max-w-3xl rounded-[24px] border border-white/60 bg-white/85 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur-md">

            {/* Inputs */}
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">

              {/* FROM */}
              <div className="rounded-xl border border-[#ece7dc] bg-white px-4 py-3">
                <p className="text-xs font-medium text-[#5f6368]">
                  From
                </p>

                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Enter starting point"
                  className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-[#9aa0a6]"
                />
              </div>

              {/* TO */}
              <div className="rounded-xl border border-[#ece7dc] bg-white px-4 py-3">
                <p className="text-xs font-medium text-[#5f6368]">
                  To
                </p>

                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Enter destination"
                  className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-[#9aa0a6]"
                />
              </div>

              {/* BUTTON */}
              <button className="rounded-xl bg-[#f4b400] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#ffca28]">
                Find Route
              </button>
            </div>

            {/* Popular */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium text-[#5f6368]">
                Popular:
              </p>

              {["Cubao", "Makati", "Pasig", "Alabang", "Manila"].map(
                (place) => (
                  <button
                    key={place}
                    className="rounded-full border border-[#ece7dc] bg-white px-3 py-1.5 text-xs font-medium text-[#5f6368] transition hover:bg-[#faf7f2]"
                  >
                    {place}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;