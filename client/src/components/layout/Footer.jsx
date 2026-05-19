import logo from "../../assets/icons/logo.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-[#ece7dc] bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-4">
        {/* Brand */}

        <div>
          <img
            src={logo}
            alt="Komyut AI Logo"
            className="h-12 w-auto object-contain"
          />

          <p className="mt-5 leading-relaxed text-[#5f6368]">
            Smarter commuting for Metro Manila with AI-powered route
            recommendations and transportation insights.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-bold">
            Navigation
          </h3>

          <div className="mt-5 space-y-3">
            <Link
              to="/"
              className="block text-[#5f6368] transition hover:text-[#f4b400]"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="block text-[#5f6368] transition hover:text-[#f4b400]"
            >
              About
            </Link>

            <Link
              to="/faq"
              className="block text-[#5f6368] transition hover:text-[#f4b400]"
            >
              FAQ
            </Link>

            <Link
              to="/map"
              className="block text-[#5f6368] transition hover:text-[#f4b400]"
            >
              Map
            </Link>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-bold">
            Legal
          </h3>

          <div className="mt-5 space-y-3">
            <Link
              to="/privacy-policy"
              className="block text-[#5f6368] transition hover:text-[#f4b400]"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms-conditions"
              className="block text-[#5f6368] transition hover:text-[#f4b400]"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold">
            Metro Manila
          </h3>

          <p className="mt-5 leading-relaxed text-[#5f6368]">
            Designed for Filipino commuters navigating the city smarter
            every day.
          </p>

          <p className="mt-10 text-sm text-[#9aa0a6]">
            © 2026 Komyut AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;