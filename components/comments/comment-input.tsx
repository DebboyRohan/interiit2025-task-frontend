"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";

interface CommentInputProps {
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentInput({
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  autoFocus = false,
}: CommentInputProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(text.trim());
      setText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`
          relative rounded-lg border transition-all duration-200 bg-white
          ${
            isFocused
              ? "border-orange-300 ring-2 ring-orange-100 shadow-sm"
              : "border-gray-200 hover:border-gray-300"
          }
        `}
      >
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="min-h-[100px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        />

        {/* Character counter */}
        {text.length > 0 && (
          <div className="absolute bottom-2 left-3 text-xs text-gray-400">
            {text.length} characters
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        {/* Hint */}
        <div className="text-xs text-gray-500 hidden sm:block">
          {isFocused && "Press Cmd/Ctrl + Enter to post"}
        </div>

        {/* Actions */}
        <div className="flex gap-2 ml-auto">
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!text.trim() || isSubmitting}
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm gap-2 min-w-[80px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Post
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
