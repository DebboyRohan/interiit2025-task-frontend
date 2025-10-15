"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommentCard } from "./comment-card";
import { CommentInput } from "./comment-input";
import { DrawerStackContainer } from "./drawer-stack-container";
import { api } from "@/lib/api";
import { Comment } from "@/types";
import {
  Loader2,
  MessageSquare,
  TrendingUp,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function CommentList() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sortBy, setSortBy] = useState<"top" | "new">("top");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [sortBy]);

  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getComments(sortBy);
      if (response.success) {
        setComments(response.data.comments);
        setCurrentUser(response.data.currentUser);
      } else {
        setError("Failed to load comments");
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setError("Unable to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateComment = async (text: string) => {
    try {
      const response = await api.createComment({ text, parent_id: null });
      if (response.success) {
        setComments([response.data, ...comments]);
      }
    } catch (error) {
      console.error("Failed to create comment:", error);
      alert("Failed to post comment. Please try again.");
    }
  };

  const handleReply = async (parentId: number, text: string) => {
    try {
      const response = await api.createComment({ text, parent_id: parentId });
      if (response.success) {
        fetchComments();
      }
    } catch (error) {
      console.error("Failed to reply:", error);
      alert("Failed to post reply. Please try again.");
    }
  };

  const handleUpvote = async (id: number) => {
    try {
      await api.upvoteComment(id);
      fetchComments();
    } catch (error) {
      console.error("Failed to upvote:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await api.deleteComment(id);
      fetchComments();
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 rounded-xl">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Comments
              </h1>
              {comments.length > 0 && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {comments.length}{" "}
                  {comments.length === 1 ? "comment" : "comments"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Tabs */}
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

            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchComments}
              disabled={isLoading}
              className="hover:bg-orange-50 hover:text-orange-600"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
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

        {/* Create Comment */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <CommentInput
            onSubmit={handleCreateComment}
            placeholder="Share your thoughts..."
          />
        </div>

        {/* Comments List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-orange-50 rounded-full mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
            <p className="text-sm text-gray-500">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="p-8 bg-gray-100 rounded-2xl mb-6">
              <MessageSquare className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No comments yet
            </h3>
            <p className="text-sm text-gray-500 max-w-md mb-6">
              Be the first to share your thoughts and start a conversation!
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium">
              <span>👆</span>
              Write a comment above to get started
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment, index) => (
              <div
                key={comment.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CommentCard
                  comment={comment}
                  currentUser={currentUser}
                  onReply={handleReply}
                  onUpvote={handleUpvote}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawer Stack for Nested Replies */}
      <DrawerStackContainer
        currentUser={currentUser}
        onReply={handleReply}
        onUpvote={handleUpvote}
        onDelete={handleDelete}
      />
    </>
  );
}
