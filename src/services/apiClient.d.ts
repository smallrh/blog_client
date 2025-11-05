// apiClient 类型声明文件
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types/user';

// 定义扩展的ApiClient接口
interface ApiClient extends AxiosInstance {
  getGlobalSnippets?: (language?: string, key?: string, app?: string) => Promise<any>;
}

// 导出apiClient实例
declare const apiClient: ApiClient;

export default apiClient;

// 重新导出ApiResponse类型
export type { ApiResponse } from '../types/user';