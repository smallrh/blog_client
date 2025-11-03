import React from 'react';
import { createBrowserRouter, useParams, useNavigate } from 'react-router-dom';
import Home from '../../pages/pc/Home';
import AboutUs from '../../pages/pc/AboutUs';
import Auth from '../../pages/pc/Auth';
import i18n from '../i18n';
import { useEffect } from 'react';

// 语言重定向组件 - 确保URL中始终包含lang参数
const LanguageRedirector: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // 获取当前语言，如果没有设置则使用默认语言'zh'
    const currentLang = i18n.language || 'zh';
    // 重定向到带语言参数的首页
    navigate(`/${currentLang}`, { replace: true });
  }, []);
  
  return null;
};

// 语言路由包装组件
const LanguageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const params = useParams<{ lang?: string }>();
  const lang = params.lang;

  useEffect(() => {
    // 如果URL中有语言参数且是支持的语言，更新i18n的当前语言
    if (lang && ['zh', 'en', 'ja', 'ko'].includes(lang)) {
      i18n.changeLanguage(lang);
    } else if (!lang) {
      // 如果没有语言参数，使用当前已设置的语言或默认语言
      const currentLang = i18n.language;
      if (!['zh', 'en', 'ja', 'ko'].includes(currentLang)) {
        i18n.changeLanguage('zh');
      }
    }
  }, [lang]);

  return <>{children}</>;
};

// 带语言前缀的通用包装路由组件
const LanguageRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <LanguageWrapper>{children}</LanguageWrapper>;
};

const routes = [
  {
    path: '/',
    element: <LanguageRedirector />, // 根路径重定向到带语言参数的URL
  },
  {
    path: '/:lang',
    element: <LanguageRoute><Home /></LanguageRoute>,
  },
  {
    path: '/:lang/pc',
    element: <LanguageRoute><Home /></LanguageRoute>,
  },
  {
    path: '/pc',
    element: <LanguageRedirector />, // 不带语言参数的pc路径也重定向
  },
  {
    path: '/:lang/about',
    element: <LanguageRoute><AboutUs /></LanguageRoute>,
  },
  {
    path: '/:lang/auth',
    element: <LanguageRoute><Auth /></LanguageRoute>,
  },
  {
    path: '/about',
    element: <LanguageRedirector />, // 不带语言参数的about路径也重定向
  },
  {
    path: '/auth',
    element: <LanguageRedirector />, // 不带语言参数的auth路径也重定向
  }
];

const router = createBrowserRouter(routes);

export default router;