import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { QrCode, ArrowLeft, Search } from 'lucide-react';
import { getAssetById } from '../utils/storage';

export function QRScanner() {
  const navigate = useNavigate();
  const [assetId, setAssetId] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!assetId.trim()) {
      setError('Aktiv ID ni kiriting');
      return;
    }

    const asset = getAssetById(assetId.trim());
    if (asset) {
      navigate(`/assets/${asset.id}`);
    } else {
      setError('Aktiv topilmadi. ID ni tekshiring.');
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl mb-1">QR Kod Skanerlash</h1>
          <p className="text-gray-600">Jihozni tezkor topish</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl mb-2">QR Kod Skaneri</h2>
            <p className="text-gray-600">
              Haqiqiy QR kod skanerlash mobil ilovada mavjud. 
              <br />
              Demo uchun aktiv ID ni qo'lda kiriting.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block mb-2">Aktiv ID</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={assetId}
                  onChange={(e) => {
                    setAssetId(e.target.value);
                    setError('');
                  }}
                  placeholder="Masalan: AST001"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors"
            >
              Jihozni topish
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 <span style={{ fontWeight: 600 }}>Maslahat:</span> Mobil ilovada QR kod 
              skanerini ishga tushiring va jihozga yopishtirilgan QR kodga kamerani qarating. 
              Tizim avtomatik ravishda jihozni aniqlaydi.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="mb-4">Test uchun mavjud aktivlar:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['AST001', 'AST002', 'AST003', 'AST004', 'AST005', 'AST006'].map((id) => (
              <button
                key={id}
                onClick={() => {
                  setAssetId(id);
                  setError('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-mono"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}