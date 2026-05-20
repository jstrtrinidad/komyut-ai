import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-[#f8f6f1] px-6 text-center font-sans">
      {/* 404 Header with Brand Colors */}
      <h1 className="text-8xl font-black tracking-tight text-black">
        40<span className="text-[#f4b400]">4</span>
      </h1>

      <h2 className="mt-4 text-3xl font-bold text-black">Dead End</h2>

      <p className="mt-4 max-w-md text-lg leading-relaxed text-[#5f6368]">
        The page you are looking for may have been moved or deleted.
      </p>

      {/* Primary CTA Button */}
      <Link
        to="/"
        className="mt-10 flex items-center gap-2 rounded-2xl bg-black px-8 py-4 font-bold text-white shadow-md transition-all hover:-translate-y-1 hover:bg-neutral-800"
      >
        <span>←</span> Back to Page
      </Link>
    </section>
  );
}

export default NotFound;
