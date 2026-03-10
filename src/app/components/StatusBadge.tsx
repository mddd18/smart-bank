import { AssetStatus } from '../types';

interface StatusBadgeProps {
  status: AssetStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'registered':
        return {
          label: 'Ro\'yxatga olingan',
          className: 'bg-[#3b82f6] text-white',
        };
      case 'assigned':
        return {
          label: 'Berilgan',
          className: 'bg-[#10b981] text-white',
        };
      case 'in-repair':
        return {
          label: 'Ta\'mirda',
          className: 'bg-[#f59e0b] text-white',
        };
      case 'lost':
        return {
          label: 'Yo\'qolgan',
          className: 'bg-[#ef4444] text-white',
        };
      default:
        return {
          label: status,
          className: 'bg-gray-500 text-white',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${config.className}`}>
      {config.label}
    </span>
  );
}
