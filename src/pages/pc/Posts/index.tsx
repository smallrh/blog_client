import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/pc/Header';
import { useTheme } from '../../../hooks/useTheme';
import type { Post } from '../../../types/model/post';
import { getPosts } from '../../../services/post';
import styles from './styles.module.scss';

const Posts: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // 获取文章列表数据
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts({ page, pageSize: 10 });
        console.log('Posts API Response:', response);
        
        // 多层安全检查
        if (response && response.code === 200 && response.data && Array.isArray(response.data.list)) {
          if (page === 1) {
            setPosts(response.data.list);
          } else {
            setPosts(prev => [...prev, ...response.data.list]);
          }
          // 判断是否还有更多数据
          if (response.page && response.page.current >= response.page.totalPages) {
            setHasMore(false);
          }
        } else {
          // 如果响应结构不符合预期，使用默认数据
          console.warn('API响应结构不符合预期，使用默认数据');
          setPosts([
            {
              id: 1,
              title: '如何提高前端开发效率',
              slug: 'how-to-improve-frontend-development-efficiency',
              cover: '/vite.svg',
              excerpt: '本文介绍了10个提高前端开发效率的技巧，包括代码规范、工具使用等方面...',
              created_at: '2024-01-15',
              view_count: 1243
            },
            {
              id: 2,
              title: 'React Hooks 最佳实践',
              slug: 'react-hooks-best-practices',
              cover: '/vite.svg',
              excerpt: '深入探讨React Hooks的使用场景和最佳实践，帮助你写出更优雅的React代码...',
              created_at: '2024-01-12',
              view_count: 987
            },
            {
              id: 3,
              title: 'TypeScript 进阶技巧',
              slug: 'typescript-advanced-tips',
              cover: '/vite.svg',
              excerpt: '掌握TypeScript的高级特性，让你的类型系统更加安全和灵活...',
              created_at: '2024-01-10',
              view_count: 856
            }
          ]);
          setHasMore(false);
        }
      } catch (error) {
        console.error('获取文章列表失败:', error);
        // 为了开发和预览，当API调用失败时使用默认数据
        setPosts([
          {
            id: 1,
            title: '如何提高前端开发效率',
            slug: 'how-to-improve-frontend-development-efficiency',
            cover: '/vite.svg',
            excerpt: '本文介绍了10个提高前端开发效率的技巧，包括代码规范、工具使用等方面...',
            created_at: '2024-01-15',
            view_count: 1243
          },
          {
            id: 2,
            title: 'React Hooks 最佳实践',
            slug: 'react-hooks-best-practices',
            cover: '/vite.svg',
            excerpt: '深入探讨React Hooks的使用场景和最佳实践，帮助你写出更优雅的React代码...',
            created_at: '2024-01-12',
            view_count: 987
          },
          {
            id: 3,
            title: 'TypeScript 进阶技巧',
            slug: 'typescript-advanced-tips',
            cover: '/vite.svg',
            excerpt: '掌握TypeScript的高级特性，让你的类型系统更加安全和灵活...',
            created_at: '2024-01-10',
            view_count: 856
          }
        ]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [page]);
  
  // 处理文章点击
  const handlePostClick = (slug: string) => {
    navigate(`/${t('common.language')}/posts/${slug}`);
  };

  // 加载更多
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className={`${styles['posts-container']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
      <Header />
      <div className={styles['main-content']}>
        <div className={`${styles['page-header']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
          <h1 className={styles['page-title']}>{t('posts.title')}</h1>
          <p className={styles['page-description']}>{t('posts.description')}</p>
        </div>
        
        {/* 文章列表 */}
        <div className={`${styles['posts-section']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
          <div className={styles['posts-list']}>
            {posts.map((post) => (
              <div 
                key={post.id} 
                className={`${styles['post-item']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}
                onClick={() => handlePostClick(post.slug)}
              >
                <img 
                  src={post.cover} 
                  alt={post.title} 
                  className={styles['post-cover']}
                />
                <div className={styles['post-content']}>
                  <h2 className={styles['post-title']}>{post.title}</h2>
                  <p className={styles['post-excerpt']}>{post.excerpt}</p>
                  <div className={styles['post-meta']}>
                    <span className={styles['post-date']}>
                      📅 {post.created_at}
                    </span>
                    <span className={styles['post-views']}>
                      👁️ {post.view_count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 加载更多按钮 */}
          {hasMore && (
            <div className={styles['load-more-container']}>
              <button 
                className={`${styles['load-more-button']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? t('common.loading') : t('posts.loadMore')}
              </button>
            </div>
          )}
          
          {/* 没有更多数据提示 */}
          {!hasMore && posts.length > 0 && (
            <div className={styles['no-more-data']}>
              {t('posts.noMoreData')}
            </div>
          )}
          
          {/* 空状态 */}
          {!loading && posts.length === 0 && (
            <div className={`${styles['empty-state']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
              <p>{t('posts.emptyState')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;