import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import AuthLayout from "../../components/auth/AuthLayout";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputsRef = useRef([]);

  /* Redirect if no email in state */
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

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
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  /* Verify */
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const finalOTP = otp.join("");

    if (finalOTP.length !== 6) {
      setError("Please complete the OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp: finalOTP,
      });

      setSuccess(response.data.message);
      
      // Navigate to login after successful verification
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Resend */
  const handleResend = async () => {
    setError("");
    setSuccess("");
    
    try {
      // Re-use register endpoint or a separate resend endpoint
      // For now, let's assume the login endpoint sends a new OTP if not verified
      // Or we can create a dedicated resend-otp endpoint
      await axios.post("http://localhost:5000/api/auth/login", {
        email,
        // We might need a special flag or just handle it in backend
      });
      
      setTimer(30);
      setSuccess("A new OTP has been sent to your email.");
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="OTP Verification"
      subtitle={`Enter the 6-digit verification code sent to ${email || "your email"}.`}
    >
      <form onSubmit={handleVerify} className="space-y-8">
        
        {/* Messages */}
        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl bg-green-50 p-3 text-sm text-green-600 border border-green-100 text-center">
            {success}
          </div>
        )}

        {/* OTP BOXES */}
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="h-16 w-14 rounded-2xl border border-[#ece7dc] text-center text-2xl font-bold outline-none transition focus:border-[#f4b400]"
            />
          ))}
        </div>

        {/* Verify */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#f4b400] py-4 text-lg font-semibold text-black transition hover:bg-[#ffca28] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        {/* Resend */}
        <div className="text-center">
          {timer > 0 ? (
            <p className="text-sm text-[#5f6368]">
              Resend code in{" "}
              <span className="font-semibold text-black">{timer}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-semibold text-[#c58b00] hover:text-[#f4b400] transition"
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