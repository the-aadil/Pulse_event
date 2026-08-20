"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { compressProfileImage } from "@/lib/image-compressor";
import { CameraIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface ProfileAvatarProps {
  userId: string;
  name: string;
  updatedAt?: Date | string | number;
  size?: "sm" | "md" | "lg";
  className?: string;
  onUploadSuccess?: (newUrl: string) => void;
}

const sizeClasses = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-20 w-20 text-lg",
};

const dimensionMap = {
  sm: 36,
  md: 44,
  lg: 80,
};

export function ProfileAvatar({
  userId,
  name,
  updatedAt,
  size = "md",
  className,
  onUploadSuccess,
}: ProfileAvatarProps) {
  const initialVersion = updatedAt
    ? new Date(updatedAt).getTime()
    : Date.now();

  const [version, setVersion] = useState<number>(initialVersion);
  const [optimisticPreview, setOptimisticPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [hasImageError, setHasImageError] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync version if prop changes
  useEffect(() => {
    if (updatedAt) {
      setVersion(new Date(updatedAt).getTime());
      setHasImageError(false);
    }
  }, [updatedAt]);

  const cleanId = userId.replace(/[^a-zA-Z0-9_-]/g, "");
  const serverImageUrl = `/uploads/profiles/admin-${cleanId}.webp?v=${version}`;
  const currentSrc = optimisticPreview || serverImageUrl;

  const getInitials = (n: string) => {
    if (!n) return "A";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const handleAvatarClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Basic client check
      if (file.size > 10 * 1024 * 1024) {
        setFeedback({ text: "Please select an image smaller than 10MB.", isError: true });
        return;
      }

      setFeedback(null);
      setIsUploading(true);

      // 1. Optimistic preview
      const previewUrl = URL.createObjectURL(file);
      setOptimisticPreview(previewUrl);
      setHasImageError(false);

      try {
        // 2. Client-side Canvas compression to 400x400 WebP (keeps main thread fast)
        const compressedBlob = await compressProfileImage(file, 400, 0.85);

        // 3. Prepare FormData
        const formData = new FormData();
        formData.append("file", compressedBlob, `profile-${cleanId}.webp`);

        // 4. Send to API endpoint
        const res = await fetch("/api/admin/profile-image", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || data.status !== "success") {
          throw new Error(data.error || "Failed to upload profile image.");
        }

        // 5. Update cache-busting timestamp
        setVersion(data.version);
        setOptimisticPreview(null);
        setFeedback({ text: "Profile image updated!", isError: false });
        onUploadSuccess?.(data.url);
      } catch (err: unknown) {
        console.error("[ProfileAvatar] Upload failed:", err);
        const msg = err instanceof Error ? err.message : "Failed to upload image.";
        setFeedback({ text: msg, isError: true });
        // Rollback optimistic preview
        setOptimisticPreview(null);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [cleanId, onUploadSuccess]
  );

  const dim = dimensionMap[size];

  return (
    <div className="relative inline-flex flex-col items-center">
      <div
        role="button"
        tabIndex={0}
        onClick={handleAvatarClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleAvatarClick();
          }
        }}
        aria-label="Upload profile image"
        title="Click to upload profile photo"
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-full border-2 border-gold-500/40 bg-gold-950/40 shadow-md transition-all duration-200 hover:border-gold-400 hover:shadow-[0_0_12px_rgba(212,175,55,0.4)] focus:outline-none focus:ring-2 focus:ring-gold-400/80 focus:ring-offset-2 focus:ring-offset-[#08090c]",
          sizeClasses[size],
          isUploading && "pointer-events-none opacity-80",
          className
        )}
      >
        {/* Avatar Image or Fallback */}
        {!hasImageError ? (
          <Image
            src={currentSrc}
            alt={name ? `${name}'s profile` : "Admin profile"}
            width={dim}
            height={dim}
            unoptimized
            onError={() => setHasImageError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold-600/30 via-gold-500/20 to-amber-600/30 font-bold text-gold-300">
            {getInitials(name)}
          </div>
        )}

        {/* Hover overlay with camera icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#08090c]/70 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
          <CameraIcon className="h-4 w-4 text-gold-300" />
        </div>

        {/* Loading Spinner */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#08090c]/80 backdrop-blur-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold-400/30 border-t-gold-400" />
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/webp,image/jpeg,image/png"
          onChange={handleFileChange}
          className="sr-only"
          aria-hidden="true"
          disabled={isUploading}
        />
      </div>

      {/* Ephemeral Feedback Toast */}
      {feedback && (
        <div
          role="status"
          className={cn(
            "absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold shadow-lg transition-all",
            feedback.isError
              ? "border border-red-500/30 bg-red-950/90 text-red-300"
              : "border border-emerald-500/30 bg-emerald-950/90 text-emerald-300"
          )}
        >
          {feedback.text}
        </div>
      )}
    </div>
  );
}
