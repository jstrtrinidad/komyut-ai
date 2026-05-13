import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
      <h1 className="text-8xl font-black text-cyan-400">
        404
      </h1>

      <h2 className="mt-6 text-3xl font-bold">
        Page Not Found
      </h2>

      <p className="mt-4 max-w-md text-slate-400">
        The page you are looking for does not exist or may have been moved.
      </p>

      <Link
        to="/"
        className="mt-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white transition hover:scale-105"
      >
        Back to Home
      </Link>
    </section>
  );
}

export default NotFound;