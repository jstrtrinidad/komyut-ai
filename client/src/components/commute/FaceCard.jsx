function FareCard() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8 backdrop-blur-xl">
      <p className="text-sm text-slate-400">
        Estimated Fare
      </p>

      <h2 className="mt-4 text-5xl font-black text-white">
        ₱42
      </h2>

      <p className="mt-4 leading-relaxed text-slate-300">
        Includes MRT fare, jeepney transfer, and walking route estimate.
      </p>
    </div>
  );
}

export default FareCard;