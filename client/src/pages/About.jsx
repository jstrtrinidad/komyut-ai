import Mission from "../components/about/Mission";
import StorySection from "../components/about/StorySection";
import TeamSection from "../components/about/TeamSection";

function About() {
  return (
    <>
      {/* HERO */}
      <section className="bg-[#f8f6f1] px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex rounded-full bg-[#fff4d6] px-5 py-2 text-sm font-medium text-[#c58b00]">
            About Komyut AI
          </div>

          <h1 className="mt-8 text-6xl font-black leading-tight text-black">
            Built for everyday
            <span className="text-[#f4b400]">
              {" "}
              Filipino commuters.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-[#5f6368]">
            Komyut AI was created to help Metro Manila commuters navigate
            the city smarter through route intelligence, transportation
            insights, and AI-powered suggestions.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          {[
            {
              title: "Mission",
              text: "Make urban commuting simpler, smarter, and more accessible for everyone.",
            },

            {
              title: "Vision",
              text: "Become the most trusted intelligent commuting platform in the Philippines.",
            },

            {
              title: "Goal",
              text: "Reduce commuter stress through smarter transportation experiences.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-[32px] border border-[#ece7dc] bg-[#f8f6f1] p-10"
            >
              <h2 className="text-3xl font-black text-black">
                {item.title}
              </h2>

              <p className="mt-6 leading-relaxed text-[#5f6368]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="bg-[#f8f6f1] px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            <div className="inline-flex rounded-full bg-[#fff4d6] px-5 py-2 text-sm font-medium text-[#c58b00]">
              Our Story
            </div>

            <h2 className="mt-8 text-5xl font-black leading-tight text-black">
              Smarter transportation for modern city life.
            </h2>

            <p className="mt-8 text-lg leading-relaxed text-[#5f6368]">
              Daily commuting in Metro Manila can be stressful,
              unpredictable, and time-consuming.
            </p>

            <p className="mt-6 text-lg leading-relaxed text-[#5f6368]">
              Komyut AI was conceptualized to make commuting more
              efficient by combining route planning, traffic insights,
              and transportation intelligence into one platform.
            </p>
          </div>

          {/* RIGHT */}
          <div className="rounded-[40px] bg-gradient-to-br from-[#ffe082] to-[#fff4d6] p-10">
            <div className="flex h-[420px] items-center justify-center rounded-[32px] bg-white">
              <div className="text-center">
                <div className="text-8xl">
                  🚆
                </div>

                <h3 className="mt-6 text-3xl font-black text-black">
                  Metro Manila Transit
                </h3>

                <p className="mt-4 text-[#5f6368]">
                  Modern commute intelligence platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TeamSection />
    </>
  );
}

export default About;