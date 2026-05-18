import {
  LayoutDashboard,
  Users,
  Map,
  BarChart3,
  Settings,
} from "lucide-react";

function Sidebar() {
  const links = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      icon: Users,
    },
    {
      name: "Routes",
      icon: Map,
    },
    {
      name: "Analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden w-72 border-r border-[#ece7dc] bg-white p-6 lg:block">
      
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4b400] text-xl font-black text-black">
          ✦
        </div>

        <div>
          <h1 className="text-2xl font-black text-black">
            komyut
            <span className="text-[#f4b400]">
              AI
            </span>
          </h1>

          <p className="text-sm text-[#5f6368]">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <button
              key={link.name}
              className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left font-medium text-[#5f6368] transition hover:bg-[#faf7f2] hover:text-black"
            >
              <Icon size={20} />

              {link.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;