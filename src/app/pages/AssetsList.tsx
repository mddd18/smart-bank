import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { BrainCircuit, AlertTriangle, Activity, ShieldCheck, Wrench, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Asset } from '../types';
import { getAssets, getEmployeeById, initializeStorage } from '../utils/storage';

export function AIAnalytics() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [highRiskAssets, setHighRiskAssets] = useState<Asset[]>([]);
  const [riskData, setRiskData] = useState<any[]>([]);
  const [stats, setStats] = useState({ avgRisk: 0, highRiskCount: 0, safeCount: 0 });

  useEffect(() => {
    initializeStorage();
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const allAssets = getAssets();
    setAssets(allAssets);

    // AI Risk hisoblash (0-100%)
    let totalRisk = 0;
    let highRisk = [];
    let safe = 0;

    let lowCount = 0;
    let mediumCount = 0;
    let highCount = 0;

    allAssets.forEach(asset => {
      const risk = asset.riskScore || 0;
      totalRisk += risk;

      if (risk >= 70) {
        highRisk.push(asset);
        highCount++;
      } else if (risk >= 40) {
        mediumCount++;
      } else {
        safe++;
        lowCount++;
      }
    });

    setHighRiskAssets(highRisk.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0)));
    setStats({
      avgRisk: allAssets.length > 0 ? Math.round(totalRisk / allAssets.length) : 0,
      highRiskCount: highCount,
      safeCount: safe
    });

    setRiskData([
      { name: 'Xavfsiz (<40%)', count: lowCount, color: '#10b981' },
      { name: 'O\'rta xavf (40-69%)', count: mediumCount, color: '#f59e0b' },
      { name: 'Yuqori xavf (≥70%)', count: highCount, color: '#ef4444' }
    ]);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <BrainCircuit className="h-7 w-7 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl mb-1 text-indigo-950">AI Tahlil va Bashoratlar</h1>
          <p className="text-gray-600">Sun'iy intellekt orqali jihozlarning buzilish xavfini oldindan aniqlash</p>
        </div>
      </div>

      {/* Tahlil kartalari */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-blue-50 rounded-full text-blue-600">
            <Activity className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">O'rtacha xavf darajasi</p>
            <p className="text-3xl font-semibold text-gray-800">{stats.avgRisk}%</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-red-200 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -z-10"></div>
          <div className="p-4 bg-red-50 rounded-full text-red-600">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Xavfli jihozlar soni</p>
            <p className="text-3xl font-semibold text-red-600">{stats.highRiskCount} ta</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-green-50 rounded-full text-green-600">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Xavfsiz jihozlar</p>
            <p className="text-3xl font-semibold text-gray-800">{stats.safeCount} ta</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Tavsiyalari */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-indigo-600" />
            AI Tavsiyalari (Smart Insights)
          </h3>
          <div className="space-y-4">
            {highRiskAssets.length > 0 ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Zudlik bilan ta'mirlash zarur!</h4>
                  <p className="text-sm text-red-700">
                    Tizimda <b>{stats.highRiskCount} ta</b> jihozning buzilish xavfi 70% dan yuqori. Ularni tezkor tekshiruvdan o'tkazish tavsiya etiladi. Aks holda ish jarayoni to'xtab qolishi mumkin.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex gap-3">
                <ShieldCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Barchasi joyida!</h4>
                  <p className="text-sm text-green-700">
                    Hozirda yuqori xavf ostidagi jihozlar aniqlanmadi. Tizim barqaror ishlamoqda.
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex gap-3">
              <Activity className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-indigo-900 mb-1">Amortizatsiya tahlili</h4>
                <p className="text-sm text-indigo-700">
                  IT bo'limidagi noutbuklarning o'rtacha ishlash muddati 3 yilni tashkil qildi. 2024-yilda olingan jihozlarning kafolat muddatini uzaytirish maqsadga muvofiq.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Xavf Grafigi */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Risk darajalari taqsimoti</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={riskData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Yuqori xavfli jihozlar jadvali */}
      {highRiskAssets.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-200 bg-red-50/30 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Diqqat talab etuvchi jihozlar (Yuqori xavf)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktiv Nomi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seriya Raqami</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Egasining Ismi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buzilish xavfi</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Harakat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {highRiskAssets.map((asset) => {
                  const emp = asset.assignedTo ? getEmployeeById(asset.assignedTo) : null;
                  return (
                    <tr key={asset.id} className="hover:bg-red-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                        <div className="text-xs text-gray-500">{asset.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {asset.serialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{emp ? emp.name : 'Omborda (Biriktirilmagan)'}</div>
                        {emp && <div className="text-xs text-gray-500">{emp.department}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px]">
                            <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${asset.riskScore}%` }}></div>
                          </div>
                          <span className="text-sm font-bold text-red-600">{asset.riskScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/assets/${asset.id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors">
                          Ko'rish <ArrowRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
