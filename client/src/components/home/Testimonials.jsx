function Testimonials() {
  const testimonials = [
    {
      name: "Miguel Santos",
      comment:
        "Komyut AI helped me avoid rush hour traffic and reduce my commute time daily.",
    },

    {
      name: "Angela Cruz",
      comment:
        "Finally a commuting platform designed specifically for Metro Manila commuters.",
    },

    {
      name: "Paolo Reyes",
      comment:
        "The route recommendations are clean, simple, and actually useful.",
    },
  ];

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-5xl font-bold text-black">
            Loved by daily commuters
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#5f6368]">
            Hear from Metro Manila commuters using Komyut AI every day.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="rounded-[32px] border border-[#ece7dc] bg-[#f8f6f1] p-8 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-5xl text-[#f4b400]">
                “
              </div>

              <p className="mt-4 text-lg leading-relaxed text-[#5f6368]">
                {item.comment}
              </p>

              <div className="mt-10">
                <h3 className="text-xl font-bold text-black">
                  {item.name}
                </h3>

                <p className="mt-1 text-sm text-[#9aa0a6]">
                  Metro Manila Commuter
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;