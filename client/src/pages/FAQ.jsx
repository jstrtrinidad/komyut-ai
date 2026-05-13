import FAQAccordion from "../components/faq/FAQAccordion";
import ContactForm from "../components/faq/ContactForm";

function FAQ() {
  return (
    <>
      {/* HERO */}
      <section className="bg-[#f8f6f1] px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex rounded-full bg-[#fff4d6] px-5 py-2 text-sm font-medium text-[#c58b00]">
            Support Center
          </div>

          <h1 className="mt-8 text-6xl font-black leading-tight text-black">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-[#5f6368]">
            Everything you need to know about Komyut AI and smarter
            transportation experiences.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <FAQAccordion />
          <ContactForm />
        </div>
      </section>
    </>
  );
}

export default FAQ;