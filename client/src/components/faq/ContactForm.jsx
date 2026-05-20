import { useState } from "react";
import axios from "axios";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await axios.post("http://localhost:5000/api/inquiries", formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" }); // Clear form

      // Reset success message after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("error");
    }
  };

  return (
    <div className="rounded-[32px] border border-[#ece7dc] bg-[#f8f6f1] p-10">
      <h2 className="text-4xl font-black text-black">Contact Us</h2>
      <p className="mt-5 leading-relaxed text-[#5f6368]">
        Need assistance regarding routes, transportation updates, or platform
        concerns?
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <input
          type="text"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-2xl border border-[#ece7dc] bg-white px-5 py-4 outline-none focus:border-[#f4b400]"
        />

        <input
          type="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-2xl border border-[#ece7dc] bg-white px-5 py-4 outline-none focus:border-[#f4b400]"
        />

        <textarea
          rows="5"
          placeholder="Message"
          required
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full rounded-2xl border border-[#ece7dc] bg-white px-5 py-4 outline-none focus:border-[#f4b400]"
        ></textarea>

        <button
          disabled={status === "loading"}
          className="w-full rounded-2xl bg-[#f4b400] py-4 text-lg font-semibold text-black transition hover:bg-[#ffca28] disabled:opacity-50"
        >
          {status === "loading"
            ? "Sending..."
            : status === "success"
              ? "Message Sent! ✓"
              : "Send Message"}
        </button>

        {status === "error" && (
          <p className="text-center text-red-500">
            Failed to send message. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}

export default ContactForm;
