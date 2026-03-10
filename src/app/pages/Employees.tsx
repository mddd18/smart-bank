import { useEffect, useState } from 'react';
import { User, Package } from 'lucide-react';
import { Employee, Asset } from '../types';
import { getEmployees, getAssets, initializeStorage } from '../utils/storage';

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeAssets, setEmployeeAssets] = useState<Asset[]>([]);

  useEffect(() => {
    initializeStorage();
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const data = getEmployees();
    setEmployees(data);
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    const allAssets = getAssets();
    const assets = allAssets.filter((asset) => asset.assignedTo === employee.id);
    setEmployeeAssets(assets);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl mb-2">Xodimlar</h1>
        <p className="text-gray-600">Xodimlar ro'yxati va ularga biriktirilgan jihozlar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employees List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="mb-4">Xodimlar ro'yxati</h3>
          <div className="space-y-3">
            {employees.map((employee) => {
              const assetCount = getAssets().filter((a) => a.assignedTo === employee.id).length;
              return (
                <button
                  key={employee.id}
                  onClick={() => handleEmployeeClick(employee)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedEmployee?.id === employee.id
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontWeight: 600 }} className="truncate">{employee.name}</p>
                      <p className="text-sm text-gray-600 truncate">{employee.position}</p>
                      <p className="text-xs text-gray-500 truncate">{employee.department}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Package className="h-4 w-4" />
                      <span>{assetCount}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Employee Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {selectedEmployee ? (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4">Xodim ma'lumotlari</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">To'liq ismi</p>
                    <p style={{ fontWeight: 600 }}>{selectedEmployee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lavozimi</p>
                    <p>{selectedEmployee.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bo'limi</p>
                    <p>{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-blue-600">{selectedEmployee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Telefon</p>
                    <p>{selectedEmployee.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4">Biriktirilgan jihozlar ({employeeAssets.length})</h3>
                {employeeAssets.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Hech qanday jihoz biriktirilmagan
                  </p>
                ) : (
                  <div className="space-y-3">
                    {employeeAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p style={{ fontWeight: 600 }}>{asset.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{asset.id}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {asset.category} • {asset.serialNumber}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              asset.status === 'assigned'
                                ? 'bg-green-100 text-green-700'
                                : asset.status === 'in-repair'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {asset.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Xodimni tanlang</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}