export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "USER" | "ADMIN";
  created_at: string;
}

export interface Comment {
  id: number;
  text: string;
  upvotes: number;
  created_at: string;
  parent_id: number | null;
  user_id: string;
  user: User;
  replies?: Comment[];
  _count?: {
    replies: number;
  };
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}
