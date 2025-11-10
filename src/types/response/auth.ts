// 认证相关响应类型
import type { User } from '../model/user';

export interface AuthResponse {
  token: string;
  user: User;
}
