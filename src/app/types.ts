export type AssetStatus = 'registered' | 'assigned' | 'in-repair' | 'lost';
export type AssetCategory = 'IT' | 'Office' | 'Security';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  serialNumber: string;
  status: AssetStatus;
  assignedTo?: string; // employee ID
  purchaseDate: string;
  warrantyUntil: string;
  riskScore?: number; // AI prediction 0-100
  imageUrl?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
}

export interface Department {
  id: string;
  name: string;
  employeeCount: number;
  assetCount: number;
}

export interface AuditLog {
  id: string;
  assetId: string;
  action: string;
  performedBy: string;
  performedAt: string;
  details?: string;
}
