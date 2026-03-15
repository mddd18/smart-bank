import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Edit, Trash2, Package, Calendar, Shield, Activity, Loader2, User } from 'lucide-react';
import { Asset, Employee, AuditLog } from '../types';
import { getAssetById, getEmployeeById, getAuditLogsByAssetId, deleteAsset } from '../utils/storage';
import { StatusBadge } from '../components/StatusBadge';

export function AssetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (assetId: string) => {
    setLoading(true);
    try {
      const foundAsset = await getAssetById(assetId);
      if (foundAsset) {
        setAsset(foundAsset);
        // Agar jihoz kimgadir biriktirilgan bo'lsa, o'sha xodimni topish
        if (foundAsset.assignedTo) {
          const foundEmp = await getEmployeeById(foundAsset.assignedTo);
          setEmployee(foundEmp || null);
        }
        // Audit tarixini yuklash
        const assetLogs = await getAuditLogsByAssetId(assetId);
        setLogs(assetLogs);
      }
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (asset && window.confirm("Rostdan ham bu jihozni o'chirib yubormoqchimisiz?")) {
      await deleteAsset(asset.id);
      navigate('/assets');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500">Jihoz ma'lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Jihoz topilmadi</h2>
        <Link to="/assets" className="text-blue-600 hover:underline">Orqaga qaytish</Link>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/assets" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
          <ArrowLeft className="h-5 w-5" />
          Orqaga
        </Link>
        <div className="flex gap-3">
          <Link to={`/assets/${asset.id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <Edit className="h-4 w-4" />
            Tahrirlash
          </Link>
          <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
            <Trash2 className="h-4 w-4" />
            O'chirish
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{asset.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{asset.serialNumber}</span>
                <span>•</span>
                <span>{asset.category}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={asset.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-400" />
              Asosiy ma'lumotlar
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Mas'ul xodim</p>
                {employee ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{employee.name}</p>
                      <p className="text-xs text-gray-500">{employee.department} • {employee.position}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">Biriktirilmagan (Omborda)</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Xarid qilingan sana</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {asset.purchaseDate}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Kafolat muddati</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Shield className="h-4 w-4 text-gray-400" />
                  {asset.warrantyUntil}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-400" />
              Audit Tarixi
            </h3>

            <div className="space-y-4">
              {logs.length > 0 ? logs.map(log => (
                <div key={log.id} className="relative flex items-start gap-4 mb-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{log.action}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{log.details}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(log.date).toLocaleString('uz-UZ')} • {log.performedBy}
                    </p>
                  </div>
                </div>
              )) : (
                 <p className="text-sm text-gray-500 italic">Hech qanday tarix topilmadi.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
