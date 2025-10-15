"use client";

import { create } from "zustand";

interface DrawerItem {
  id: string;
  commentId: number;
}

interface DrawerStackState {
  stack: DrawerItem[];
  pushDrawer: (commentId: number) => void;
  popDrawer: () => void;
  clearStack: () => void;
}

export const useDrawerStack = create<DrawerStackState>((set) => ({
  stack: [],

  pushDrawer: (commentId: number) => {
    const id = `drawer-${Date.now()}-${commentId}`;
    set((state) => ({
      stack: [...state.stack, { id, commentId }],
    }));
  },

  popDrawer: () => {
    set((state) => ({
      stack: state.stack.slice(0, -1),
    }));
  },

  clearStack: () => {
    set({ stack: [] });
  },
}));
