import logo from "../../assets/icons/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#ece7dc] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Logo */}
      {/* Logo */}
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center"
      >
        <img
          src={logo}
          alt="Komyut AI Logo"
          className="h-15 w-auto object-contain"
        />
      </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-10 md:flex">
          <Link
            to="/"
            className="font-medium text-[#5f6368] transition hover:text-black"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="font-medium text-[#5f6368] transition hover:text-black"
          >
            About
          </Link>

          <Link
            to="/faq"
            className="font-medium text-[#5f6368] transition hover:text-black"
          >
            FAQ
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            to="/map"
            className="rounded-2xl bg-[#f4b400] px-7 py-3 font-semibold text-black shadow-sm transition hover:scale-[1.02] hover:bg-[#ffca28] inline-block"
          >
            Get Directions
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ece7dc] md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-[#ece7dc] bg-white px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5">
            <Link
              to="/"
              className="font-medium text-[#5f6368]"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="font-medium text-[#5f6368]"
            >
              About
            </Link>

            <Link
              to="/faq"
              className="font-medium text-[#5f6368]"
            >
              FAQ
            </Link>

            <Link
              to="/map"
              className="mt-3 rounded-2xl bg-[#f4b400] py-4 font-semibold text-black text-center"
            >
              Get Directions
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;