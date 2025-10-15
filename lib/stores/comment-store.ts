import { create } from "zustand";
import { api } from "../api";
import { Comment } from "@/types";

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  sortBy: "top" | "new";

  // Actions
  fetchComments: () => Promise<void>;
  setSortBy: (sortBy: "top" | "new") => void;
  createComment: (text: string, parentId: number | null) => Promise<boolean>;
  upvoteComment: (id: number) => Promise<void>;
  deleteComment: (id: number) => Promise<void>;
  updateCommentInList: (id: number, upvotes: number) => void;
  clearComments: () => void;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,
  sortBy: "top",

  fetchComments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getComments(get().sortBy);
      if (response.success) {
        set({
          comments: response.data.comments || [],
          isLoading: false,
        });
      } else {
        set({
          error: response.error || "Failed to fetch comments",
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      set({
        error: "Unable to connect to server",
        isLoading: false,
      });
    }
  },

  setSortBy: (sortBy: "top" | "new") => {
    set({ sortBy });
    get().fetchComments();
  },

  createComment: async (text: string, parentId: number | null) => {
    try {
      const response = await api.createComment({ text, parent_id: parentId });
      if (response.success) {
        if (parentId === null) {
          // Add new top-level comment to the list
          set((state) => ({
            comments: [response.data, ...state.comments],
          }));
        } else {
          // Refresh to show updated reply count
          get().fetchComments();
        }
        return true;
      } else {
        console.error("Failed to create comment:", response.error);
        return false;
      }
    } catch (error) {
      console.error("Failed to create comment:", error);
      return false;
    }
  },

  upvoteComment: async (id: number) => {
    try {
      const response = await api.upvoteComment(id);
      if (response.success) {
        // Update the comment in the list
        get().updateCommentInList(id, response.data.upvotes);
      }
    } catch (error) {
      console.error("Failed to upvote:", error);
    }
  },

  deleteComment: async (id: number) => {
    try {
      const response = await api.deleteComment(id);
      if (response.success) {
        // Remove from list
        set((state) => ({
          comments: state.comments.filter((c) => c.id !== id),
        }));
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  },

  updateCommentInList: (id: number, upvotes: number) => {
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === id ? { ...c, upvotes } : c
      ),
    }));
  },

  clearComments: () => {
    set({ comments: [], error: null });
  },
}));
