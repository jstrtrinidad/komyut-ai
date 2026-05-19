function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-5xl font-black text-black">
        Privacy Policy
      </h1>

      <p className="mt-8 leading-relaxed text-[#5f6368]">
        Komyut AI respects your privacy and is committed to protecting
        your personal information.
      </p>

      <div className="mt-10 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-black">
            Information We Collect
          </h2>

          <p className="mt-3 text-[#5f6368] leading-relaxed">
            We may collect location data, route preferences, and usage
            analytics to improve commuter experience.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-black">
            How We Use Information
          </h2>

          <p className="mt-3 text-[#5f6368] leading-relaxed">
            Data is used to provide smarter route recommendations and
            improve platform performance.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-black">
            Data Protection
          </h2>

          <p className="mt-3 text-[#5f6368] leading-relaxed">
            We implement security measures to protect user information
            from unauthorized access.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;