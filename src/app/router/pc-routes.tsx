import React from 'react';
import { createBrowserRouter, useParams, useNavigate } from 'react-router-dom';
import Home from '../../pages/pc/Home';
import AboutUs from '../../pages/pc/About';
import Posts from '../../pages/pc/Posts';
import Categories from '../../pages/pc/Categories';
import Login from '../../pages/pc/Auth/login';
import ForgetPass from '../../pages/pc/Auth/forget_pass';
import SignUp from '../../pages/pc/Auth/sign_up';
import ResetPassword from '../../pages/pc/Auth/reset_password';
import NotFound from '../../pages/pc/NotFound';
import Error from '../../pages/pc/Error';
import i18n from '../i18n';
import { useEffect } from 'react';

// 语言重定向组件 - 确保URL中始终包含lang参数
const LanguageRedirector: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // 获取当前语言，如果没有设置则使用默认语言'zh'
    const currentLang = i18n.language || 'zh';
    
    // 获取当前路径，判断是否是404情况
    const currentPath = window.location.pathname;
    
    // 简单判断是否有子路径（除了根路径和语言路径外的路径）
    const hasSubPath = currentPath.split('/').length > 2 && currentPath !== '/pc';
    
    if (hasSubPath) {
      // 对于有子路径的情况，重定向到404页面
      navigate(`/${currentLang}/404`, { replace: true });
    } else {
      // 否则重定向到带语言参数的首页
      navigate(`/${currentLang}`, { replace: true });
    }
  }, []);
  
  return null;
};

// 语言路由包装组件
const LanguageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const params = useParams<{ lang?: string }>();
  const lang = params.lang;

  useEffect(() => {
    // 确保URL中的语言参数被正确应用到i18n
    if (lang && ['zh', 'en', 'ja', 'ko'].includes(lang)) {
      // 强制重新加载翻译资源
      i18n.loadNamespaces(['translation']).then(() => {
        // 清除可能导致缓存的localStorage项
        localStorage.removeItem('i18nextLng');
        // 显式设置语言并触发资源重新加载
        i18n.changeLanguage(lang).then(() => {
          console.log('语言切换成功:', lang);
        }).catch(err => {
          console.error('语言切换失败:', err);
        });
      });
    } else if (!lang) {
      // 如果没有语言参数，使用默认语言
      i18n.changeLanguage('zh');
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
  { path: '/:lang/posts',
    element: <LanguageRoute><Posts /></LanguageRoute>,
  },
  { path: '/:lang/categories',
    element: <LanguageRoute><Categories /></LanguageRoute>,
  },
  { path: '/:lang/about',
    element: <LanguageRoute><AboutUs /></LanguageRoute>,
  },
  {
    path: '/:lang/auth',
    element: <LanguageRoute><Login /></LanguageRoute>,
  },
  {
    path: '/:lang/auth/login',
    element: <LanguageRoute><Login /></LanguageRoute>,
  },
  {
    path: '/:lang/auth/forget_pass',
    element: <LanguageRoute><ForgetPass /></LanguageRoute>,
  },
  { path: '/:lang/auth/sign_up',
    element: <LanguageRoute><SignUp /></LanguageRoute>,
  },
  { path: '/:lang/auth/reset_password',
    element: <LanguageRoute><ResetPassword /></LanguageRoute>,
  },

  { path: '/auth',
    element: <LanguageRedirector />, // 不带语言参数的auth路径也重定向
  },
  // 直接的404页面路由

  { path: '/:lang/404',
    element: <LanguageRoute><NotFound /></LanguageRoute>,
  },
  // 错误处理路由 - 带语言前缀

  { path: '/:lang/error',
    element: <LanguageRoute><Error /></LanguageRoute>,
  },
  // 捕获所有带语言前缀的未匹配路由 - 放在最后作为兜底

  { path: '/:lang/*',
    element: <LanguageRoute><NotFound /></LanguageRoute>,
  },
  // 捕获所有不带语言前缀的未匹配路由
  { path: '*',
    element: <LanguageRedirector />, // 重定向到带语言参数的404页面
  },
];

const router = createBrowserRouter(routes);

export default router;