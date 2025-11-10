import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/pc/Header';
import { useTheme } from '../../../hooks/useTheme';
import type { Category as BaseCategory } from '../../../types/model/post';
import type { Post } from '../../../types/model/post';
import { getPosts } from '../../../services/post';
import styles from './styles.module.scss';

// 扩展Category类型，添加post_count属性
interface Category extends BaseCategory {
  post_count: number;
}

// 模拟分类数据，实际应用中应从API获取
const mockCategories: Category[] = [
  {
    id: 1,
    name: '前端开发',
    slug: 'frontend',
    post_count: 12
  },
  {
    id: 2,
    name: '后端开发',
    slug: 'backend',
    post_count: 8
  },
  {
    id: 3,
    name: '移动开发',
    slug: 'mobile',
    post_count: 5
  },
  {
    id: 4,
    name: 'DevOps',
    slug: 'devops',
    post_count: 7
  },
  {
    id: 5,
    name: '人工智能',
    slug: 'ai',
    post_count: 6
  },
  {
    id: 6,
    name: '产品设计',
    slug: 'design',
    post_count: 4
  }
];

const Categories: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 获取分类数据（模拟）
  useEffect(() => {
    // 实际项目中应该从API获取分类数据
    setCategories(mockCategories);
    setLoading(false);
  }, []);
  
  // 当选择分类变化时，加载对应分类的文章
  useEffect(() => {
    if (!selectedCategory) {
      setFilteredPosts([]);
      return;
    }
    
    const fetchPostsByCategory = async () => {
      setLoading(true);
      try {
        // 这里应该根据分类ID或slug获取文章列表
        // 由于没有直接的API，我们使用getPosts并添加过滤逻辑
        const response = await getPosts({ page: 1, pageSize: 10 });
        
        // 多层安全检查
        if (response && response.code === 200 && response.data && Array.isArray(response.data.list)) {
          // 模拟按分类筛选（实际API应该支持分类参数）
          const posts = response.data.list.map(post => ({ ...post, category_id: Math.floor(Math.random() * 6) + 1 }));
          const categoryId = categories.find(c => c.slug === selectedCategory)?.id || 1;
          setFilteredPosts(posts.filter(post => post.category_id === categoryId));
        } else {
          // 使用模拟数据
          console.warn('API响应结构不符合预期，使用默认数据');
          setFilteredPosts([
            {
              id: 1,
              title: `${mockCategories.find(c => c.slug === selectedCategory)?.name} 相关文章示例`,
              slug: `${selectedCategory}-example-post`,
              cover: '/vite.svg',
              excerpt: '这是一篇关于该分类的示例文章，介绍了相关技术和实践...',
              created_at: '2024-01-15',
              view_count: 567
            }
          ]);
        }
      } catch (error) {
        console.error('获取分类文章失败:', error);
        // 使用模拟数据
        setFilteredPosts([
          {
            id: 1,
            title: `${mockCategories.find(c => c.slug === selectedCategory)?.name} 相关文章示例`,
            slug: `${selectedCategory}-example-post`,
            cover: '/vite.svg',
            excerpt: '这是一篇关于该分类的示例文章，介绍了相关技术和实践...',
            created_at: '2024-01-15',
            view_count: 567
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostsByCategory();
  }, [selectedCategory, categories]);
  
  // 处理分类点击
  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(selectedCategory === slug ? null : slug);
  };
  
  // 处理文章点击
  const handlePostClick = (slug: string) => {
    navigate(`/${t('common.language')}/posts/${slug}`);
  };

  return (
    <div className={`${styles['categories-container']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
      {/* 顶部导航 */}
      <Header 
        title={t('header.title')}
      />
      
      {/* 主内容区域 */}
      <div className={`${styles['main-content']} `}>
        <div className={`${styles['page-header']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
          <h1 className={styles['page-title']}>{t('categories.title')}</h1>
          <p className={styles['page-description']}>{t('categories.description')}</p>
        </div>
        
        <div className={styles['content-layout']}>
          {/* 分类列表 */}
          <div className={`${styles['categories-sidebar']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
            <h2 className={styles['sidebar-title']}>{t('categories.allCategories')}</h2>
            <div className={styles['categories-list']}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`${styles['category-item']} ${
                    selectedCategory === category.slug ? styles['selected'] : ''
                  } ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}
                  onClick={() => handleCategoryClick(category.slug || '')}
                >
                  <div className={styles['category-name']}>{category.name}</div>
                  <div className={styles['category-count']}>{category.post_count}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 分类文章内容 */}
          <div className={`${styles['category-content']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
            {selectedCategory ? (
              <>
                <div className={styles['category-header']}>
                  <h2 className={styles['category-title']}>
                    {categories.find(c => c.slug === selectedCategory)?.name || ''}
                  </h2>
                  <button
                    className={`${styles['clear-filter']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    {t('categories.clearFilter')}
                  </button>
                </div>
                
                {loading ? (
                  <div className={styles['loading']}>{t('common.loading')}</div>
                ) : filteredPosts.length > 0 ? (
                  <div className={styles['posts-list']}>
                    {filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        className={`${styles['post-item']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}
                        onClick={() => handlePostClick(post.slug)}
                      >
                        <h3 className={styles['post-title']}>{post.title}</h3>
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
                    ))}
                  </div>
                ) : (
                  <div className={`${styles['empty-state']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
                    <p>{t('categories.emptyState')}</p>
                  </div>
                )}
              </>
            ) : (
              <div className={`${styles['select-category']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
                <p>{t('categories.selectCategory')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
