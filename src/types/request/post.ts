// 文章相关请求参数类型定义

/**
 * 获取文章列表请求参数
 */
export interface GetPostsParams {
  page?: number;
  pageSize?: number;
  category_id?: number | null;
  tag_id?: number | null;
  order?: string;
  sort?: string;
}

/**
 * 获取热门文章请求参数
 */
export interface GetHotPostsParams {
  limit?: number;
}

/**
 * 获取文章详情请求参数
 */
export interface GetPostBySlugParams {
  slug: string;
}

/**
 * 点赞/取消点赞请求参数
 */
export interface LikePostParams {
  id: number;
  token: string;
}