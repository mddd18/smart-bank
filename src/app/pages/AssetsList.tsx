import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Search, Filter, Eye, Edit, AlertTriangle, Plus } from 'lucide-react';
import { Asset, AssetStatus, AssetCategory } from '../types';
import { getAssets, getEmployeeById, initializeStorage } from '../utils/storage';
import { StatusBadge } from '../components/StatusBadge';

export function AssetsList() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | 'all'>('all');

  useEffect(() => {
    initializeStorage();
    loadAssets();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [assets, searchTerm, statusFilter, categoryFilter]);

  const loadAssets = () => {
    const data = getAssets();
    setAssets(data);
  };

  const filterAssets = () => {
    let filtered = [...assets];

    if (searchTerm) {
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((asset) => asset.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((asset) => asset.category === categoryFilter);
    }

    setFilteredAssets(filtered);
  };

  const getRiskColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskLabel = (score?: number) => {
    if (!score) return '-';
    if (score >= 70) return 'Yuqori xavf';
    if (score >= 40) return 'O\'rta xavf';
    return 'Past xavf';
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl mb-2">Jihozlar ro'yxati</h1>
          <p className="text-gray-600">Barcha aktivlarni ko'rish va boshqarish</p>
        </div>
        <Link
          to="/assets/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors w-full lg:w-auto justify-center"
        >
          <Plus className="h-5 w-5" />
          <span>Yangi aktiv</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nomi, seriya raqami yoki ID bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AssetStatus | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Barcha holatlar</option>
              <option value="registered">Ro'yxatga olingan</option>
              <option value="assigned">Berilgan</option>
              <option value="in-repair">Ta'mirda</option>
              <option value="lost">Yo'qolgan</option>
            </select>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as AssetCategory | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Barcha toifalar</option>
              <option value="IT">IT Jihozlar</option>
              <option value="Office">Ofis jihozlari</option>
              <option value="Security">Xavfsizlik</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Nomi</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Toifasi</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Seriya raqami</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Holati</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Biriktirilgan</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    AI Xavf
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Harakatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Hech qanday aktiv topilmadi
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const employee = asset.assignedTo ? getEmployeeById(asset.assignedTo) : null;
                  return (
                    <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900">{asset.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{asset.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{asset.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-600">{asset.serialNumber}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={asset.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {employee ? employee.name : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {asset.riskScore && asset.riskScore >= 70 && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span className={`text-sm ${getRiskColor(asset.riskScore)}`}>
                            {asset.riskScore ? `${asset.riskScore}%` : '-'}
                          </span>
                        </div>
                        <span className={`text-xs ${getRiskColor(asset.riskScore)}`}>
                          {getRiskLabel(asset.riskScore)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/assets/${asset.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ko'rish"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/assets/${asset.id}/edit`}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Tahrirlash"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}