import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { ArrowLeft, Save, Loader2, Package } from 'lucide-react';
import { Asset, Employee } from '../types';
import { getAssetById, getEmployees, saveAsset } from '../utils/storage';

export function AddAsset() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Asset>>({
    name: '',
    category: 'IT',
    serialNumber: '',
    status: 'registered',
    assignedTo: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    warrantyUntil: '',
    riskScore: 0
  });

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    try {
      const emps = await getEmployees();
      setEmployees(emps);

      if (isEditMode && id) {
        const asset = await getAssetById(id);
        if (asset) {
          setFormData(asset);
        }
      }
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const assetToSave = { ...formData } as Asset;
      // Yaratishda bazaga qo'shish
      await saveAsset(assetToSave);
      navigate('/assets');
    } catch (error) {
      console.error("Saqlashda xatolik:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
      <p className="text-gray-500">Ma'lumotlar yuklanmoqda...</p>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/assets" className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Jihozni tahrirlash' : 'Yangi jihoz qo\'shish'}
          </h1>
          <p className="text-gray-500">
            {isEditMode ? 'Jihoz ma\'lumotlarini yangilash' : 'Tizimga yangi aktivni ro\'yxatdan o\'tkazish'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Aktiv Nomi *</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Masalan: Dell XPS 15"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Seriya Raqami *</label>
              <input
                required
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="SN-123456789"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Kategoriya</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="IT">IT Jihozlar</option>
                <option value="Office">Office Mebellari</option>
                <option value="Security">Xavfsizlik</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Holati</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="registered">Omborda (Ro'yxatga olingan)</option>
                <option value="assigned">Ishlatilmoqda (Biriktirilgan)</option>
                <option value="in-repair">Ta'mirlanmoqda</option>
                <option value="lost">Yo'qolgan / Yaroqsiz</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Biriktirilgan xodim</label>
              <select
                name="assignedTo"
                value={formData.assignedTo || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- Omborda (Hech kimga biriktirilmagan) --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Buzilish xavfi (AI Taxmini, 0-100%)</label>
              <input
                type="number"
                name="riskScore"
                value={formData.riskScore}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Xarid qilingan sana</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Kafolat muddati</label>
              <input
                type="date"
                name="warrantyUntil"
                value={formData.warrantyUntil}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
            <Link to="/assets" className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium">
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium disabled:opacity-70"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
