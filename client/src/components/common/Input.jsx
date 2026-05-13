function Input({
  type = "text",
  placeholder = "",
  className = "",
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-white outline-none placeholder:text-slate-500 ${className}`}
    />
  );
}

export default Input;