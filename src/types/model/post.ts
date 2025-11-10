// 文章模型类型定义

export interface Category {
  id: number;
  name: string;
  slug?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug?: string;
}

export interface Author {
  id: number;
  name: string;
  avatar: string;
}

export interface HotPost {
  id: number;
  title: string;
  slug: string;
  cover: string;
  view_count: number;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  cover: string;
  view_count: number;
  like_count?: number;
  comment_count?: number;
  category?: Category;
  tags?: Tag[];
  user?: Author;
  created_at: string;
  updated_at?: string;
}