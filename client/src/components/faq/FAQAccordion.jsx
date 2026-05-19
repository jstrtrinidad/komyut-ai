import { useState } from "react";
import { ChevronDown } from "lucide-react";
import faqData from "../../data/faqData";

function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-5">
      {faqData.map((faq, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[28px] border border-[#ece7dc] bg-white shadow-sm"
        >
          <button
            onClick={() => toggleAccordion(index)}
            className="flex w-full flex-col px-6 py-5 text-left transition hover:bg-[#faf7f2]"
          >
            {/* NEW: Label/Category Section */}
            <span className="mb-2 text-xs font-bold uppercase tracking-widest text-[#f4b400]">
              {faq.category}
            </span>

            <div className="flex w-full items-center justify-between">
              <h3 className="text-lg font-bold text-black">{faq.question}</h3>
              <ChevronDown
                className={`transition ${
                  activeIndex === index
                    ? "rotate-180 text-black"
                    : "text-[#5f6368]"
                }`}
              />
            </div>
          </button>

          {activeIndex === index && (
            <div className="px-6 pb-6">
              <p className="leading-relaxed text-[#5f6368]">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FAQAccordion;
