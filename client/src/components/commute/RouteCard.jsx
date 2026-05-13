import { Clock3, ArrowRight } from "lucide-react";

function RouteCard() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Recommended Route
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            Quezon City → Makati
          </h3>
        </div>

        <ArrowRight className="text-cyan-400" />
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Clock3 className="text-cyan-400" />

        <p className="text-slate-300">
          Estimated Travel Time: 42 mins
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
          MRT
        </div>

        <div className="rounded-full bg-purple-400/10 px-4 py-2 text-sm text-purple-300">
          Jeepney
        </div>

        <div className="rounded-full bg-green-400/10 px-4 py-2 text-sm text-green-300">
          Walk
        </div>
      </div>
    </div>
  );
}

export default RouteCard;