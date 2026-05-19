import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";
import { Users, Map, Bell, MessageSquare } from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    routes: 0,
    alerts: 0,
    inquiries: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/dashboard/stats",
        );
        setStats(data);
      } catch (err) {
        console.error("Error loading stats", err);
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-4xl font-black text-black">Dashboard</h1>

      {/* 1. Summary Cards */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="New Inquiries"
          value={stats.inquiries}
          icon={<MessageSquare />}
        />
        <StatCard title="Active Routes" value={stats.routes} icon={<Map />} />
        <StatCard title="Traffic Alerts" value={stats.alerts} icon={<Bell />} />
        <StatCard
          title="Pending Inquiries"
          value={stats.inquiries}
          icon={<MessageSquare />}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-[28px] border border-[#ece7dc] bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold">Commute Trends</h2>
          <div className="mt-6 h-64 bg-slate-50 rounded-2xl flex items-center justify-center text-[#5f6368]">
            Chart placeholder: Commute traffic growth over the week
          </div>
        </div>

        <div className="rounded-[28px] border border-[#ece7dc] bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold">Recent Inquiries</h2>
          <div className="mt-6 space-y-4">
            <p className="text-sm text-[#5f6368]">
              User: Migs - "Help with BGC route"
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-[28px] border border-[#ece7dc] bg-white p-6 shadow-sm">
      <div className="flex justify-between items-center text-[#5f6368]">
        <p className="text-sm">{title}</p>
        {icon}
      </div>
      <h2 className="mt-4 text-4xl font-black text-black">{value}</h2>
    </div>
  );
}

export default Dashboard;
