// apiClient 类型声明文件
import { AxiosInstance } from 'axios';

interface ApiClient extends AxiosInstance {
  getGlobalSnippets?: () => Promise<any>;
}

declare const apiClient: ApiClient;

export default apiClient;