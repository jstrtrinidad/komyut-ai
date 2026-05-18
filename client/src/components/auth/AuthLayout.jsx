function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#fffdf8] to-[#f8f6f1] px-6 py-12">
      
      <div className="w-full max-w-md rounded-[32px] border border-[#ece7dc] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4b400] text-xl font-black text-black">
            ✦
          </div>

          <div>
            <h1 className="text-2xl font-black text-black">
              komyut<span className="text-[#f4b400]">AI</span>
            </h1>

            <p className="text-sm text-[#5f6368]">
              Smart Urban Commutes
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-black">
            {title}
          </h2>

          <p className="mt-2 text-[#5f6368]">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;