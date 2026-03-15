import { useState, useEffect } from 'react';
import { Building2, Users, Package, Loader2 } from 'lucide-react';
import { Department } from '../types';
import { getDepartments, getAssetsByDepartment, getEmployees } from '../utils/storage';

export function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deptStats, setDeptStats] = useState<{name: string, count: number}[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const depts = await getDepartments();
      const stats = await getAssetsByDepartment();
      const emps = await getEmployees();
      
      setDepartments(depts);
      setDeptStats(stats);
      setEmployees(emps);
    } catch (error) {
      console.error("Bo'limlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500">Bo'limlar ma'lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bank Bo'limlari</h1>
        <p className="text-gray-500">Bo'limlar, ulardagi xodimlar va jihozlar statistikasi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
            Hozircha bo'limlar topilmadi.
          </div>
        ) : (
          departments.map(dept => {
            // Shu bo'limdagi xodimlar soni
            const empCount = employees.filter(e => e.department === dept.name).length;
            // Shu bo'limdagi jihozlar soni
            const assetStat = deptStats.find(s => s.name === dept.name);
            const assetCount = assetStat ? assetStat.count : 0;

            return (
              <div key={dept.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span>Xodimlar soni</span>
                    </div>
                    <span className="font-semibold text-gray-900">{empCount} ta</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Package className="h-5 w-5 text-gray-400" />
                      <span>Jihozlar soni</span>
                    </div>
                    <span className="font-semibold text-gray-900">{assetCount} ta</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
