import { Sparkles } from "lucide-react";

function AIRecommendation() {
  return (
    <div className="rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8 backdrop-blur-2xl">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
        <Sparkles size={16} />
        AI Recommendation
      </div>

      <h2 className="text-3xl font-black leading-tight text-white">
        Leave Before 7:20 AM
      </h2>

      <p className="mt-5 leading-relaxed text-slate-300">
        Based on current traffic patterns and crowd prediction, leaving
        before 7:20 AM can reduce your travel time by approximately
        18 minutes.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <div className="rounded-full bg-green-400/10 px-4 py-2 text-sm text-green-300">
          Low Crowd Level
        </div>

        <div className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
          Fastest Route
        </div>

        <div className="rounded-full bg-purple-400/10 px-4 py-2 text-sm text-purple-300">
          AI Optimized
        </div>
      </div>
    </div>
  );
}

export default AIRecommendation;