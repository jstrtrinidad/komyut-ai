import { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Trash2 } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";

function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/inquiries", {
        withCredentials: true,
      });
      setInquiries(response.data);
    } catch (error) {
      console.error("Failed to fetch inquiries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/inquiries/${id}`, {
        withCredentials: true,
      });
      fetchInquiries(); // Refresh list
    } catch (error) {
      console.error("Error deleting inquiry", error);
    }
  };

  // THE MAGIC GMAIL FUNCTION
  const handleGmailReply = (email, originalMessage) => {
    const subject = encodeURIComponent("Re: Your Inquiry to Komyut AI");
    const body = encodeURIComponent(
      `\n\n\n---\nOn ${new Date().toLocaleDateString()}, you wrote:\n"${originalMessage}"`,
    );

    // This specific URL forces a Gmail Compose window to open
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  };

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-black text-black">User Inquiries</h1>
        <p className="mt-2 text-[#5f6368]">
          Review and reply to messages from the public contact form.
        </p>
      </div>

      {loading ? (
        <p className="text-[#5f6368]">Loading messages...</p>
      ) : (
        <div className="grid gap-6">
          {inquiries.map((inq) => (
            <div
              key={inq._id}
              className="rounded-[28px] border border-[#ece7dc] bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-black">{inq.name}</h3>
                  <p className="text-sm font-medium text-[#f4b400]">
                    {inq.email}
                  </p>
                  <p className="text-xs text-[#5f6368]">
                    {new Date(inq.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleGmailReply(inq.email, inq.message)}
                    className="flex items-center gap-2 rounded-xl bg-[#faf7f2] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#ece7dc]"
                  >
                    <Mail size={16} /> Reply via Gmail
                  </button>
                  <button
                    onClick={() => handleDelete(inq._id)}
                    className="rounded-xl bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-[#faf7f2] p-4">
                <p className="text-[#5f6368]">{inq.message}</p>
              </div>
            </div>
          ))}

          {inquiries.length === 0 && (
            <p className="text-center text-[#5f6368]">
              You're all caught up! No new inquiries.
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

export default Inquiries;
