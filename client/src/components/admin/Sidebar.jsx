import { Link, useLocation } from "react-router-dom"; // Add these imports
import {
  LayoutDashboard,
  Users,
  Map,
  BarChart3,
  Settings,
  Mail,
} from "lucide-react";

function Sidebar() {
  const location = useLocation(); // Gets the current URL to highlight the active tab

  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Routes", path: "/admin/routes", icon: Map },
    { name: "Inquiries", path: "/admin/inquiries", icon: Mail },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="hidden w-72 border-r border-[#ece7dc] bg-white p-6 lg:block">
      {/* ... Logo code stays the same ... */}

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left font-medium transition ${
                isActive
                  ? "bg-[#faf7f2] text-black" // Active tab style
                  : "text-[#5f6368] hover:bg-[#faf7f2] hover:text-black" // Inactive tab style
              }`}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
