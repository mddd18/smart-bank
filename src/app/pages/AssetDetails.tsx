import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Download, Wrench, AlertTriangle, CheckCircle, XCircle, User } from 'lucide-react';
import { Asset, AssetStatus, AuditLog } from '../types';
import { getAssetById, saveAsset, getEmployeeById, getEmployees, getAuditLogsByAssetId, addAuditLog } from '../utils/storage';
import { StatusBadge } from '../components/StatusBadge';
import { generateQRCode, downloadQRCode } from '../utils/qrcode';
import { format } from 'date-fns';

export function AssetDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [qrCode, setQrCode] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const employees = getEmployees();

  useEffect(() => {
    if (id) {
      loadAsset(id);
      loadAuditLogs(id);
    }
  }, [id]);

  const loadAsset = async (assetId: string) => {
    const data = getAssetById(assetId);
    if (data) {
      setAsset(data);
      const qr = await generateQRCode(assetId);
      setQrCode(qr);
    } else {
      navigate('/assets');
    }
  };

  const loadAuditLogs = (assetId: string) => {
    const logs = getAuditLogsByAssetId(assetId);
    setAuditLogs(logs.reverse());
  };

  const updateStatus = (newStatus: AssetStatus, details?: string) => {
    if (!asset) return;

    const updatedAsset = { ...asset, status: newStatus };
    saveAsset(updatedAsset);

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      assetId: asset.id,
      action: getStatusActionText(newStatus),
      performedBy: 'Admin',
      performedAt: new Date().toISOString(),
      details,
    };
    addAuditLog(log);

    setAsset(updatedAsset);
    loadAuditLogs(asset.id);
  };

  const assignToEmployee = () => {
    if (!asset || !selectedEmployee) return;

    const employee = getEmployeeById(selectedEmployee);
    if (!employee) return;

    const updatedAsset = { ...asset, assignedTo: selectedEmployee, status: 'assigned' as AssetStatus };
    saveAsset(updatedAsset);

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      assetId: asset.id,
      action: `${employee.name} ga berildi`,
      performedBy: 'Admin',
      performedAt: new Date().toISOString(),
    };
    addAuditLog(log);

    setAsset(updatedAsset);
    loadAuditLogs(asset.id);
    setShowAssignModal(false);
    setSelectedEmployee('');
  };

  const unassignAsset = () => {
    if (!asset || !asset.assignedTo) return;

    const employee = getEmployeeById(asset.assignedTo);
    const updatedAsset = { ...asset, assignedTo: undefined, status: 'registered' as AssetStatus };
    saveAsset(updatedAsset);

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      assetId: asset.id,
      action: employee ? `${employee.name} dan qaytarib olindi` : 'Qaytarib olindi',
      performedBy: 'Admin',
      performedAt: new Date().toISOString(),
    };
    addAuditLog(log);

    setAsset(updatedAsset);
    loadAuditLogs(asset.id);
  };

  const getStatusActionText = (status: AssetStatus) => {
    switch (status) {
      case 'in-repair': return 'Ta\'mirga yuborildi';
      case 'lost': return 'Yo\'qolgan deb belgilandi';
      case 'registered': return 'Ro\'yxatga qaytarildi';
      default: return 'Holat o\'zgartirildi';
    }
  };

  const handleDownloadQR = () => {
    if (qrCode && asset) {
      downloadQRCode(qrCode, `${asset.id}-qrcode.png`);
    }
  };

  if (!asset) {
    return <div className="p-6">Yuklanmoqda...</div>;
  }

  const assignedEmployee = asset.assignedTo ? getEmployeeById(asset.assignedTo) : null;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/assets"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl mb-1">{asset.name}</h1>
          <p className="text-gray-600">{asset.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Info Card */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="mb-4">Asosiy ma'lumotlar</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Toifasi</p>
                <p>{asset.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Seriya raqami</p>
                <p className="font-mono text-sm">{asset.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Holati</p>
                <StatusBadge status={asset.status} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Biriktirilgan</p>
                <p>{assignedEmployee ? assignedEmployee.name : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Sotib olingan sana</p>
                <p>{format(new Date(asset.purchaseDate), 'dd.MM.yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Kafolat muddati</p>
                <p>{format(new Date(asset.warrantyUntil), 'dd.MM.yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="mb-4">Holat boshqaruvi</h3>
            <div className="flex flex-wrap gap-3">
              {asset.status !== 'in-repair' && (
                <button
                  onClick={() => updateStatus('in-repair', 'Qo\'lda ta\'mirga yuborildi')}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Wrench className="h-4 w-4" />
                  Ta'mirga yuborish
                </button>
              )}
              {asset.status === 'in-repair' && (
                <button
                  onClick={() => updateStatus('registered', 'Ta\'mirdan qaytdi')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  Ta'mirdan qaytarish
                </button>
              )}
              {asset.status !== 'lost' && (
                <button
                  onClick={() => updateStatus('lost', 'Yo\'qolgan deb belgilandi')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  Yo'qolgan deb belgilash
                </button>
              )}
            </div>
          </div>

          {/* Employee Assignment */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="mb-4">Xodimga biriktirish</h3>
            {assignedEmployee ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600 }}>{assignedEmployee.name}</p>
                    <p className="text-sm text-gray-600">{assignedEmployee.position}</p>
                    <p className="text-xs text-gray-500">{assignedEmployee.department}</p>
                  </div>
                </div>
                <button
                  onClick={unassignAsset}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Olib qo'yish
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAssignModal(true)}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                + Xodimga biriktirish
              </button>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="mb-4">Tarix (Timeline)</h3>
            <div className="space-y-4">
              {auditLogs.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Hozircha tarix mavjud emas</p>
              ) : (
                auditLogs.map((log, index) => (
                  <div key={log.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      {index < auditLogs.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="text-sm" style={{ fontWeight: 600 }}>{log.action}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {log.performedBy} • {format(new Date(log.performedAt), 'dd.MM.yyyy HH:mm')}
                      </p>
                      {log.details && (
                        <p className="text-sm text-gray-600 mt-2">{log.details}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* QR Code Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-24">
            <h3 className="mb-4">QR Kod</h3>
            {qrCode && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center">
                  <img src={qrCode} alt="QR Code" className="w-full max-w-[250px]" />
                </div>
                <button
                  onClick={handleDownloadQR}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  QR kodni yuklab olish
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Bu QR kodni chop etib jihozga yopishtiring
                </p>
              </div>
            )}
          </div>

          {asset.riskScore && asset.riskScore > 0 && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h3>AI Tahlil</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Eskirish/Buzilish xavfi</span>
                  <span className={`text-lg ${asset.riskScore >= 70 ? 'text-red-600' : asset.riskScore >= 40 ? 'text-yellow-600' : 'text-green-600'}`} style={{ fontWeight: 600 }}>
                    {asset.riskScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${asset.riskScore >= 70 ? 'bg-red-600' : asset.riskScore >= 40 ? 'bg-yellow-600' : 'bg-green-600'}`}
                    style={{ width: `${asset.riskScore}%` }}
                  ></div>
                </div>
                {asset.riskScore >= 70 && (
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ Ushbu jihozni tez orada ta'mirlash yoki almashtirish tavsiya etiladi
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="mb-4">Xodimga biriktirish</h3>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            >
              <option value="">Xodimni tanlang</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.position}
                </option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedEmployee('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={assignToEmployee}
                disabled={!selectedEmployee}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Biriktirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}