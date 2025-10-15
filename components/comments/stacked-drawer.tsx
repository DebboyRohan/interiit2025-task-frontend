"use client";

import { useEffect, useState } from "react";
import { useDrawerStack } from "@/lib/hook/use-drawer-stack";
import { useMediaQuery } from "@/lib/hook/use-media-query";
import { api } from "@/lib/api";
import { CommentCard } from "./comment-card";
import { X, ChevronLeft, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Comment } from "@/types";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

  const currentDrawer = stack[stack.length - 1];

  if (!currentDrawer) return null;

  return (
    <DrawerLevel
      key={currentDrawer.id}
      commentId={currentDrawer.commentId}
      isOpen={true}
      isMobile={isMobile}
      currentUser={currentUser}
      onReply={onReply}
      onUpvote={onUpvote}
      onDelete={onDelete}
      onClose={clearStack}
      onBack={popDrawer}
      canGoBack={stack.length > 1}
    />
  );
}

interface DrawerLevelProps {
  commentId: number;
  isOpen: boolean;
  isMobile: boolean;
  currentUser: any;
  onReply: (parentId: number, text: string) => void;
  onUpvote: (id: number) => void;
  onDelete?: (id: number) => void;
  onClose: () => void;
  onBack: () => void;
  canGoBack: boolean;
}

function DrawerLevel({
  commentId,
  isOpen,
  isMobile,
  currentUser,
  onReply,
  onUpvote,
  onDelete,
  onClose,
  onBack,
  canGoBack,
}: DrawerLevelProps) {
  const [data, setData] = useState<Comment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && commentId) {
      setIsLoading(true);
      setError(null);
      api
        .getComment(commentId)
        .then((response) => {
          if (response.success) {
            setData(response.data);
          } else {
            setError("Failed to load replies");
          }
        })
        .catch((err) => {
          console.error("Error loading replies:", err);
          setError("Unable to load replies");
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, commentId]);

  useEffect(() => {
    // Prevent body scroll when drawer is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - Clean, not blurred */}
      <div
        className="fixed inset-0 bg-black/40 z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer - Mobile: Bottom, Desktop: Right side of comment section */}
      <div
        className={`
          fixed z-[101] bg-white shadow-2xl
          ${
            isMobile
              ? "bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl animate-in slide-in-from-bottom duration-300"
              : "top-0 right-0 h-full w-full sm:w-[500px] lg:w-[600px] animate-in slide-in-from-right duration-300"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {canGoBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-gray-100 -ml-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-50 rounded-lg">
                <MessageSquare className="h-4 w-4 text-orange-600" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Replies {data?.replies && `(${data.replies.length})`}
              </h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100 -mr-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Handle */}
        {isMobile && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Content */}
        <div
          className={`
            overflow-y-auto bg-gray-50/30
            ${isMobile ? "max-h-[calc(90vh-65px)]" : "h-[calc(100vh-65px)]"}
          `}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-orange-50 rounded-full mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              </div>
              <p className="text-sm text-gray-500">Loading replies...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="p-6 bg-red-50 rounded-2xl mb-6">
                <X className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to load replies
              </h3>
              <p className="text-sm text-gray-500 mb-4">{error}</p>
              <Button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  api
                    .getComment(commentId)
                    .then((response) => {
                      if (response.success) setData(response.data);
                    })
                    .finally(() => setIsLoading(false));
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Try Again
              </Button>
            </div>
          ) : data ? (
            <>
              {/* Parent Comment */}
              <div className="p-4 bg-white border-b-4 border-orange-100">
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-semibold uppercase tracking-wide">
                    <MessageSquare className="h-3 w-3" />
                    Original Comment
                  </span>
                </div>
                <CommentCard
                  comment={data}
                  currentUser={currentUser}
                  onReply={onReply}
                  onUpvote={onUpvote}
                  onDelete={onDelete}
                />
              </div>

              {/* Replies Section */}
              {data.replies && data.replies.length > 0 ? (
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px bg-gray-300 flex-1" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1 bg-white rounded-full shadow-sm">
                      {data.replies.length}{" "}
                      {data.replies.length === 1 ? "Reply" : "Replies"}
                    </span>
                    <div className="h-px bg-gray-300 flex-1" />
                  </div>
                  {data.replies.map((reply, index) => (
                    <div
                      key={reply.id}
                      className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CommentCard
                        comment={reply}
                        currentUser={currentUser}
                        onReply={onReply}
                        onUpvote={onUpvote}
                        onDelete={onDelete}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="p-8 bg-gray-100 rounded-2xl mb-6">
                    <MessageSquare className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No replies yet
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Be the first to reply to this comment!
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
