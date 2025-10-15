import { useAuthStore } from "./stores/auth-store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

class ApiClient {
  private getHeaders() {
    const token = useAuthStore.getState().token;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async register(data: { name: string; email: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async getCurrentUser() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });
    return res.json();
  }

  async getComments(sortBy: "top" | "new" = "top") {
    const res = await fetch(`${API_BASE_URL}/comments/?sortBy=${sortBy}`, {
      headers: this.getHeaders(),
      cache: "no-store",
    });
    return res.json();
  }

  async getComment(id: number) {
    const res = await fetch(`${API_BASE_URL}/comments/${id}`, {
      headers: this.getHeaders(),
      cache: "no-store",
    });
    return res.json();
  }

  async createComment(data: { text: string; parent_id: number | null }) {
    const res = await fetch(`${API_BASE_URL}/comments/create`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async upvoteComment(id: number) {
    const res = await fetch(`${API_BASE_URL}/comments/${id}/upvote`, {
      method: "POST",
      headers: this.getHeaders(),
    });
    return res.json();
  }

  async deleteComment(id: number) {
    const res = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return res.json();
  }
}

export const api = new ApiClient();
