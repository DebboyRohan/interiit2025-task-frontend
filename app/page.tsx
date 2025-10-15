"use client";

import { useState } from "react";
import { Navbar } from "@/components/header/Navbar";
import { PostCard } from "@/components/post/post-card";
import { CommentListWrapper } from "@/components/comments/comment-list-wrapper";
import { CommentInput } from "@/components/comments/comment-input";
import { useCommentStore } from "@/lib/stores/comment-store";

export default function HomePage() {
  const [commentCount, setCommentCount] = useState(0);
  const createComment = useCommentStore((state) => state.createComment);

  const handleCommentCreate = async (text: string) => {
    const success = await createComment(text, null);
    if (!success) {
      alert("Failed to post comment. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Post + Comment Input */}
            <div className="space-y-6">
              <PostCard
                image="/robo-tech.avif"
                title="Robotics Innovation at IIT Kharagpur"
                description="IIT Kharagpur's Centre for Excellence in Robotics is pioneering breakthrough research in intelligent autonomous systems. In partnership with TCS, our advanced research center brings together 150+ scientists working on cutting-edge innovations in digital health, agricultural robotics, and AI-powered automation that are transforming industries and improving lives across India."
              />

              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <CommentInput
                  onSubmit={handleCommentCreate}
                  placeholder="Share your thoughts..."
                />
              </div>
            </div>

            {/* Right Column: Comments - Full Height */}
            <div>
              <CommentListWrapper onCommentCountChange={setCommentCount} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
