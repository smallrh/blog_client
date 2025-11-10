import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import apiClient from '../services/apiClient';
import type { User } from '../types/model/user';


// 登录上下文接口
interface LoginContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (account: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, verify_code: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

// 创建登录上下文
const LoginContext = createContext<LoginContextType | undefined>(undefined);

// LoginProvider组件
export const LoginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 从本地存储加载登录状态
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      const userData = JSON.parse(savedUser);
      // 确保userData有username属性
      const userWithUsername = userData.username ? userData : { ...userData, username: userData.name || 'User' };
      setUser(userWithUsername);
      // 设置API客户端的认证token
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    
    setIsLoading(false);
  }, []);

  // 登录函数
  const login = async (account: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/api/frontend/auth/login', { account, password });
      
      const { token: newToken, user: userData } = response.data.data;
      
      // 保存到状态和本地存储
      setToken(newToken);
      // 确保userData有username属性，可能需要兼容处理
      const userWithUsername = userData.username ? userData : { ...userData, username: userData.name || 'User' };
      setUser(userWithUsername);
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('user', JSON.stringify(userWithUsername));
      
      // 设置API客户端的认证token
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出函数
  const logout = async () => {
    try {
      setIsLoading(true);
      // 调用登出API
      await apiClient.post('/api/frontend/auth/logout');
    } catch (error) {
      console.error('Logout API failed, but still clearing local state:', error);
    } finally {
      // 清除状态和本地存储
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      delete apiClient.defaults.headers.common['Authorization'];
      setIsLoading(false);
    }
  };

  // 注册函数
  const register = async (name: string, email: string, password: string, verify_code: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/api/frontend/auth/register', {
        username: name, // 使用name作为username
        email,
        password,
        verify_code
      });
      
      const { token: newToken, user: userData } = response.data.data;
      
      // 保存到状态和本地存储
      setToken(newToken);
      // 确保userData有username属性
      const userWithUsername = userData.username ? userData : { ...userData, username: userData.name || name || 'User' };
      setUser(userWithUsername);
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('user', JSON.stringify(userWithUsername));
      
      // 设置API客户端的认证token
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 检查认证状态
  const checkAuth = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/frontend/auth/me');
      const userData = response.data.data.user;
      // 确保userData有username属性
      const userWithUsername = userData.username ? userData : { ...userData, username: userData.name || 'User' };
      setUser(userWithUsername);
      localStorage.setItem('user', JSON.stringify(userWithUsername));
    } catch (error) {
      console.error('Auth check failed, clearing session:', error);
      // 认证失败，清除会话
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      delete apiClient.defaults.headers.common['Authorization'];
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    register,
    checkAuth
  };

  return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>;
};

// 自定义hook
export const useLogin = () => {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};
