function PopularRoutes() {
  const destinations = [
    "Makati",
    "BGC",
    "Cubao",
    "Ortigas",
    "Manila",
    "Pasig",
  ];

  return (
    <section className="bg-[#f8f6f1] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-5xl font-bold text-black">
              Popular Destinations
            </h2>

            <p className="mt-5 text-lg text-[#5f6368]">
              Frequently searched commute destinations around Metro Manila.
            </p>
          </div>

          <button className="hidden text-lg font-semibold text-[#f4b400] md:block">
            View all →
          </button>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((place, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[32px] border border-[#ece7dc] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image Placeholder */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#ffe082] to-[#fff4d6]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                <div className="absolute bottom-5 left-5 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
                    Metro Manila
                </div>
                </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-3xl font-bold text-black">
                  {place}
                </h3>

                <p className="mt-4 leading-relaxed text-[#5f6368]">
                  Discover optimized commute routes, transit options, and
                  nearby stations around {place}.
                </p>

             
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularRoutes;