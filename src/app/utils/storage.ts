import { Asset, Employee, Department, AuditLog } from '../types';
import { supabase } from './supabase';

// ==========================================
// ASSETS (JIHOZLAR)
// ==========================================

export const getAssets = async (): Promise<Asset[]> => {
  const { data, error } = await supabase.from('assets').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Jihozlarni olishda xatolik:', error.message);
    return [];
  }
  return data.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category as any,
    serialNumber: item.serial_number,
    status: item.status as any,
    assignedTo: item.assigned_to,
    purchaseDate: item.purchase_date,
    warrantyUntil: item.warranty_until,
    riskScore: item.risk_score,
  }));
};

export const getAssetById = async (id: string): Promise<Asset | undefined> => {
  const { data, error } = await supabase.from('assets').select('*').eq('id', id).single();
  if (error || !data) return undefined;
  
  return {
    id: data.id,
    name: data.name,
    category: data.category as any,
    serialNumber: data.serial_number,
    status: data.status as any,
    assignedTo: data.assigned_to,
    purchaseDate: data.purchase_date,
    warrantyUntil: data.warranty_until,
    riskScore: data.risk_score,
  };
};

export const saveAsset = async (asset: Asset) => {
  const assetData = {
    name: asset.name,
    category: asset.category,
    serial_number: asset.serialNumber,
    status: asset.status,
    assigned_to: asset.assignedTo || null,
    purchase_date: asset.purchaseDate,
    warranty_until: asset.warrantyUntil,
    risk_score: asset.riskScore || 0,
  };

  if (asset.id) {
    // Yangilash (Update)
    await supabase.from('assets').update(assetData).eq('id', asset.id);
  } else {
    // Yangi qo'shish (Insert)
    await supabase.from('assets').insert([assetData]);
  }
};

export const deleteAsset = async (id: string) => {
  await supabase.from('assets').delete().eq('id', id);
};

// ==========================================
// EMPLOYEES (XODIMLAR)
// ==========================================

export const getEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase.from('employees').select('*');
  if (error) return [];
  return data.map(item => ({
    id: item.id,
    name: item.name,
    position: item.position,
    department: item.department,
    email: item.email,
  }));
};

export const getEmployeeById = async (id: string): Promise<Employee | undefined> => {
  const { data, error } = await supabase.from('employees').select('*').eq('id', id).single();
  if (error || !data) return undefined;
  return {
    id: data.id,
    name: data.name,
    position: data.position,
    department: data.department,
    email: data.email,
  };
};

// ==========================================
// DEPARTMENTS (BO'LIMLAR)
// ==========================================

export const getDepartments = async (): Promise<Department[]> => {
  const { data, error } = await supabase.from('departments').select('*');
  if (error) return [];
  return data.map(item => ({
    id: item.id,
    name: item.name,
  }));
};

// ==========================================
// AUDIT LOGS (TARIX)
// ==========================================

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const { data, error } = await supabase.from('audit_logs').select('*').order('performed_at', { ascending: false });
  if (error) return [];
  return data.map(item => ({
    id: item.id,
    assetId: item.asset_id,
    action: item.action,
    performedBy: item.performed_by,
    details: item.details,
    date: item.performed_at,
  }));
};

export const getAuditLogsByAssetId = async (assetId: string): Promise<AuditLog[]> => {
  const { data, error } = await supabase.from('audit_logs').select('*').eq('asset_id', assetId).order('performed_at', { ascending: false });
  if (error) return [];
  return data.map(item => ({
    id: item.id,
    assetId: item.asset_id,
    action: item.action,
    performedBy: item.performed_by,
    details: item.details,
    date: item.performed_at,
  }));
};

export const addAuditLog = async (log: Omit<AuditLog, 'id' | 'date'>) => {
  await supabase.from('audit_logs').insert([{
    asset_id: log.assetId,
    action: log.action,
    performed_by: log.performedBy,
    details: log.details,
  }]);
};

// ==========================================
// STATISTICS (STATISTIKA)
// ==========================================

export const getAssetStats = async () => {
  const assets = await getAssets();
  return {
    total: assets.length,
    registered: assets.filter(a => a.status === 'registered').length,
    assigned: assets.filter(a => a.status === 'assigned').length,
    inRepair: assets.filter(a => a.status === 'in-repair').length,
    lost: assets.filter(a => a.status === 'lost').length,
  };
};

export const getAssetsByCategory = async () => {
  const assets = await getAssets();
  return {
    IT: assets.filter(a => a.category === 'IT').length,
    Office: assets.filter(a => a.category === 'Office').length,
    Security: assets.filter(a => a.category === 'Security').length,
  };
};

export const getAssetsByDepartment = async () => {
  const assets = await getAssets();
  const employees = await getEmployees();
  const departments = await getDepartments();
  
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
