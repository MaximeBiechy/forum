export interface User {
    id: number;
    email: string;
    password: string;
    role: 'user' | 'admin';
    created_at: Date;
}

export interface Forum {
    id: number;
    title: string;
    created_by: number;
    created_at: Date;
    user: User;
}

export interface Topic {
    id: number;
    forum_id: number;
    user_id: number;
    title: string;
    created_at: Date;
}

export interface Message {
    id: number;
    topic_id: number;
    user_id: number;
    content: string;
    created_at: Date;
}
