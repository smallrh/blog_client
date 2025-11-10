// 用户模型类型定义

export interface User {
    id: string;
    username: string;
    email: string;
    display_name: string;
    avatar: string | null;
    role: string;
    status: number;
    created_at: string;
    updated_at: string;
}
