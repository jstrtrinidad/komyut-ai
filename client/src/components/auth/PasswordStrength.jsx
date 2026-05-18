function PasswordStrength({ password }) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const passedChecks =
    Object.values(checks).filter(Boolean).length;

  const strengthLevels = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
  ];

  const strength =
    strengthLevels[Math.max(0, passedChecks - 1)];

  return (
    <div className="mt-3">
      {/* Bars */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded-full transition
            ${
              passedChecks >= level
                ? "bg-[#f4b400]"
                : "bg-[#ece7dc]"
            }`}
          />
        ))}
      </div>

      {/* Label */}
      <p className="mt-2 text-sm text-[#5f6368]">
        Password Strength:
        <span className="ml-1 font-semibold text-black">
          {strength}
        </span>
      </p>
    </div>
  );
}

export default PasswordStrength;