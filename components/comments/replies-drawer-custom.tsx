"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CommentCard } from "./comment-card";
import { X, ChevronLeft, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Comment } from "@/types";

interface RepliesDrawerCustomProps {
  commentId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
  currentUser: any;
  onReply: (parentId: number, text: string) => void;
  onUpvote: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function RepliesDrawerCustom({
  commentId,
  isOpen,
  onClose,
  onBack,
  canGoBack = false,
  currentUser,
  onReply,
  onUpvote,
  onDelete,
}: RepliesDrawerCustomProps) {
  const [data, setData] = useState<Comment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchData = () => {
    if (commentId) {
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
  };

  useEffect(() => {
    if (isOpen && commentId) {
      fetchData();
    }
  }, [isOpen, commentId]);

  // Optimistic upvote handler
  const handleUpvote = async (id: number) => {
    // Optimistic update
    if (data) {
      setData({
        ...data,
        upvotes: id === data.id ? data.upvotes + 1 : data.upvotes,
        replies: data.replies?.map((reply) =>
          reply.id === id ? { ...reply, upvotes: reply.upvotes + 1 } : reply
        ),
      });
    }

    // Actual API call
    try {
      await onUpvote(id);
      // Refetch to get accurate data
      fetchData();
    } catch (error) {
      console.error("Upvote failed:", error);
      // Revert on error
      fetchData();
    }
  };

  // Handle reply with refetch
  const handleReply = async (parentId: number, text: string) => {
    await onReply(parentId, text);
    // Refetch to show new reply
    fetchData();
  };

  // Handle delete with refetch
  const handleDelete = async (id: number) => {
    if (onDelete) {
      await onDelete(id);
      // Refetch to update list
      fetchData();
    }
  };

  if (!isOpen || !commentId) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-[100]"
        style={{
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={`
          fixed bg-white shadow-2xl z-[101]
          ${
            isMobile
              ? "bottom-0 left-0 right-0 rounded-t-2xl"
              : "top-0 right-0 w-full sm:w-[500px] lg:w-[600px] h-full"
          }
        `}
        style={{
          animation: isMobile
            ? "slideUpMobile 0.3s ease-out"
            : "slideInRight 0.3s ease-out",
          maxHeight: isMobile ? "85vh" : "100vh",
        }}
      >
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-2">
            {canGoBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-gray-100 h-8 w-8"
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
            className="hover:bg-gray-100 h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto bg-gray-50/30"
          style={{
            height: isMobile ? "calc(85vh - 60px)" : "calc(100vh - 60px)",
          }}
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
                onClick={fetchData}
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
                  onReply={handleReply}
                  onUpvote={handleUpvote}
                  onDelete={handleDelete}
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
                  {data.replies.map((reply) => (
                    <CommentCard
                      key={reply.id}
                      comment={reply}
                      currentUser={currentUser}
                      onReply={handleReply}
                      onUpvote={handleUpvote}
                      onDelete={handleDelete}
                    />
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

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideUpMobile {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
