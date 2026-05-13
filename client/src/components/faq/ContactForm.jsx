function ContactForm() {
  return (
    <div className="rounded-[32px] border border-[#ece7dc] bg-[#f8f6f1] p-10">
      <h2 className="text-4xl font-black text-black">
        Contact Us
      </h2>

      <p className="mt-5 leading-relaxed text-[#5f6368]">
        Need assistance regarding routes, transportation updates, or
        platform concerns?
      </p>

      <form className="mt-10 space-y-5">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full rounded-2xl border border-[#ece7dc] bg-white px-5 py-4 outline-none"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full rounded-2xl border border-[#ece7dc] bg-white px-5 py-4 outline-none"
        />

        <textarea
          rows="5"
          placeholder="Message"
          className="w-full rounded-2xl border border-[#ece7dc] bg-white px-5 py-4 outline-none"
        ></textarea>

        <button className="w-full rounded-2xl bg-[#f4b400] py-4 text-lg font-semibold text-black transition hover:bg-[#ffca28]">
          Send Message
        </button>
      </form>
    </div>
  );
}

export default ContactForm;