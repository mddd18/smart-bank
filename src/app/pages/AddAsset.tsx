import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { AssetCategory } from '../types';
import { saveAsset, addAuditLog } from '../utils/storage';

export function AddAsset() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'IT' as AssetCategory,
    serialNumber: '',
    purchaseDate: '',
    warrantyUntil: '',
  });
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState<AssetCategory | null>(null);

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name });

    // AI category suggestion
    if (name.length > 3) {
      let suggested: AssetCategory | null = null;
      const lowerName = name.toLowerCase();

      if (
        lowerName.includes('laptop') ||
        lowerName.includes('computer') ||
        lowerName.includes('phone') ||
        lowerName.includes('macbook') ||
        lowerName.includes('dell') ||
        lowerName.includes('hp') ||
        lowerName.includes('lenovo')
      ) {
        suggested = 'IT';
      } else if (
        lowerName.includes('chair') ||
        lowerName.includes('desk') ||
        lowerName.includes('table') ||
        lowerName.includes('printer')
      ) {
        suggested = 'Office';
      } else if (
        lowerName.includes('camera') ||
        lowerName.includes('cctv') ||
        lowerName.includes('security') ||
        lowerName.includes('access') ||
        lowerName.includes('biometric')
      ) {
        suggested = 'Security';
      }

      if (suggested && suggested !== formData.category) {
        setSuggestedCategory(suggested);
        setShowAISuggestion(true);
        setTimeout(() => setShowAISuggestion(false), 3000);
      }
    }
  };

  const applySuggestion = () => {
    if (suggestedCategory) {
      setFormData({ ...formData, category: suggestedCategory });
      setShowAISuggestion(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate asset ID
    const assetId = `AST${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const newAsset = {
      id: assetId,
      name: formData.name,
      category: formData.category,
      serialNumber: formData.serialNumber,
      status: 'registered' as const,
      purchaseDate: formData.purchaseDate,
      warrantyUntil: formData.warrantyUntil,
      riskScore: Math.floor(Math.random() * 20) + 5, // Random low risk score for new assets
    };

    saveAsset(newAsset);

    // Add audit log
    addAuditLog({
      id: `log-${Date.now()}`,
      assetId: assetId,
      action: 'Ro\'yxatga olindi',
      performedBy: 'Admin',
      performedAt: new Date().toISOString(),
      details: 'Yangi aktiv yaratildi',
    });

    navigate(`/assets/${assetId}`);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link to="/assets" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl mb-1">Yangi aktiv qo'shish</h1>
          <p className="text-gray-600">Yangi jihozni ro'yxatga oling</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
        <div>
          <label className="block mb-2">
            Jihozning nomi <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Masalan: Dell Latitude 7420"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {showAISuggestion && suggestedCategory && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-900">
                    AI taklifi: <span style={{ fontWeight: 600 }}>{suggestedCategory}</span> toifasi
                  </span>
                </div>
                <button
                  type="button"
                  onClick={applySuggestion}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Qo'llash
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2">
            Toifa <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as AssetCategory })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="IT">IT Jihozlar</option>
            <option value="Office">Ofis jihozlari</option>
            <option value="Security">Xavfsizlik</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">
            Seriya raqami <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            placeholder="Masalan: DL7420-2024-001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">
              Sotib olingan sana <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block mb-2">
              Kafolat muddati <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.warrantyUntil}
              onChange={(e) => setFormData({ ...formData, warrantyUntil: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Link
            to="/assets"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Bekor qilish
          </Link>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors"
          >
            Saqlash va QR kod yaratish
          </button>
        </div>
      </form>
    </div>
  );
}