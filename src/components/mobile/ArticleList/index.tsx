import React from 'react';

interface ArticleListProps {
  category?: string;
  limit?: number;
}

const ArticleList: React.FC<ArticleListProps> = ({ category = 'news', limit = 10 }) => (
  <div className="mobile-article-list" style={{ padding: 12 }}>
    <h3>Article List - {category}</h3>
    <p>Showing {limit} articles</p>
    {/* 实际项目中这里会渲染文章列表 */}
  </div>
);

export default ArticleList;