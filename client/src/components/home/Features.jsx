import { Clock3, Route, Wallet, MapPin } from "lucide-react";

function Features() {
  const features = [
    {
      icon: Clock3,
      title: "Real-time Updates",
      description:
        "Get live transit updates and traffic alerts to avoid delays.",
    },

    {
      icon: Route,
      title: "Smart Route Suggestions",
      description: "AI-powered commute recommendations",
    },

    {
      icon: Wallet,
      title: "Fare Information",
      description:
        "Up-to-date fare guides for jeepneys, buses, MRT, LRT, and more.",
    },

    {
      icon: MapPin,
      title: "Easy Terminal Guide",
      description: "Find terminals and stations across Metro Manila with ease.",
    },
  ];

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-5xl font-bold leading-tight text-black">
            Why commute smarter with
            <span className="text-[#f4b400]"> Komyut AI?</span>
          </h2>

          <div className="mx-auto mt-6 h-1.5 w-20 rounded-full bg-[#f4b400]"></div>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="rounded-[32px] border border-[#ece7dc] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff4d6]">
                  <Icon size={30} className="text-[#f4b400]" />
                </div>

                {/* Text */}
                <h3 className="mt-8 text-2xl font-bold text-black">
                  {feature.title}
                </h3>

                <p className="mt-5 leading-relaxed text-[#5f6368]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
