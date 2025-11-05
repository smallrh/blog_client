import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:9000', // 后端端口是localhost:9000
  timeout: 10000,
});

// 获取 global snippets（单条或多条）
export const getGlobalSnippets = (language = 'en-US', key = '', app = 'blog') => {
  const params = { language, app };
  if (key) params.key = key;
  return apiClient.get('/api/global-snippets', { params });
};

// 导出客户实例以便其他 service 使用
export default apiClient;