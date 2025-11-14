import { useEffect, useState, useRef } from "react";
import { adminDashboardApi } from "@/lib/admin/dashboard";

const formatNumber = (n: number) => (n ?? 0).toLocaleString();

const useCountUp = (value: number | undefined) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const target = Number(value) || 0;
    const duration = 700;
    const start = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setDisplay(Math.floor(t * target));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return display;
};

const IconUsers = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-3-3.87M7 21v-2a4 4 0 013-3.87M12 11a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
);

const IconTemplate = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V9H3v10a2 2 0 002 2z" />
  </svg>
);

const IconTransaction = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10V4m0 16v-4" />
  </svg>
);

const StatCard = ({ label, value, icon, color }: { label: string; value: number | undefined; icon: JSX.Element; color?: string }) => {
  const display = useCountUp(value);
  return (
    <div className="bg-white border border-gray-100 shadow-md rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-transform transform hover:-translate-y-1">
      <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-white ${color ?? "bg-gradient-to-br from-indigo-500 to-violet-500"}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">{label}</p>
        </div>
        <p className="text-3xl font-extrabold text-gray-900 mt-2">{formatNumber(display)}</p>
        <div className="text-xs text-gray-400 mt-1">Compared to last period</div>
      </div>
    </div>
  );
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminDashboardApi.getOverview();
      setStats(res.data);
    } catch {
      setStats({ totalUsers: 0, totalTemplates: 0, totalTransactions: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="h-10 w-64 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-28 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-28 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-28 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const items = [
    { label: "Users", value: stats.totalUsers, icon: IconUsers, color: "bg-gradient-to-br from-sky-500 to-indigo-600" },
    { label: "Templates", value: stats.totalTemplates, icon: IconTemplate, color: "bg-gradient-to-br from-emerald-500 to-teal-600" },
    { label: "Transactions", value: stats.totalTransactions, icon: IconTransaction, color: "bg-gradient-to-br from-rose-500 to-pink-600" },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Quick overview of key metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md text-sm text-gray-700 hover:bg-gray-50">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((i) => (
          <StatCard key={i.label} label={i.label} value={i.value} icon={i.icon} color={i.color} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
