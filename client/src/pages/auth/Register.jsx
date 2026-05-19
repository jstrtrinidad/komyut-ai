import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import PasswordStrength from "../../components/auth/PasswordStrength";

import {
  validateName,
  validateEmail,
  validatePassword,
} from "../../utils/validators";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [errors, setErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!validateName(firstName)) {
      newErrors.firstName =
        "First name must be 2–50 letters only.";
    }

    if (!validateName(lastName)) {
      newErrors.lastName =
        "Last name must be 2–50 letters only.";
    }

    if (!validateEmail(email)) {
      newErrors.email =
        "Please enter a valid email.";
    }

    if (!validatePassword(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, and special character.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
  try {
    setLoading(true);

    const response = await axios.post(
      "http://localhost:5001/api/auth/register",
      {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      }
    );

    alert(response.data.message);

    console.log(response.data);

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Registration failed"
    );

  } finally {
    setLoading(false);
  }
}
  };

  const [loading, setLoading] = useState(false);

  
return (
  <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f8f5ef] to-[#f1ece3] flex items-center justify-center px-4 py-6">
    
    <div className="w-full max-w-2xl rounded-[28px] bg-white border border-[#ece7dc] shadow-2xl p-8 md:p-10">

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4b400] shadow-md">
          <span className="text-xl">✦</span>
        </div>

        <div className="mt-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-black">
            komyut<span className="text-[#f4b400]">AI</span>
          </h1>

          <p className="mt-1 text-sm text-[#5f6368]">
            Smart Urban Commutes
          </p>
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-black">
          Create Account
        </h2>

        <p className="mt-2 text-sm text-[#5f6368]">
          Create your Komyut AI admin account.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleRegister}
        className="space-y-4"
      >

        {/* Name Row */}
        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            label="First Name"
            placeholder="First name"
            value={firstName}
            onChange={(e) =>
              setFirstName(e.target.value)
            }
            error={errors.firstName}
          />

          <AuthInput
            label="Last Name"
            placeholder="Last name"
            value={lastName}
            onChange={(e) =>
              setLastName(e.target.value)
            }
            error={errors.lastName}
          />
        </div>

        {/* Email */}
        <AuthInput
          label="Email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          error={errors.email}
        />

        {/* Password */}
        <PasswordInput
          label="Password"
          placeholder="Create password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          error={errors.password}
        />

        {/* Confirm Password */}
        <PasswordStrength password={password} />
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          error={errors.confirmPassword}
        />

        {/* Password Rules */}
        <div className="rounded-2xl bg-[#faf7f2] p-4 text-xs text-[#5f6368]">
          Password must:
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Be 8–50 characters</li>
            <li>Contain uppercase letter</li>
            <li>Contain lowercase letter</li>
            <li>Contain number</li>
            <li>Contain special character</li>
          </ul>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-2xl bg-[#f4b400] py-3 text-base font-semibold text-black shadow-lg transition duration-300 hover:scale-[1.01] hover:bg-[#ffca28]"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Back to Login */}
        <div className="text-center pt-2">
          <Link
            to="/login"
            className="text-sm font-medium text-[#c58b00] transition hover:text-black"
          >
            Already have an account? Log In
          </Link>
        </div>

      </form>
    </div>
  </div>
);
}

export default Register;