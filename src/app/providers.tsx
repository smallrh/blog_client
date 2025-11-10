import React from 'react';
import type { ReactNode } from 'react';
// 导入i18n配置
import './i18n';

// 导入登录提供器
import { LoginProvider } from '../hooks/useLogin';
// 导入主题提供器
import { ThemeProvider } from '../hooks/useTheme';


interface ProvidersProps {
  children: ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  // 已经通过导入i18n.ts自动初始化了i18n
  return (
    <ThemeProvider>
      <LoginProvider>
        {children}
      </LoginProvider>
    </ThemeProvider>
  );
};

export default Providers;