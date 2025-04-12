export interface User {
    id: number;
    email: string;
    password: string;
    avatar_image_name: string;
    role: 'user' | 'admin';
    created_at: Date;
}

export interface Forum {
    id: number;
    title: string;
    topic_count: number;
    created_by: number;
    created_at: Date;
    user: User;
}

export interface Topic {
    id: number;
    forum_id: number;
    user_id: number;
    title: string;
    message_count: number;
    created_at: Date;
    author_email: string;
    author_avatar: string;
    last_message_author: string;
    last_message_date: Date;
}

export interface Message {
    id: number;
    topic_id: number;
    user_id: number;
    author_avatar: string;
    author_email: string;
    content: string;
    created_at: Date;
}
