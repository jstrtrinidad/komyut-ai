import { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";

const BACKEND_URL = "http://localhost:5000";
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});

function Routes() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [imageFile, setImageFile] = useState(null); // New state for the image file
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchDestinations = async () => {
    try {
      const { data } = await api.get("/destinations");
      setDestinations(data);
    } catch (error) {
      console.error("Failed to fetch destinations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // We must use FormData to send files + text together
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (editingId) {
        await api.put(`/destinations/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/destinations", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Reset Form
      setFormData({ name: "", description: "" });
      setImageFile(null);
      setEditingId(null);
      setIsFormOpen(false);
      fetchDestinations();
    } catch (error) {
      console.error("Error saving destination", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
    try {
      await api.delete(`/destinations/${id}`);
      fetchDestinations();
    } catch (error) {
      console.error("Error deleting destination", error);
    }
  };

  const handleEdit = (destination) => {
    setFormData({
      name: destination.name,
      description: destination.description,
    });
    setImageFile(null); // Clear previous file selection
    setEditingId(destination._id);
    setIsFormOpen(true);
  };

  return (
    <AdminLayout>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-black">Manage Routes</h1>
          <p className="mt-2 text-[#5f6368]">
            Add, edit, or remove Metro Manila commute destinations.
          </p>
        </div>
        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setEditingId(null);
            setFormData({ name: "", description: "" });
            setImageFile(null);
          }}
          className="flex items-center gap-2 rounded-2xl bg-[#f4b400] px-5 py-3 font-semibold text-black transition hover:bg-[#ffca28]"
        >
          <Plus size={20} /> {isFormOpen ? "Cancel" : "Add Destination"}
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-10 rounded-[28px] border border-[#ece7dc] bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-black">
            {editingId ? "Edit Destination" : "New Destination"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* New Image File Input */}
            <div className="flex items-center gap-4 rounded-2xl border border-dashed border-[#ece7dc] bg-[#faf7f2] p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#5f6368] shadow-sm">
                <ImageIcon size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-black">
                  Upload Location Image
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="mt-1 block w-full text-sm text-[#5f6368] file:mr-4 file:rounded-full file:border-0 file:bg-[#f4b400] file:px-4 file:py-2 file:text-sm file:font-bold file:text-black hover:file:bg-[#ffca28]"
                />
              </div>
            </div>

            <input
              type="text"
              placeholder="Location Name (e.g., Makati)"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="rounded-2xl border border-[#ece7dc] px-4 py-3 outline-none focus:border-[#f4b400]"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows="3"
              className="rounded-2xl border border-[#ece7dc] px-4 py-3 outline-none focus:border-[#f4b400]"
            />
            <button
              type="submit"
              className="self-end rounded-2xl bg-black px-8 py-3 font-bold text-white transition hover:bg-neutral-800"
            >
              {editingId ? "Update Route" : "Save Route"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-[#5f6368]">Loading destinations...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((place) => (
            <div
              key={place._id}
              className="group overflow-hidden rounded-[32px] border border-[#ece7dc] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Dynamic Image Display */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#ffe082] to-[#fff4d6]">
                {place.imageUrl ? (
                  <img
                    src={`${BACKEND_URL}${place.imageUrl}`}
                    alt={place.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                )}

                <div className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm">
                  Metro Manila
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-bold text-black">
                    {place.name}
                  </h3>
                  <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => handleEdit(place)}
                      className="rounded-lg bg-[#faf7f2] p-2 text-[#f4b400] hover:bg-[#ece7dc]"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(place._id)}
                      className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-[#5f6368]">
                  {place.description}
                </p>
              </div>
            </div>
          ))}
          {destinations.length === 0 && (
            <p className="col-span-full text-center text-[#5f6368]">
              No routes found. Add one above.
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

export default Routes;
