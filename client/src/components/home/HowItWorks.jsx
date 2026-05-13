import {
  Search,
  Brain,
  Route,
} from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Enter Destination",
      description:
        "Input your starting point and destination to begin smarter route planning.",
    },

    {
      icon: Brain,
      title: "AI Route Analysis",
      description:
        "Komyut AI analyzes traffic, crowd levels, and transportation options.",
    },

    {
      icon: Route,
      title: "Get Smart Recommendations",
      description:
        "Receive optimized commute suggestions instantly across Metro Manila.",
    },
  ];

  return (
    <section className="bg-[#f8f6f1] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <div className="inline-flex rounded-full bg-[#fff4d6] px-5 py-2 text-sm font-medium text-[#c58b00]">
            Smart Commuting Process
          </div>

          <h2 className="mt-8 text-5xl font-black leading-tight text-black">
            How Komyut AI Works
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#5f6368]">
            Intelligent commuting simplified into a smarter and easier
            transportation experience.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="rounded-[32px] border border-[#ece7dc] bg-white p-10 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff4d6]">
                  <Icon
                    size={30}
                    className="text-[#f4b400]"
                  />
                </div>

                {/* Content */}
                <h3 className="mt-8 text-3xl font-black text-black">
                  {step.title}
                </h3>

                <p className="mt-6 leading-relaxed text-[#5f6368]">
                  {step.description}
                </p>

                {/* Step Number */}
                <div className="mt-10 text-sm font-semibold text-[#f4b400]">
                  Step 0{index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;