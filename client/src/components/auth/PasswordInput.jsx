import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-black">
        {label}
      </label>

      <div
        className={`flex items-center rounded-2xl border px-4 py-4 transition
        ${
          error
            ? "border-red-400"
            : "border-[#ece7dc] focus-within:border-[#f4b400]"
        }`}
      >
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full outline-none"
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          className="text-[#5f6368]"
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default PasswordInput;