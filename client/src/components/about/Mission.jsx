import Card from "../common/Card";

function Mission() {
  return (
    <section className="bg-slate-950 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <h3 className="text-2xl font-bold text-cyan-400">
              Mission
            </h3>

            <p className="mt-5 leading-relaxed text-slate-300">
              To improve urban commuting experiences through AI-powered
              transportation intelligence and smart route planning.
            </p>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold text-cyan-400">
              Vision
            </h3>

            <p className="mt-5 leading-relaxed text-slate-300">
              To become the leading intelligent commuting platform for
              Filipino commuters across major urban cities.
            </p>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold text-cyan-400">
              Purpose
            </h3>

            <p className="mt-5 leading-relaxed text-slate-300">
              To help commuters save time, avoid congestion, and make
              smarter transportation decisions every day.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Mission;