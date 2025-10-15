"use client";

import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CommentCard } from "./comment-card";
import { DrawerStackContainer } from "./drawer-stack-container";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCommentStore } from "@/lib/stores/comment-store";
import {
  Loader2,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  Clock,
} from "lucide-react";

interface CommentListWrapperProps {
  onCommentCountChange?: (count: number) => void;
}

export function CommentListWrapper({
  onCommentCountChange,
}: CommentListWrapperProps) {
  const user = useAuthStore((state) => state.user);
  const comments = useCommentStore((state) => state.comments);
  const isLoading = useCommentStore((state) => state.isLoading);
  const error = useCommentStore((state) => state.error);
  const sortBy = useCommentStore((state) => state.sortBy);

  const fetchComments = useCommentStore((state) => state.fetchComments);
  const setSortBy = useCommentStore((state) => state.setSortBy);
  const createComment = useCommentStore((state) => state.createComment);
  const upvoteComment = useCommentStore((state) => state.upvoteComment);
  const deleteComment = useCommentStore((state) => state.deleteComment);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    if (onCommentCountChange) {
      onCommentCountChange(comments.length);
    }
  }, [comments.length, onCommentCountChange]);

  const handleReply = async (parentId: number, text: string) => {
    const success = await createComment(text, parentId);
    if (!success) {
      alert("Failed to reply");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    await deleteComment(id);
  };

  return (
    <>
      {/* NO outer container with height restrictions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header - NOT sticky */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Comments</h2>
              {comments.length > 0 && (
                <p className="text-sm text-gray-500">
                  {comments.length}{" "}
                  {comments.length === 1 ? "comment" : "comments"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tabs
              value={sortBy}
              onValueChange={(v) => setSortBy(v as "top" | "new")}
            >
              <TabsList className="bg-white border border-gray-200 shadow-sm">
                <TabsTrigger
                  value="top"
                  className="gap-1.5 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Top</span>
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className="gap-1.5 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600"
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">New</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              variant="ghost"
              size="icon"
              onClick={fetchComments}
              disabled={isLoading}
              className="hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {error && (
          <div className="m-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <div className="p-1 bg-red-100 rounded-full">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchComments}
              className="text-red-600 hover:bg-red-100"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Comments - NO max-height, NO overflow, NO flex constraints */}
        <div className="p-4 sm:p-5 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-orange-50 rounded-full mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              </div>
              <p className="text-sm text-gray-500">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="p-8 bg-gray-100 rounded-2xl mb-6">
                <MessageSquare className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No comments yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Be the first to share your thoughts and start a conversation!
              </p>
            </div>
          ) : (
            comments.map((comment, index) => (
              <div
                key={comment.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CommentCard
                  comment={comment}
                  currentUser={user}
                  onReply={handleReply}
                  onUpvote={upvoteComment}
                  onDelete={user ? handleDelete : undefined}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <DrawerStackContainer
        currentUser={user}
        onReply={handleReply}
        onUpvote={upvoteComment}
        onDelete={user ? handleDelete : undefined}
      />
    </>
  );
}
