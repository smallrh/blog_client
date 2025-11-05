import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../../hooks/useLogin';
import styles from './styles.module.scss';

export interface HeaderProps {
  title?: string;
  logo?: string;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  onLanguageChange?: (lang: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  // title = 'Future Tech Blog', // 暂时注释掉未使用的参数
  logo = '/vite.svg',
  onThemeToggle,
  isDarkMode = false
}) => {
  const { user } = useLogin();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNav, setShowNav] = useState(window.innerWidth >= 768);
  const [activeTab, setActiveTab] = useState('tab1');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  
  // 使用i18n
  const { t, i18n } = useTranslation();
  // 使用导航
  const navigate = useNavigate();
  
  // 语言选项
  const languages = [
    { code: 'en', name: t('languages.en') },
    { code: 'zh', name: t('languages.zh') },
    { code: 'ja', name: t('languages.ja') },
    { code: 'ko', name: t('languages.ko') }
  ];

  // 监听滚动和窗口大小变化
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    const handleResize = () => {
      setShowNav(window.innerWidth >= 768);
      // 窗口变大时隐藏移动端菜单
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };
    
    // 点击外部关闭语言菜单
    const handleClickOutside = () => {
      setShowLanguageMenu(false);
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // 主题通过props传入，不再需要内部状态管理

  // 处理标签切换
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // 这里可以添加导航逻辑，比如滚动到对应部分或使用router跳转
    const element = document.getElementById(tabId.replace('tab', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 定义标签数据
  const tabs = [
    { id: 'tab1', label: t('header.tabs.0.label'), target: 'home' },
    { id: 'tab2', label: t('header.tabs.1.label'), target: 'articles' },
    { id: 'tab3', label: t('header.tabs.2.label'), target: 'categories' },
    { id: 'tab4', label: t('header.tabs.4.label'), target: 'about' },
  ];

  return (
    <header 
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''} ${!isDarkMode ? styles.lightMode : ''}`}
    >
      <div className={styles.headerContainer}>
        {/* Logo和标题部分 */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <div className={styles.logoGlow}></div>
            <img 
              src={logo} 
              alt="Logo" 
              className={styles.logoImage}
            />
          </div>
          
          <h1 className={styles.headerTitle}>
            {t('header.title')}
          </h1>
        </div>

        {/* 选项卡导航 - 桌面端 */}
        {showNav && (
          <div className={styles.tabsContainer}>
            {/* 背景滑动条 - 修复定位计算 */}
            <div 
              className={styles.tabsBackground}
              style={{ transform: `translateX(${tabs.findIndex(tab => tab.id === activeTab) * 100}px)` }}
            />
            
            {/* 移除上下装饰条，简化设计 */}

            {/* 选项卡标签 - 对齐优化 */}
            {tabs.map((tab) => (
              <React.Fragment key={tab.id}>
                <input 
                  type="radio" 
                  id={tab.id} 
                  name="tabs" 
                  className={styles.tabInput}
                  checked={activeTab === tab.id}
                  onChange={() => handleTabChange(tab.id)}
                />
                <label 
                  htmlFor={tab.id}
                  className={`${styles.tabLabel} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabChange(tab.id);
                  }}
                >
                  {tab.label}
                </label>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* 右侧功能区 */}
        <div className={styles.controlsSection}>
          {/* 登录按钮或用户头像 */}
          {user ? (
            <div 
              className={styles.userAvatar}
              onClick={(e) => {
                e.stopPropagation();
                // 跳转到用户中心，带上当前语言参数
                navigate(`/${i18n.language}/user/profile`);
              }}
            >
              <img 
                src={user.avatar || '/vite.svg'} 
                alt={user.name || 'User'} 
                className={styles.avatarImage}
              />
            </div>
          ) : (
            <button 
              className={styles.loginButton}
              onClick={(e) => {
                e.stopPropagation();
                // 跳转到登录/注册页面，带上当前语言参数
                navigate(`/${i18n.language}/auth`);
              }}
            >
              {t('header.loginRegister')}
            </button>
          )}
          

          {/* 主题切换按钮 - SVG太阳月亮切换按钮 */}
          {onThemeToggle && (
            <label 
              className={styles.themeSwitch}
              onClick={(e) => {
                // 防止点击传播到文档
                e.stopPropagation();
              }}
            >
              <span className={`${styles.sunIcon} ${isDarkMode ? styles.darkMode : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g fill="#ffd43b">
                    <circle r="5" cy="12" cx="12"></circle>
                    <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path>
                  </g>
                </svg>
              </span>
              <span className={`${styles.moonIcon} ${isDarkMode ? styles.darkMode : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path fill={isDarkMode ? '#fff' : '#73C0FC'} d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path>
                </svg>
              </span>
              <input 
                type="checkbox" 
                className={styles.switchInput}
                checked={isDarkMode}
                onChange={onThemeToggle}
              />
              <span 
                className={`${styles.switchSlider} ${isDarkMode ? styles.darkMode : ''}`}
              >
                <span className={`${styles.sliderThumb} ${isDarkMode ? styles.darkMode : ''}`}></span>
              </span>
            </label>
          )},
          
          {/* 多语言菜单 */}
          <div 
            className={styles.languageSelector}
            onClick={(e) => {
              e.stopPropagation();
              setShowLanguageMenu(!showLanguageMenu);
            }}
          >
            <button className={styles.languageButton}>
              {i18n.language.toUpperCase()}
              <span className={styles.buttonGlow}></span>
            </button>
            
            {/* 语言下拉菜单 */}
            {showLanguageMenu && (
              <div className={styles.languageMenu}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLanguageMenu(false);
                        
                      // 切换语言并更新URL，确保URL中包含语言参数
                      // 这样刷新页面后语言设置不会丢失
                      const currentPath = window.location.pathname;
                      const pathParts = currentPath.split('/').filter(Boolean);
                      
                      // 如果当前路径已经包含语言参数，替换它
                      if (pathParts.length > 0 && ['zh', 'en', 'ja', 'ko'].includes(pathParts[0])) {
                        pathParts[0] = lang.code;
                        navigate(`/${pathParts.join('/')}`, { replace: true });
                      } else {
                        // 否则添加语言参数到路径开头
                        navigate(`/${lang.code}${currentPath || ''}`, { replace: true });
                      }
                      
                      // 同时更新i18n的语言设置
                      i18n.changeLanguage(lang.code).catch(err => {
                        console.error('语言切换失败:', err);
                      });
                    }}
                    className={`${styles.languageOption} ${i18n.language === lang.code ? styles.active : ''}`}
                  >
                    <span>{lang.name}</span>
                    {i18n.language === lang.code && (
                      <span className={styles.checkmark}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 移动端菜单按钮 - 新设计 */}
          {!showNav && (
            <button
              className={styles.mobileMenuButton}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              title="Menu"
            >
              ≡
              {/* 发光效果 */}
              <span className={styles.menuGlow}></span>
            </button>
          )}
        </div>
      </div>

      {/* 移动端菜单 - 新设计 */}
      {showMobileMenu && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContainer}>
            {/* 移动端选项卡导航 */}
            <div className={styles.mobileTabsContainer}>
              {tabs.map((tab) => (
                <label 
                  key={tab.id}
                  htmlFor={`mobile-${tab.id}`}
                  className={styles.mobileTabLabel}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabChange(tab.id);
                    setShowMobileMenu(false);
                  }}
                >
                  <input 
                    type="radio" 
                    id={`mobile-${tab.id}`} 
                    name="mobile-tabs" 
                    className={styles.mobileTabInput}
                    checked={activeTab === tab.id}
                    onChange={() => {
                      handleTabChange(tab.id);
                      setShowMobileMenu(false);
                    }}
                  />
                  <div className={styles.mobileTabContent}>
                    <span>{tab.label}</span>
                    <span className={`${styles.tabIndicator} ${activeTab === tab.id ? styles.active : ''}`}></span>
                  </div>
                  {activeTab === tab.id && (
                    <div className={styles.activeLine}></div>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 装饰线条 - 增强设计 */}
      <div className={styles.decorativeLine}></div>
      {/* 额外装饰元素 */}
      <div className={styles.decorativeCenterLine}></div>
    </header>
  );
};

export default Header;