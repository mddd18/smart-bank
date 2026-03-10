import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Package, CheckCircle, Wrench, AlertTriangle, Plus, QrCode } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { StatCard } from '../components/StatCard';
import { getAssetStats, getAssetsByCategory, getAssetsByDepartment, getAuditLogs, initializeStorage } from '../utils/storage';
import { AuditLog } from '../types';
import { format } from 'date-fns';

export function Dashboard() {
  const [stats, setStats] = useState({ total: 0, registered: 0, assigned: 0, inRepair: 0, lost: 0 });
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [departmentData, setDepartmentData] = useState<{ name: string; count: number }[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    initializeStorage();
    loadData();
  }, []);

  const loadData = () => {
    const assetStats = getAssetStats();
    setStats(assetStats);

    const categories = getAssetsByCategory();
    setCategoryData([
      { name: 'IT Jihozlar', value: categories.IT },
      { name: 'Ofis jihozlari', value: categories.Office },
      { name: 'Xavfsizlik', value: categories.Security },
    ]);

    const departments = getAssetsByDepartment();
    setDepartmentData(departments);

    const logs = getAuditLogs();
    setRecentLogs(logs.slice(-5).reverse());
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl mb-2">Dashboard</h1>
          <p className="text-gray-600">Aktivlar statistikasi va umumiy ma'lumotlar</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/scan"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <QrCode className="h-5 w-5" />
            <span className="hidden sm:inline">QR Skanerlash</span>
          </Link>
          <Link
            to="/assets/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Yangi aktiv</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Jami aktivlar"
          value={stats.total}
          icon={Package}
          iconColor="#1e3a8a"
          bgColor="#e0e7ff"
        />
        <StatCard
          title="Ro'yxatga olingan"
          value={stats.registered}
          icon={CheckCircle}
          iconColor="#3b82f6"
          bgColor="#dbeafe"
        />
        <StatCard
          title="Berilgan"
          value={stats.assigned}
          icon={CheckCircle}
          iconColor="#10b981"
          bgColor="#d1fae5"
        />
        <StatCard
          title="Ta'mirda"
          value={stats.inRepair}
          icon={Wrench}
          iconColor="#f59e0b"
          bgColor="#fef3c7"
        />
        <StatCard
          title="Yo'qolgan"
          value={stats.lost}
          icon={AlertTriangle}
          iconColor="#ef4444"
          bgColor="#fee2e2"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200">
          <h3 className="mb-4">Toifalar bo'yicha taqsimot</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200">
          <h3 className="mb-4">Bo'limlar bo'yicha aktivlar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1e3a8a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="mb-4">Oxirgi o'zgarishlar</h3>
        <div className="space-y-3">
          {recentLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Hozircha faoliyat yo'q</p>
          ) : (
            recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm">
                    <span style={{ fontWeight: 600 }}>{log.assetId}</span> - {log.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {log.performedBy} • {format(new Date(log.performedAt), 'dd.MM.yyyy HH:mm')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}