import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}

export function StatCard({ title, value, icon: Icon, iconColor = '#1e3a8a', bgColor = '#e0e7ff' }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl" style={{ fontWeight: 600 }}>{value}</p>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: bgColor }}>
          <Icon className="h-6 w-6" style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
}
