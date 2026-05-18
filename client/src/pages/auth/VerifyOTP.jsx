import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";

function VerifyOTP() {

    const navigate = useNavigate();
  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [timer, setTimer] = useState(30);

  const inputsRef = useRef([]);

  /* Timer */
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
    }, []);

  /* Handle OTP Change */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOTP = [...otp];
    updatedOTP[index] = value;

    setOtp(updatedOTP);

    /* Move forward */
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  /* Handle Backspace */
  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1].focus();
    }
  };

  /* Verify */
  const handleVerify = (e) => {
    e.preventDefault();

    const finalOTP = otp.join("");

    if (finalOTP.length !== 6) {
      alert("Please complete the OTP.");
      return;
    }

    navigate("/admin/dashboard");
  };

  /* Resend */
  const handleResend = () => {
    setTimer(30);

    console.log("OTP RESENT");
  };

  return (
    <AuthLayout
      title="OTP Verification"
      subtitle="Enter the 6-digit verification code sent to your email."
    >
      <form
        onSubmit={handleVerify}
        className="space-y-8"
      >
        {/* OTP BOXES */}
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) =>
                (inputsRef.current[index] = el)
              }
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleChange(
                  e.target.value,
                  index
                )
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              className="h-16 w-14 rounded-2xl border border-[#ece7dc] text-center text-2xl font-bold outline-none transition focus:border-[#f4b400]"
            />
          ))}
        </div>

        {/* Verify */}
        <button
          type="submit"
          className="w-full rounded-2xl bg-[#f4b400] py-4 text-lg font-semibold text-black transition hover:bg-[#ffca28]"
        >
          Verify & Continue
        </button>

        {/* Resend */}
        <div className="text-center">
          {timer > 0 ? (
            <p className="text-sm text-[#5f6368]">
              Resend code in{" "}
              <span className="font-semibold text-black">
                {timer}s
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-semibold text-[#c58b00]"
            >
              Resend OTP
            </button>
          )}
        </div>
      </form>
    </AuthLayout>
  );
}

export default VerifyOTP;