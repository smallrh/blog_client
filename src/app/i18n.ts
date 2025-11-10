import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// 配置i18n
i18n
  // 加载翻译文件的后端
  .use(Backend)
  // 自动检测用户语言
  .use(LanguageDetector)
  // 集成到React
  .use(initReactI18next)
  .init({
    // 默认语言设置为中文
    fallbackLng: 'zh',
    // 移除直接从localStorage读取，让detector处理
    lng: undefined,
    debug: import.meta.env.DEV,
    // 路径参数解析 - 简化配置，让路由组件处理语言切换
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
    },
    // 后端配置
    backend: {
      // 翻译文件路径
      loadPath: '/locales/{{lng}}/translation.json',
      // 确保路径正确解析
      parse: (data: string) => JSON.parse(data),
    },
    interpolation: {
      escapeValue: false, // React已经默认转义了
    },
    // 允许在不同命名空间之间切换
    ns: ['translation'],
    defaultNS: 'translation',
    // 支持的语言列表
    supportedLngs: ['zh', 'en', 'ja', 'ko'],
    // 确保资源加载完成后再渲染
    react: {
      useSuspense: false,
    },
  });

export default i18n;