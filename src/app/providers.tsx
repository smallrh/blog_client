import React from 'react';
import type { ReactNode } from 'react';
// 导入i18n配置
import './i18n';
<<<<<<< HEAD
// 导入登录提供器
import { LoginProvider } from '../hooks/useLogin';
=======
>>>>>>> e804e7cb10e25652d7d409891df7d503c651e38c

interface ProvidersProps {
  children: ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  // 已经通过导入i18n.ts自动初始化了i18n
  return (
<<<<<<< HEAD
    <LoginProvider>
      {children}
    </LoginProvider>
=======
    <>
      {children}
    </>
>>>>>>> e804e7cb10e25652d7d409891df7d503c651e38c
  );
};

export default Providers;