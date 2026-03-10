import { Asset, Employee, Department, AuditLog } from '../types';
import { mockAssets, mockEmployees, mockDepartments, mockAuditLogs } from '../data/mockData';

const STORAGE_KEYS = {
  ASSETS: 'smart-bank-assets',
  EMPLOYEES: 'smart-bank-employees',
  DEPARTMENTS: 'smart-bank-departments',
  AUDIT_LOGS: 'smart-bank-audit-logs',
};

// Initialize storage with mock data if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.ASSETS)) {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(mockAssets));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(mockEmployees));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(mockDepartments));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(mockAuditLogs));
  }
};

// Assets
export const getAssets = (): Asset[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ASSETS);
  return data ? JSON.parse(data) : [];
};

export const getAssetById = (id: string): Asset | undefined => {
  const assets = getAssets();
  return assets.find(asset => asset.id === id);
};

export const saveAsset = (asset: Asset) => {
  const assets = getAssets();
  const index = assets.findIndex(a => a.id === asset.id);
  if (index >= 0) {
    assets[index] = asset;
  } else {
    assets.push(asset);
  }
  localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
};

export const deleteAsset = (id: string) => {
  const assets = getAssets().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
};

// Employees
export const getEmployees = (): Employee[] => {
  const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
  return data ? JSON.parse(data) : [];
};

export const getEmployeeById = (id: string): Employee | undefined => {
  const employees = getEmployees();
  return employees.find(emp => emp.id === id);
};

// Departments
export const getDepartments = (): Department[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
  return data ? JSON.parse(data) : [];
};

// Audit Logs
export const getAuditLogs = (): AuditLog[] => {
  const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
  return data ? JSON.parse(data) : [];
};

export const getAuditLogsByAssetId = (assetId: string): AuditLog[] => {
  return getAuditLogs().filter(log => log.assetId === assetId);
};

export const addAuditLog = (log: AuditLog) => {
  const logs = getAuditLogs();
  logs.push(log);
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
};

// Statistics
export const getAssetStats = () => {
  const assets = getAssets();
  return {
    total: assets.length,
    registered: assets.filter(a => a.status === 'registered').length,
    assigned: assets.filter(a => a.status === 'assigned').length,
    inRepair: assets.filter(a => a.status === 'in-repair').length,
    lost: assets.filter(a => a.status === 'lost').length,
  };
};

export const getAssetsByCategory = () => {
  const assets = getAssets();
  return {
    IT: assets.filter(a => a.category === 'IT').length,
    Office: assets.filter(a => a.category === 'Office').length,
    Security: assets.filter(a => a.category === 'Security').length,
  };
};

export const getAssetsByDepartment = () => {
  const assets = getAssets();
  const employees = getEmployees();
  const departments = getDepartments();
  
  const deptAssets = departments.map(dept => {
    const deptEmployees = employees.filter(emp => emp.department === dept.name);
    const deptEmployeeIds = deptEmployees.map(emp => emp.id);
    const count = assets.filter(asset => 
      asset.assignedTo && deptEmployeeIds.includes(asset.assignedTo)
    ).length;
    
    return {
      name: dept.name,
      count,
    };
  });
  
  return deptAssets;
};
