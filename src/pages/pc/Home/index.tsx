import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../../components/pc/Header';
import styles from './styles.module.scss';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 从document或localStorage获取当前主题
  useEffect(() => {
    const currentTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setIsDarkMode(currentTheme === 'dark');

    // 监听主题变化
    const handleThemeChange = () => {
      const themeProvider = document.getElementById('theme-provider');
      if (themeProvider) {
        setIsDarkMode(themeProvider.getAttribute('data-theme') === 'dark');
      }
    };

    // 监听storage变化，以便在其他标签页更改主题时更新当前页
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme') {
        setIsDarkMode(e.newValue === 'dark');
      }
    });

    return () => {
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  // 主题切换函数，会通知App组件
  const handleThemeToggle = () => {
    // 触发全局主题切换
    const newTheme = !isDarkMode;
    document.documentElement.classList.toggle('dark-mode', newTheme);
    document.documentElement.classList.toggle('light-mode', !newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    setIsDarkMode(newTheme);
    
    // 更新主题提供者数据属性
    const themeProvider = document.getElementById('theme-provider');
    if (themeProvider) {
      themeProvider.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    }
    
    // 触发自定义事件，让App组件知道主题已更改
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme ? 'dark' : 'light' } }));
  };

  const themeClass = isDarkMode ? 'dark-mode' : 'light-mode';

  return (
    <div className={styles['home-container']}>
      {/* 顶部导航 */}
      <Header 
        title={t('header.title')}
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
      />
      
      {/* 主内容区域 */}
      <div className={styles['main-content']}>
        <div className={`${styles['welcome-section']} ${styles[themeClass]}`}>
          <h1 className={styles['welcome-title']}>{t('home.welcome')}</h1>
          
          <div className={`${styles['description-box']} ${styles[themeClass]}`}>
            <p className={styles['description-text']}>
              {t('home.description')}
            </p>
          </div>
          
          <div className={styles['button-container']}>
            <button className={styles['primary-button']}>
              {t('home.explore')}
            </button>
            
            <button className={`${styles['secondary-button']} ${styles[themeClass]}`}>
              {t('home.learnMore')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;