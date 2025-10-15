"use client";

import { useDrawerStack } from "@/lib/hook/use-drawer-stack";
import { RepliesDrawerCustom } from "./replies-drawer-custom";

interface DrawerStackContainerProps {
  currentUser: any;
  onReply: (parentId: number, text: string) => void;
  onUpvote: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function DrawerStackContainer({
  currentUser,
  onReply,
  onUpvote,
  onDelete,
}: DrawerStackContainerProps) {
  const stack = useDrawerStack((state) => state.stack);
  const popDrawer = useDrawerStack((state) => state.popDrawer);
  const clearStack = useDrawerStack((state) => state.clearStack);

  const currentDrawer = stack[stack.length - 1];

  return (
    <RepliesDrawerCustom
      commentId={currentDrawer?.commentId || null}
      isOpen={!!currentDrawer}
      onClose={clearStack}
      onBack={popDrawer}
      canGoBack={stack.length > 1}
      currentUser={currentUser}
      onReply={onReply}
      onUpvote={onUpvote}
      onDelete={onDelete}
    />
  );
}
