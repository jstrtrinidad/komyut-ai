function AppPreview() {
  return (
    <section className="bg-slate-950 px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        {/* Left */}
        <div>
          <div className="mb-5 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            Mobile Experience
          </div>

          <h2 className="text-5xl font-black leading-tight text-white">
            Smart Commuting Anywhere
          </h2>

          <p className="mt-6 max-w-xl leading-relaxed text-slate-300">
            Access AI-powered commute recommendations, route analytics,
            and transportation insights directly from your mobile device.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 font-semibold text-white transition hover:scale-105">
              Download App
            </button>

            <button className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/10">
              Learn More
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex justify-center">
          <div className="relative h-[600px] w-[300px] rounded-[42px] border border-white/10 bg-gradient-to-br from-slate-900 to-blue-950 p-5 shadow-2xl">
            {/* Screen */}
            <div className="flex h-full flex-col rounded-[32px] bg-slate-950 p-6">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  CommuteSmart AI
                </h3>

                <div className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs text-cyan-300">
                  LIVE
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 p-5">
                <p className="text-sm text-slate-400">
                  Recommended Route
                </p>

                <h2 className="mt-3 text-2xl font-bold text-white">
                  QC → Makati
                </h2>

                <div className="mt-5 inline-flex rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
                  42 mins estimated
                </div>
              </div>

              <div className="mt-6 flex-1 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AppPreview;