// 通用响应类型
export interface ApiResponse<T = any> {
  version: string;
  sign?: string;
  signType: string;
  format: string;
  code: number;
  message: string;
  errors: any;
  timestamp: string;
  data: T;
  success?: boolean;
}

// 通用分页内容类型
export interface TableContent<T = any> {
  content: T[];
  number: number;
  size: number;
  numberOfElements: number;
  totalElements: number;
  pageable?: {
    pageNumber: number;
    pageSize: number;
    sort?: any;
    offset?: number;
    paged?: boolean;
    unpaged?: boolean;
  };
  empty?: boolean;
  [key: string]: any;
} 


// 基础扩展对象
export type BaseExt = {
  [key: string]: any;
};