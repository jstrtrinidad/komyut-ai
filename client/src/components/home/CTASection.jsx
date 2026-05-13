function CTASection() {
  return (
    <section className="bg-[#f8f6f1] px-6 py-24">
      <div className="mx-auto max-w-6xl rounded-[40px] bg-[#f4b400] px-10 py-20 text-center shadow-xl md:px-20">
        <h2 className="mx-auto max-w-4xl text-5xl font-black leading-tight text-black">
          Start commuting smarter around Metro Manila today.
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-[#3d3d3d]">
          Discover AI-powered route suggestions, live transportation
          insights, and smarter daily commuting experiences.
        </p>

        <button className="mt-12 rounded-2xl bg-black px-10 py-5 text-lg font-semibold text-white transition hover:opacity-90">
          Start Exploring
        </button>
      </div>
    </section>
  );
}

export default CTASection;