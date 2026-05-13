import {
  Brain,
  Clock3,
  Users,
  Train,
} from "lucide-react";

function AISection() {
  const insights = [
    {
      icon: Clock3,
      title: "Best Departure Time",
      value: "7:15 AM",
    },

    {
      icon: Users,
      title: "Crowd Prediction",
      value: "Moderate Traffic",
    },

    {
      icon: Train,
      title: "Suggested Transport",
      value: "MRT + Walk",
    },
  ];

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 rounded-[40px] border border-[#ece7dc] bg-[#f8f6f1] p-10 shadow-sm lg:grid-cols-2 lg:p-16">
        {/* LEFT */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fff4d6] px-5 py-2 text-sm font-medium text-[#c58b00]">
            <Brain size={16} />
            AI Recommendation Engine
          </div>

          {/* Heading */}
          <h2 className="mt-8 text-5xl font-black leading-tight text-black">
            Personalized
            <br />
            Commute Intelligence
          </h2>

          {/* Description */}
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#5f6368]">
            Receive smarter transportation insights based on traffic
            conditions, commuter patterns, crowd levels, and travel
            behavior across Metro Manila.
          </p>

          {/* CTA */}
          <button className="mt-10 rounded-2xl bg-[#f4b400] px-8 py-4 text-lg font-semibold text-black transition hover:bg-[#ffca28]">
            Explore AI Features
          </button>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          {insights.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="rounded-[28px] border border-[#ece7dc] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#9aa0a6]">
                      {item.title}
                    </p>

                    <h3 className="mt-4 text-4xl font-black text-black">
                      {item.value}
                    </h3>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff4d6]">
                    <Icon
                      size={24}
                      className="text-[#f4b400]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AISection;