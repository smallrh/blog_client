import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/', // Vite dev server 代理到后端（5000），不要修改 vite.config.ts
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