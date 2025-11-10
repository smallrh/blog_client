// 重置密码请求参数类型

export interface ResetPasswordParams {
  email: string;
  verify_code: string;
  new_password: string;
}
