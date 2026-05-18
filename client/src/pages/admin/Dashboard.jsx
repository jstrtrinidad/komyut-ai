import AdminLayout from "../../components/admin/AdminLayout";

function Dashboard() {
  return (
    <AdminLayout>
      
      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-black">
          Dashboard
        </h1>

        <p className="mt-2 text-[#5f6368]">
          Monitor Metro Manila commute insights.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        
        {/* Card */}
        <div className="rounded-[28px] border border-[#ece7dc] bg-white p-6 shadow-sm">
          <p className="text-sm text-[#5f6368]">
            Total Users
          </p>

          <h2 className="mt-4 text-4xl font-black text-black">
            12,540
          </h2>
        </div>

        {/* Card */}
        <div className="rounded-[28px] border border-[#ece7dc] bg-white p-6 shadow-sm">
          <p className="text-sm text-[#5f6368]">
            Active Routes
          </p>

          <h2 className="mt-4 text-4xl font-black text-black">
            324
          </h2>
        </div>

        {/* Card */}
        <div className="rounded-[28px] border border-[#ece7dc] bg-white p-6 shadow-sm">
          <p className="text-sm text-[#5f6368]">
            Traffic Alerts
          </p>

          <h2 className="mt-4 text-4xl font-black text-black">
            18
          </h2>
        </div>

        {/* Card */}
        <div className="rounded-[28px] border border-[#ece7dc] bg-white p-6 shadow-sm">
          <p className="text-sm text-[#5f6368]">
            AI Recommendations
          </p>

          <h2 className="mt-4 text-4xl font-black text-black">
            2,930
          </h2>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;