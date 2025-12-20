import ajax from '@/commons/ajax';
import { AjaxOptions } from '@rc-lib/mp';
import { CarSource, Company } from '@/types/car-source';

// 车源 API 基础路径
const CAR_SOURCE_BASE = '/api';

/**
 * 获取公司信息
 */
export async function fetchCompany(options?: AjaxOptions): Promise<Company> {
  const res = await ajax.get(`${CAR_SOURCE_BASE}/company`, null, options);
  return res?.data || null;
}

/**
 * 获取汽车列表
 */
export async function fetchCarSourceList(options?: AjaxOptions): Promise<CarSource[]> {
  const res = await ajax.get(`${CAR_SOURCE_BASE}/car/source`, null, options);
  return res?.data || [];
}

/**
 * 获取汽车详情
 * @param id 汽车 ID
 */
export async function fetchCarSourceDetail(id: string | number, options?: AjaxOptions): Promise<CarSource | null> {
  const res = await ajax.get(`${CAR_SOURCE_BASE}/car/source/detail`, { id }, options);
  return res?.data || null;
}
