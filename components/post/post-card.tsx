"use client";

import Image from "next/image";

interface PostCardProps {
  image: string;
  title: string;
  description: string;
}

export function PostCard({ image, title, description }: PostCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      {/* Image */}
      <div className="relative w-full aspect-video">
        <Image src={image} alt={title} fill className="object-cover" priority />
      </div>

      {/* Text Content */}
      <div className="p-6 space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
