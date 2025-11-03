import React from 'react';
import type { ReactNode } from 'react';
// 导入i18n配置
import './i18n';

interface ProvidersProps {
  children: ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  // 已经通过导入i18n.ts自动初始化了i18n
  return (
    <>
      {children}
    </>
  );
};

export default Providers;