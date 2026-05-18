import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-[#ece7dc] bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-black">
            komyut
            <span className="text-[#f4b400]"> AI</span>
          </h2>

          <p className="mt-5 leading-relaxed text-[#5f6368]">
            Smarter commuting for Metro Manila with AI-powered route
            recommendations and transportation insights.
          </p>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-bold">
            Legal
          </h3>

          <div className="mt-5 space-y-3 text-[#5f6368]">
            <p>Terms & Conditions</p>
            <p>Privacy Policy</p>
          </div>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-lg font-bold">
            Connect
          </h3>

          <div className="mt-5 space-y-3 text-[#5f6368]">
            <p>About Us</p>
            <p>Resources</p>
            <p>Contact</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold">
            Metro Manila
          </h3>

          <div className="mt-5 leading-relaxed text-[#5f6368]">
            Designed for Filipino commuters navigating the city smarter
            every day.

            <p className="mt-10 text-sm text-[#9aa0a6]">
              © 2026 Komyut AI. Designed for smarter Metro Manila commuting.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;