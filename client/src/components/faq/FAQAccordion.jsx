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
          className="overflow-hidden rounded-[28px] border border-[#f4d98b] bg-white"
        >
          <button
            onClick={() => toggleAccordion(index)}
            className="flex w-full items-center justify-between px-6 py-5 text-left"
          >
            <h3 className="text-lg font-bold text-black">
              {faq.question}
            </h3>

            <ChevronDown
              className={`transition ${
                activeIndex === index
                  ? "rotate-180 text-[#f4b400]"
                  : "text-black"
              }`}
            />
          </button>

          {activeIndex === index && (
            <div className="px-6 pb-6">
              <p className="leading-relaxed text-black">
                {faq.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FAQAccordion;