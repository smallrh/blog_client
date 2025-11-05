// 用户相关类型定义

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  created_at?: string;
}

// 登录请求参数
export interface LoginParams {
  account: string; // 用户名或邮箱
  password: string;
}

// 注册请求参数
export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  verify_code: string; // 邮箱验证码
}

// 发送验证码请求参数
export interface SendCodeParams {
  email: string;
  type: 'register' | 'reset_password';
}

// 重置密码请求参数
export interface ResetPasswordParams {
  email: string;
  verify_code: string;
  new_password: string;
}

// 通用响应结构
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  page: Record<string, any>;
}

// 登录/注册成功响应数据
export interface AuthResponse {
  token: string;
  user: User;
}
