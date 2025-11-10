import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/pc/Header';
import { useTheme } from '../../../hooks/useTheme';
import type { HotPost } from '../../../types/model/post';
import { getHotPosts } from '../../../services/post';
import styles from './styles.module.scss';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [hotPosts, setHotPosts] = useState<HotPost[]>([]);
  
  // 获取热门文章数据
  useEffect(() => {
    const fetchHotPosts = async () => {
      try {
        const response = await getHotPosts(5);
        console.log('API Response:', response); // 调试日志，查看实际响应结构
        
        // 多层安全检查，确保数据结构符合预期
        if (response && response.code === 200 && response.data && Array.isArray(response.data.list)) {
          setHotPosts(response.data.list);
        } else {
          // 如果响应结构不符合预期，使用默认数据
          console.warn('API响应结构不符合预期，使用默认数据');
          setHotPosts([
            {
              id: 1,
              title: '如何提高前端开发效率',
              slug: 'how-to-improve-frontend-development-efficiency',
              cover: '/vite.svg',
              view_count: 1243
            },
            {
              id: 2,
              title: 'React Hooks 最佳实践',
              slug: 'react-hooks-best-practices',
              cover: '/vite.svg',
              view_count: 987
            },
            {
              id: 3,
              title: 'TypeScript 进阶技巧',
              slug: 'typescript-advanced-tips',
              cover: '/vite.svg',
              view_count: 856
            },
            {
              id: 4,
              title: 'CSS Grid 完全指南',
              slug: 'css-grid-complete-guide',
              cover: '/vite.svg',
              view_count: 742
            },
            {
              id: 5,
              title: '前端性能优化策略',
              slug: 'frontend-performance-optimization',
              cover: '/vite.svg',
              view_count: 689
            }
          ]);
        }
      } catch (error) {
        console.error('获取热门文章失败:', error);
        // 为了开发和预览，当API调用失败时使用默认数据
        setHotPosts([
          {
            id: 1,
            title: '如何提高前端开发效率',
            slug: 'how-to-improve-frontend-development-efficiency',
            cover: '/vite.svg',
            view_count: 1243
          },
          {
            id: 2,
            title: 'React Hooks 最佳实践',
            slug: 'react-hooks-best-practices',
            cover: '/vite.svg',
            view_count: 987
          },
          {
            id: 3,
            title: 'TypeScript 进阶技巧',
            slug: 'typescript-advanced-tips',
            cover: '/vite.svg',
            view_count: 856
          },
          {
            id: 4,
            title: 'CSS Grid 完全指南',
            slug: 'css-grid-complete-guide',
            cover: '/vite.svg',
            view_count: 742
          },
          {
            id: 5,
            title: '前端性能优化策略',
            slug: 'frontend-performance-optimization',
            cover: '/vite.svg',
            view_count: 689
          }
        ]);
      }
    };
    
    fetchHotPosts();
  }, []);
  
  // 处理文章点击
  const handlePostClick = (slug: string) => {
    navigate(`/${t('common.language')}/posts/${slug}`);
  };

  return (
    <div className={`${styles['home-container']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
      {/* 顶部导航 */}
      <Header 
        title={t('header.title')}
      />
      
      {/* 主内容区域 */}
      <div className={`${styles['main-content']} `}>
        <div className={`${styles['welcome-section']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
          <h1 className={styles['welcome-title']}>{t('home.welcome')}</h1>
          
          <div className={`${styles['description-box']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
            <p className={styles['description-text']}>
              {t('home.description')}
            </p>
          </div>
          
          <div className={styles['button-container']}>
            <button className={styles['primary-button']}>
              {t('home.explore')}
            </button>
            
            <button className={`${styles['secondary-button']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
              {t('home.learnMore')}
            </button>
          </div>
        </div>
        
        {/* 热门文章列表 */}
        <div className={`${styles['hot-posts-section']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
          <h2 className={styles['hot-posts-title']}>{t('home.hotPosts')}</h2>
          <div className={styles['hot-posts-list']}>
            {hotPosts.map((post, index) => (
              <div 
                key={post.id} 
                className={`${styles['hot-post-item']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}
                onClick={() => handlePostClick(post.slug)}
              >
                <div className={styles['hot-post-rank']}>{index + 1}</div>
                <img 
                  src={post.cover} 
                  alt={post.title} 
                  className={styles['hot-post-cover']}
                />
                <div className={styles['hot-post-content']}>
                  <h3 className={styles['hot-post-title']}>{post.title}</h3>
                  <div className={styles['hot-post-meta']}>
                    <span className={styles['hot-post-views']}>
                      👁️ {post.view_count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;