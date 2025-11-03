import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './app/router/pc-routes';
import Providers from './app/providers';
import './App.css';

function App() {
  // 初始化主题状态，优先使用localStorage，其次检测系统偏好
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    // 检测系统主题偏好
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 应用主题到文档
  const applyTheme = (darkMode: boolean) => {
    const root = document.documentElement;
    root.classList.toggle('dark-mode', darkMode);
    root.classList.toggle('light-mode', !darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    
    // 更新主题提供器元素
    const themeProvider = document.getElementById('theme-provider');
    if (themeProvider) {
      themeProvider.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }
  };

  // 初始化主题
  useEffect(() => {
    applyTheme(isDarkMode);
  }, []);

  // 监听主题状态变化
  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode]);

  // 监听主题切换事件（来自子组件）
  useEffect(() => {
    const handleThemeChanged = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.theme) {
        setIsDarkMode(customEvent.detail.theme === 'dark');
      }
    };

    window.addEventListener('themeChanged', handleThemeChanged as EventListener);
    return () => {
      window.removeEventListener('themeChanged', handleThemeChanged as EventListener);
    };
  }, []);

  // 主题切换函数 - 保留以支持子组件调用
  // 注意：这里暂时注释掉未使用的函数声明，避免TypeScript警告
  // const toggleTheme = () => {
  //   setIsDarkMode(!isDarkMode);
  // };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* 使用Providers组件包裹，确保i18n正确初始化 */}
      <Providers>
        {/* 路由提供器 */}
        <RouterProvider router={router} />
      </Providers>
      
      {/* 主题状态全局标识元素 */}
      <div 
        id="theme-provider" 
        data-theme={isDarkMode ? 'dark' : 'light'}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default App;