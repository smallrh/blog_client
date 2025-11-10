// 注册请求参数类型

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  verify_code: string; // 邮箱验证码
}
