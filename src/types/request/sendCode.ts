// 发送验证码请求参数类型

export interface SendCodeParams {
  email: string;
  type: 'register' | 'reset_password';
}
