function TermsConditions() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-5xl font-black text-black">
        Terms & Conditions
      </h1>

      <p className="mt-8 leading-relaxed text-[#5f6368]">
        By using Komyut AI, you agree to the following terms and
        conditions.
      </p>

      <div className="mt-10 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-black">
            Usage
          </h2>

          <p className="mt-3 text-[#5f6368] leading-relaxed">
            Users must use the platform responsibly and comply with
            applicable laws.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-black">
            Accuracy
          </h2>

          <p className="mt-3 text-[#5f6368] leading-relaxed">
            Route and transport information may change and is not always
            guaranteed to be fully accurate.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-black">
            Liability
          </h2>

          <p className="mt-3 text-[#5f6368] leading-relaxed">
            Komyut AI is not liable for delays, disruptions, or issues
            caused by third-party transport services.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsConditions;