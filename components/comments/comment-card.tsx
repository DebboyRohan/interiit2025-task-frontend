"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowBigUp, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Comment } from "@/types";
import { CommentInput } from "./comment-input";
import { useDrawerStack } from "@/lib/hook/use-drawer-stack";

interface CommentCardProps {
  comment: Comment;
  currentUser: any;
  onReply: (parentId: number, text: string) => void;
  onUpvote: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function CommentCard({
  comment,
  currentUser,
  onReply,
  onUpvote,
  onDelete,
}: CommentCardProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const pushDrawer = useDrawerStack((state) => state.pushDrawer);

  const hasReplies = comment._count && comment._count.replies > 0;
  const isAdmin = currentUser?.role === "ADMIN";
  const isOwner = currentUser?.id === comment.user_id;
  const canDelete = (isAdmin || isOwner) && onDelete;

  const handleReplySubmit = (text: string) => {
    onReply(comment.id, text);
    setShowReplyInput(false);
  };

  const handleViewReplies = () => {
    pushDrawer(comment.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group border border-gray-100">
      <div className="p-4 sm:p-5 bg-white">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Avatar */}
          <Avatar className="h-10 w-10 sm:h-11 sm:w-11 ring-2 ring-orange-100 transition-all group-hover:ring-orange-200 flex-shrink-0">
            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
            <AvatarFallback className="bg-orange-50 text-orange-600 font-semibold text-sm">
              {comment.user.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-semibold text-gray-900 text-sm sm:text-base">
                {comment.user.name}
              </span>
              {comment.user.role === "ADMIN" && (
                <Badge className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 border-0 font-medium">
                  Admin
                </Badge>
              )}
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {/* Comment Text */}
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
              {comment.text}
            </p>

            {/* Action Row */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1 flex-wrap">
                {/* View Replies */}
                {hasReplies && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewReplies}
                    className="text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors h-8 px-3"
                  >
                    View Replies ({comment._count?.replies})
                  </Button>
                )}

                {/* Reply */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors h-8 px-3"
                >
                  Reply
                </Button>
              </div>

              {/* Right Actions: Upvote + Delete */}
              <div className="flex items-center gap-1">
                {/* Upvote */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpvote(comment.id)}
                  className="gap-1.5 hover:bg-orange-50 hover:text-orange-600 transition-colors h-8 px-2.5"
                >
                  <ArrowBigUp className="h-5 w-5" />
                  <span className="text-sm font-semibold">
                    {comment.upvotes}
                  </span>
                </Button>

                {/* Delete Button - Always visible on mobile, hover on desktop */}
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(comment.id)}
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 shrink-0 h-8 w-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Reply Input */}
            {showReplyInput && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <CommentInput
                  onSubmit={handleReplySubmit}
                  onCancel={() => setShowReplyInput(false)}
                  placeholder="Write a reply..."
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
