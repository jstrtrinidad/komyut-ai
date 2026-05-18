import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f8f6f1]">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1">
        
        {/* Topbar */}
        <Topbar />

        {/* Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;