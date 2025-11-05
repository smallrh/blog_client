// 认证相关服务
import apiClient from './apiClient';
import type {
  LoginParams,
  RegisterParams,
  SendCodeParams,
  ResetPasswordParams,
  AuthResponse,
  ApiResponse,
  User
} from '../types/user';

/**
 * 发送验证码
 * @param params 发送验证码参数
 * @returns Promise<ApiResponse>
 */
export const sendVerificationCode = async (params: SendCodeParams): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post('/api/frontend/auth/send-code', params);
    return response.data;
  } catch (error) {
    console.error('发送验证码失败:', error);
    throw error;
  }
};

/**
 * 用户登录
 * @param params 登录参数
 * @returns Promise<ApiResponse<AuthResponse>>
 */
export const login = async (params: LoginParams): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await apiClient.post('/api/frontend/auth/login', params);
    // 登录成功后保存token到localStorage
    if (response.data.code === 200 && response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

/**
 * 用户注册
 * @param params 注册参数
 * @returns Promise<ApiResponse<AuthResponse>>
 */
export const register = async (params: RegisterParams): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await apiClient.post('/api/frontend/auth/register', params);
    // 注册成功后保存token到localStorage
    if (response.data.code === 200 && response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};

/**
 * 用户登出
 * @returns Promise<ApiResponse>
 */
export const logout = async (): Promise<ApiResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('未登录');
    }
    
    const response = await apiClient.post('/api/frontend/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // 登出成功后清除localStorage中的token
    if (response.data.code === 200) {
      localStorage.removeItem('auth_token');
    }
    
    return response.data;
  } catch (error) {
    console.error('登出失败:', error);
    // 即使请求失败也清除token
    localStorage.removeItem('auth_token');
    throw error;
  }
};

/**
 * 获取当前用户信息
 * @returns Promise<ApiResponse<{ user: User }>>
 */
export const getCurrentUser = async (): Promise<ApiResponse<{ user: User }>> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('未登录');
    }
    
    const response = await apiClient.get('/api/frontend/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

/**
 * 重置密码
 * @param params 重置密码参数
 * @returns Promise<ApiResponse>
 */
export const resetPassword = async (params: ResetPasswordParams): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post('/api/frontend/auth/reset-password', params);
    return response.data;
  } catch (error) {
    console.error('重置密码失败:', error);
    throw error;
  }
};

/**
 * 检查用户是否已登录
 * @returns boolean 是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

/**
 * 获取认证token
 * @returns string | null token或null
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};
