import apiClient from './apiClient';
import type { PostListResponse, HotPostsResponse, LikeResponse, PostDetailResponse } from '../types/response/post';
import type { GetPostsParams, LikePostParams } from '../types/request/post';

/**
 * 获取文章列表
 * @param params 请求参数
 * @returns 文章列表响应
 */
export const getPosts = async (params?: GetPostsParams): Promise<PostListResponse> => {
  const response = await apiClient.get<PostListResponse>('/api/frontend/posts', {
    params: {
      page: 1,
      pageSize: 10,
      order: 'created_at',
      sort: 'desc',
      ...params,
    },
  });
  return response.data;
};

/**
 * 获取热门文章
 * @param limit 返回数量
 * @returns 热门文章响应
 */
export const getHotPosts = async (limit: number = 5): Promise<HotPostsResponse> => {
  const response = await apiClient.get<HotPostsResponse>('/api/frontend/posts/hot', {
    params: { limit },
  });
  return response.data;
};

/**
 * 获取文章详情
 * @param slug 文章别名
 * @returns 文章详情响应
 */
export const getPostBySlug = async (slug: string): Promise<PostDetailResponse> => {
  const response = await apiClient.get(`/api/frontend/posts/${slug}`);
  return response.data;
};

/**
 * 点赞文章
 * @param params 点赞参数
 * @returns 点赞响应
 */
export const likePost = async (params: LikePostParams): Promise<LikeResponse> => {
  const response = await apiClient.post<LikeResponse>(`/api/frontend/posts/${params.id}/like`, {}, {
    headers: {
      Authorization: `Bearer ${params.token}`,
    },
  });
  return response.data;
};

/**
 * 取消点赞
 * @param params 取消点赞参数
 * @returns 取消点赞响应
 */
export const unlikePost = async (params: LikePostParams): Promise<LikeResponse> => {
  const response = await apiClient.post<LikeResponse>(`/api/frontend/posts/${params.id}/unlike`, {}, {
    headers: {
      Authorization: `Bearer ${params.token}`,
    },
  });
  return response.data;
};

export default {
  getPosts,
  getHotPosts,
  getPostBySlug,
  likePost,
  unlikePost,
};