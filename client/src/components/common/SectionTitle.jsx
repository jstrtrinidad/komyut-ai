function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-16 text-center">
      <h2 className="text-5xl font-black text-white">
        {title}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

export default SectionTitle;