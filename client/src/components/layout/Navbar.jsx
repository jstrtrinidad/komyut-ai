import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#ece7dc] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4b400] text-xl font-black text-white shadow-sm">
            ⌘
          </div>

          <h1 className="text-2xl font-black tracking-tight text-black">
            komyut
            <span className="text-[#f4b400]">
              {" "}
              AI
            </span>
          </h1>
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
          <button className="rounded-2xl bg-[#f4b400] px-7 py-3 font-semibold text-black shadow-sm transition hover:scale-[1.02] hover:bg-[#ffca28]">
            Get Directions
          </button>
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

            <button className="mt-3 rounded-2xl bg-[#f4b400] py-4 font-semibold text-black">
              Get Directions
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;