// 文章相关响应类型定义
import type { Post, HotPost } from '../model/post';

/**
 * 文章列表响应
 */
export interface PostListResponse {
  code: number;
  message: string;
  data: {
    count: number;
    list: Post[];
  };
  page: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 热门文章响应
 */
export interface HotPostsResponse {
  code: number;
  message: string;
  data: {
    list: HotPost[];
  };
  page: {};
}

/**
 * 文章详情响应
 */
export interface PostDetailResponse {
  code: number;
  message: string;
  data: Post & {
    content: string;
    comment_count: number;
    updated_at: string;
  };
  page: {};
}

/**
 * 点赞/取消点赞响应
 */
export interface LikeResponse {
  code: number;
  message: string;
  data: {
    like_count: number;
    is_liked: boolean;
  };
  page: {};
}