function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-black">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border px-4 py-4 outline-none transition
        ${
          error
            ? "border-red-400"
            : "border-[#ece7dc] focus:border-[#f4b400]"
        }`}
      />

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
export default AuthInput;