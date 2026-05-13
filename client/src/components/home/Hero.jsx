import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="overflow-hidden bg-[#f8f6f1] pt-8 md:pt-12">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2">
        {/* LEFT */}
        <div>
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#fff4d6] px-4 py-2 text-sm font-medium text-[#c58b00]">
            Smart Metro Manila Commutes
          </div>

          {/* Heading */}
          <h1 className="max-w-2xl text-6xl font-black leading-[1.05] tracking-tight text-black">
            Smarter Commutes.
            <br />
            Better
            <span className="text-[#f4b400]"> Everyday.</span>
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-xl text-xl leading-relaxed text-[#5f6368]">
            Komyut AI helps you find the best commute routes across Metro
            Manila with real-time updates and AI-powered suggestions.
          </p>

          {/* Decorative */}
          <div className="mt-8 h-2 w-16 rounded-full bg-[#f4b400]"></div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          {/* Background Circle */}
          <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-[#ffe082] blur-3xl opacity-40"></div>

          {/* Main Card */}
          <div className="relative overflow-hidden rounded-[40px] border border-[#ece7dc] bg-white shadow-xl">
            {/* Map BG */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

            <div className="relative p-10">
              {/* Floating Pills */}
              <div className="mb-8 flex gap-3">
                <div className="rounded-full bg-[#fff4d6] px-4 py-2 text-sm font-medium text-[#c58b00]">
                  MRT Friendly
                </div>

                <div className="rounded-full bg-[#fff4d6] px-4 py-2 text-sm font-medium text-[#c58b00]">
                  AI Suggested
                </div>
              </div>

              {/* Fake Illustration */}
              <div className="flex h-[420px] items-center justify-center rounded-[32px] bg-gradient-to-br from-[#fff9eb] to-[#fff1c2]">
                <div className="text-center">
                  <div className="text-8xl">
                    🚍
                  </div>

                  <h3 className="mt-6 text-3xl font-black text-black">
                    Manila Commute Map
                  </h3>

                  <p className="mt-3 text-[#5f6368]">
                    Interactive commute visualization preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;