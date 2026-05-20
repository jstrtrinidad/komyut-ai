import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("komyut_admin");

    navigate("/login");
  };
  return (
    <header className="flex items-center justify-between border-b border-[#ece7dc] bg-white px-8 py-5">
      {/* Search */}
      <div className="flex items-center gap-3 rounded-2xl border border-[#ece7dc] bg-[#faf7f2] px-4 py-3">
        <Search size={18} className="text-[#5f6368]" />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="rounded-2xl border border-[#ece7dc] p-3 transition hover:bg-[#faf7f2]">
          <Bell size={20} />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4b400] font-bold text-black">
            A
          </div>

          <div>
            <h3 className="font-semibold text-black">Admin</h3>

            <p className="text-sm text-[#5f6368]">Administrator</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-2xl bg-[#f4b400] px-5 py-3 font-semibold text-black transition hover:bg-[#ffca28]"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
