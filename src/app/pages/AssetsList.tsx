import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, Search, Edit, Trash2, Package, Loader2 } from 'lucide-react';
import { Asset, Employee } from '../types';
import { getAssets, deleteAsset, getEmployees } from '../utils/storage';
import { StatusBadge } from '../components/StatusBadge';

export function AssetsList() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Sahifa ochilganda bazadan ma'lumotlarni tortib olish
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const assetsData = await getAssets();
      const employeesData = await getEmployees();
      setAssets(assetsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Rostdan ham bu jihozni o'chirmoqchimisiz?")) {
      await deleteAsset(id);
      await loadData(); // O'chirilgach ro'yxatni yangilash
    }
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jihozlar (Aktivlar)</h1>
          <p className="text-gray-500">Barcha bank jihozlarini boshqarish va nazorat qilish</p>
        </div>
        <Link to="/assets/new" className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm">
          <Plus className="h-5 w-5" />
          Yangi qo'shish
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Nomi yoki seriya raqami bo'yicha qidirish..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Yuklanish jarayoni */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
            <p>Ma'lumotlar bazadan yuklanmoqda...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Jihoz</th>
                  <th className="p-4 font-medium">Seriya raqami</th>
                  <th className="p-4 font-medium">Holati</th>
                  <th className="p-4 font-medium">Mas'ul xodim</th>
                  <th className="p-4 font-medium text-right">Harakatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Hech qanday jihoz topilmadi.
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map(asset => {
                    const employee = employees.find(e => e.id === asset.assignedTo);
                    return (
                      <tr key={asset.id} className="hover:bg-gray-50/80 transition bg-white">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                              <Package className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{asset.name}</div>
                              <div className="text-xs text-gray-500">{asset.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600 font-mono">{asset.serialNumber}</td>
                        <td className="p-4">
                          <StatusBadge status={asset.status} />
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {employee ? employee.name : <span className="text-gray-400 italic">Omborda</span>}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Link to={`/assets/${asset.id}`} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Ko'rish">
                              Ko'rish
                            </Link>
                            <Link to={`/assets/${asset.id}/edit`} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition" title="Tahrirlash">
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button onClick={() => handleDelete(asset.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="O'chirish">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
