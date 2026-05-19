import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";

import {
  validateEmail,
  validatePassword,
} from "../../utils/validators";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!validatePassword(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, and special character.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      try {
        const response = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });

        if (response.data.token) {
          localStorage.setItem("komyut_token", response.data.token);
          localStorage.setItem("komyut_user", JSON.stringify(response.data.user));
          navigate("/admin/dashboard");
        }
      } catch (err) {
        console.error(err);
        if (err.response?.data?.notVerified) {
          // If not verified, redirect to OTP page
          navigate("/verify-otp", { state: { email } });
        } else {
          setServerError(err.response?.data?.message || "Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-[#faf7f2] via-[#f8f5ef] to-[#f1ece3] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl border border-[#ece7dc] grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-[#f4b400] to-[#ffca28] p-8">

          {/* Decorative Blur */}
          <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-black/10 blur-3xl"></div>

          {/* Illustration */}
          <img
            src="/images/login-illustration.png"
            alt="Login Illustration"
            className="relative z-10 w-[65%] max-w-xs drop-shadow-2xl"
          />

          {/* Text */}
          <div className="relative z-10 mt-8 text-center">
            <h2 className="text-2xl font-bold text-black">
              Smart Urban Commutes
            </h2>

            <p className="mt-3 text-black/75 leading-relaxed max-w-xs text-sm">
              Access the Komyut AI admin dashboard and manage smarter transportation experiences across Metro Manila.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">

            {/* Logo */}
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4b400] shadow-md">
                <span className="text-xl">✦</span>
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-black">
                  komyut<span className="text-[#f4b400]">AI</span>
                </h1>

                <p className="text-xs text-[#5f6368]">
                  Smart Urban Commutes
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold text-black">
                Welcome Back
              </h2>

              <p className="mt-2 text-sm text-[#5f6368]">
                Login to your admin account.
              </p>
            </div>

            {/* Server Error Message */}
            {serverError && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {serverError}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <AuthInput
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                error={errors.email}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                error={errors.password}
              />

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#f4b400] py-3 text-base font-semibold text-black shadow-lg transition duration-300 hover:scale-[1.01] hover:bg-[#ffca28] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Logging In..." : "Log In"}
              </button>

              {/* Divider */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#ece7dc]"></div>
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-xs text-[#5f6368]">
                    OR
                  </span>
                </div>
              </div>

              {/* Register */}
              <Link
                to="/register"
                className="block w-full rounded-2xl border border-[#ece7dc] py-3 text-center text-base font-semibold text-black transition hover:bg-[#faf7f2]"
              >
                Create an Account
              </Link>

              {/* Forgot Password */}
              <div className="pt-1 text-center">
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[#5f6368] transition hover:text-black"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;