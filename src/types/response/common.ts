// 通用响应结构类型

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  page: Record<string, any>;
}
