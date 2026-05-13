function StatsSection() {
  const stats = [
    {
      number: "50K+",
      label: "Monthly Users",
    },

    {
      number: "120+",
      label: "Supported Routes",
    },

    {
      number: "95%",
      label: "Prediction Accuracy",
    },

    {
      number: "24/7",
      label: "AI Assistance",
    },
  ];

  return (
    <section className="bg-slate-950 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl"
            >
              <h2 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-5xl font-black text-transparent">
                {stat.number}
              </h2>

              <p className="mt-4 text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;