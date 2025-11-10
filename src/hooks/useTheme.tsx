import React, { useState, useEffect, createContext, useContext,type ReactNode } from 'react';

// 主题类型定义
export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题Provider组件
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 从localStorage获取主题设置，如果没有则使用系统偏好
  const getInitialTheme = (): ThemeMode => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme as ThemeMode;
    }
    // 检测系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  // 切换主题
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // 当主题改变时更新localStorage和HTML class
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    document.documentElement.classList.toggle('light-theme', theme === 'light');
  }, [theme]);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在没有保存主题设置时才响应系统变化
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

// useTheme hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
