import { supabase } from '../../../lib/supabase';
import { Warehouse, WarehouseInventory, WarehouseMovement } from '../types/warehouse';

export async function fetchWarehouses(): Promise<Warehouse[]> {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function fetchWarehouseById(id: string): Promise<Warehouse | null> {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchInventoryByWarehouse(warehouseId: string): Promise<WarehouseInventory[]> {
  const { data, error } = await supabase
    .from('warehouse_inventory')
    .select('*')
    .eq('warehouse_id', warehouseId)
    .order('product_name');
  if (error) throw error;
  return data || [];
}

export async function fetchMovementsByWarehouse(warehouseId: string): Promise<WarehouseMovement[]> {
  const { data, error } = await supabase
    .from('warehouse_movements')
    .select('*')
    .eq('warehouse_id', warehouseId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

export async function fetchAllInventory(): Promise<(WarehouseInventory & { warehouse_name?: string })[]> {
  const { data, error } = await supabase
    .from('warehouse_inventory')
    .select('*, warehouses(name)')
    .order('product_name');
  if (error) throw error;
  return ((data || []) as (WarehouseInventory & { warehouses?: { name: string } })[]).map(item => ({
    ...item,
    warehouse_name: item.warehouses?.name,
  }));
}

export async function fetchRecentMovements(): Promise<WarehouseMovement[]> {
  const { data, error } = await supabase
    .from('warehouse_movements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data || [];
}
