import {
  AlertTriangle,
  Train,
  Bus,
} from "lucide-react";

function LiveTraffic() {
  const traffic = [
    {
      icon: AlertTriangle,
      route: "EDSA Northbound",
      status: "Heavy Traffic",
      color: "bg-red-100 text-red-600",
    },

    {
      icon: Train,
      route: "MRT Line 3",
      status: "Moderate Crowd",
      color: "bg-yellow-100 text-yellow-700",
    },

    {
      icon: Bus,
      route: "BGC Bus Routes",
      status: "Smooth Flow",
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <section className="bg-[#f8f6f1] px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        {/* LEFT */}
        <div>
          {/* Badge */}
          <div className="inline-flex rounded-full bg-[#fff4d6] px-5 py-2 text-sm font-medium text-[#c58b00]">
            Live Commute Insights
          </div>

          {/* Heading */}
          <h2 className="mt-8 text-5xl font-black leading-tight text-black">
            Real-Time Traffic Monitoring
          </h2>

          {/* Description */}
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#5f6368]">
            Stay updated with smarter transportation insights and live
            commuter conditions across major Metro Manila routes.
          </p>

          {/* Cards */}
          <div className="mt-12 space-y-5">
            {traffic.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-[28px] border border-[#ece7dc] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff4d6]">
                      <Icon
                        size={24}
                        className="text-[#f4b400]"
                      />
                    </div>

                    {/* Route */}
                    <div>
                      <h3 className="text-xl font-bold text-black">
                        {item.route}
                      </h3>

                      <p className="mt-1 text-sm text-[#9aa0a6]">
                        Metro Manila Route
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${item.color}`}
                  >
                    {item.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className="rounded-[40px] border border-[#ece7dc] bg-white p-8 shadow-sm">
          <div className="flex h-[500px] items-center justify-center rounded-[32px] bg-gradient-to-br from-[#fff8e1] to-[#fff4d6]">
            <div className="text-center">
              <div className="text-8xl">
                🗺️
              </div>

              <h3 className="mt-6 text-3xl font-black text-black">
                Metro Manila Heatmap
              </h3>

              <p className="mt-4 text-[#5f6368]">
                Live commute traffic visualization preview
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LiveTraffic;