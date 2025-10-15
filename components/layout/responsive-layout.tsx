"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/lib/hook/use-media-query";
import { CommentInput } from "../comments/comment-input";

interface ResponsiveLayoutProps {
  postContent: React.ReactNode;
  commentsContent: React.ReactNode;
  onCommentCreate: (text: string) => void;
  commentCount?: number;
}

export function ResponsiveLayout({
  postContent,
  commentsContent,
  onCommentCreate,
  commentCount = 0,
}: ResponsiveLayoutProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");

  if (isMobile) {
    return (
      <>
        {/* Mobile Layout */}
        <div className="min-h-screen bg-gray-50 pb-6">
          <div className="container mx-auto p-4 space-y-4">
            {/* Post Card */}
            {postContent}

            {/* Comment Input + Button attached to post */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <CommentInput
                onSubmit={onCommentCreate}
                placeholder="Share your thoughts..."
              />

              <Button
                onClick={() => setIsCommentsOpen(true)}
                className="w-full mt-3 bg-orange-600 hover:bg-orange-700 gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                View All Comments ({commentCount})
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Comments Bottom Sheet */}
        {isCommentsOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/30 z-[100]"
              onClick={() => setIsCommentsOpen(false)}
            />

            {/* Bottom Sheet */}
            <div
              className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-2xl shadow-2xl"
              style={{
                maxHeight: "85vh",
                animation: "slideUpMobile 0.3s ease-out",
              }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Comments Content - White Background */}
              <div className="h-[calc(85vh-20px)] overflow-y-auto bg-white">
                {commentsContent}
              </div>
            </div>

            <style jsx>{`
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
        )}
      </>
    );
  }

  // Desktop Layout - Completely removed height restrictions
  return (
    <div className="bg-gray-50 pb-12">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Post + Comment Input */}
          <div className="space-y-6">
            {postContent}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <CommentInput
                onSubmit={onCommentCreate}
                placeholder="Share your thoughts..."
              />
            </div>
          </div>

          {/* Right: Comments - No restrictions */}
          <div>{commentsContent}</div>
        </div>
      </div>
    </div>
  );
}
