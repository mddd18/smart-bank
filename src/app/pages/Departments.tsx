import { useEffect, useState } from 'react';
import { Building2, Users, Package } from 'lucide-react';
import { Department } from '../types';
import { getDepartments, getEmployees, getAssets, initializeStorage } from '../utils/storage';

export function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    initializeStorage();
    loadDepartments();
  }, []);

  const loadDepartments = () => {
    const deps = getDepartments();
    const employees = getEmployees();
    const assets = getAssets();

    // Update counts
    const updated = deps.map((dept) => {
      const deptEmployees = employees.filter((emp) => emp.department === dept.name);
      const deptEmployeeIds = deptEmployees.map((emp) => emp.id);
      const assetCount = assets.filter(
        (asset) => asset.assignedTo && deptEmployeeIds.includes(asset.assignedTo)
      ).length;

      return {
        ...dept,
        employeeCount: deptEmployees.length,
        assetCount,
      };
    });

    setDepartments(updated);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl mb-2">Bo'limlar</h1>
        <p className="text-gray-600">Kompaniya bo'limlari va ularning statistikasi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3>{dept.name}</h3>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Xodimlar</span>
                </div>
                <span className="text-lg" style={{ fontWeight: 600 }}>
                  {dept.employeeCount}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">Aktivlar</span>
                </div>
                <span className="text-lg" style={{ fontWeight: 600 }}>
                  {dept.assetCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}