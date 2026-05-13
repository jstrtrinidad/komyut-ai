function StorySection() {
  return (
    <section className="bg-slate-950 px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        {/* Left */}
        <div>
          <div className="mb-5 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            Our Story
          </div>

          <h2 className="text-5xl font-black leading-tight text-white">
            Built for Modern Urban Commuters
          </h2>

          <p className="mt-6 leading-relaxed text-slate-300">
            CommuteSmart AI was conceptualized to address the growing
            transportation challenges experienced daily in Metro Manila.
          </p>

          <p className="mt-5 leading-relaxed text-slate-400">
            By combining AI-powered recommendations, route intelligence,
            and predictive transportation insights, the platform aims to
            make commuting smarter, faster, and more accessible.
          </p>
        </div>

        {/* Right */}
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-10 backdrop-blur-2xl">
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-900/60 p-6">
              <h3 className="text-lg font-bold text-white">
                AI Route Planning
              </h3>

              <p className="mt-3 text-slate-400">
                Intelligent transportation recommendations for commuters.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/60 p-6">
              <h3 className="text-lg font-bold text-white">
                Crowd Prediction
              </h3>

              <p className="mt-3 text-slate-400">
                Predict transportation congestion and travel patterns.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/60 p-6">
              <h3 className="text-lg font-bold text-white">
                Smart Travel Insights
              </h3>

              <p className="mt-3 text-slate-400">
                Travel smarter with real-time analytics and AI support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StorySection;