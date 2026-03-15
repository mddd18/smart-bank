import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Activity, Package, CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { getAssetStats, getAssetsByCategory, getAuditLogs } from '../utils/storage';
import { AuditLog } from '../types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function Dashboard() {
  const [stats, setStats] = useState({ total: 0, registered: 0, assigned: 0, inRepair: 0, lost: 0 });
  const [categoryData, setCategoryData] = useState<{name: string, value: number}[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Supabase bazasidan barcha ma'lumotlarni KUTIB olamiz (await)
      const statsData = await getAssetStats();
      const catData = await getAssetsByCategory();
      const logsData = await getAuditLogs();

      setStats(statsData);
      setCategoryData([
        { name: 'IT Jihozlar', value: catData.IT },
        { name: 'Office mebellari', value: catData.Office },
        { name: 'Xavfsizlik', value: catData.Security },
      ]);
      
      // Endi bemalol slice ishlatsak bo'ladi, chunki ma'lumot Array bo'lib keldi
      setRecentLogs(logsData.slice(0, 5));
    } catch (error) {
      console.error("Dashboard ma'lumotlarini yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500">Bosh sahifa ma'lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Bank aktivlarining umumiy statistikasi</p>
        </div>
      </div>

      {/* Statistika Kartochkalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Package className="h-6 w-6" /></div>
          <div><p className="text-sm text-gray-500">Jami Aktivlar</p><p className="text-2xl font-bold">{stats.total}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle className="h-6 w-6" /></div>
          <div><p className="text-sm text-gray-500">Biriktirilgan</p><p className="text-2xl font-bold">{stats.assigned}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><AlertTriangle className="h-6 w-6" /></div>
          <div><p className="text-sm text-gray-500">Ta'mirlanmoqda</p><p className="text-2xl font-bold">{stats.inRepair}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><XCircle className="h-6 w-6" /></div>
          <div><p className="text-sm text-gray-500">Yo'qolgan/Yaroqsiz</p><p className="text-2xl font-bold">{stats.lost}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doiraviy Grafik (Pie Chart) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Toifalar bo'yicha taqsimot</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Oxirgi Harakatlar Tarixi */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-y-auto max-h-[400px]">
          <h2 className="text-lg font-semibold mb-4">Oxirgi harakatlar</h2>
          <div className="space-y-4">
            {recentLogs.length > 0 ? recentLogs.map((log) => (
              <div key={log.id} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full mt-1">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{log.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(log.date).toLocaleString('uz-UZ')} • {log.performedBy}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm text-center py-4">Hozircha tarix yo'q. Yangi jihoz qo'shib ko'ring!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
