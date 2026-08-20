/**
 * Native Canvas-based client-side image compression and square crop.
 * Resizes the image to 400x400 WebP before upload to ensure 60fps UI
 * and minimal payload size with zero external bundle bloat.
 */
export async function compressProfileImage(
  file: File,
  targetDimension = 400,
  quality = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Failed to read image file."));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error("Failed to decode image."));
      };

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = targetDimension;
          canvas.height = targetDimension;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not acquire 2D canvas context."));
            return;
          }

          // Enable high-quality smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // Calculate center-crop dimensions (cover)
          const srcWidth = img.naturalWidth || img.width;
          const srcHeight = img.naturalHeight || img.height;

          let cropX = 0;
          let cropY = 0;
          let cropWidth = srcWidth;
          let cropHeight = srcHeight;

          if (srcWidth > srcHeight) {
            cropWidth = srcHeight;
            cropX = (srcWidth - srcHeight) / 2;
          } else if (srcHeight > srcWidth) {
            cropHeight = srcWidth;
            cropY = (srcHeight - srcWidth) / 2;
          }

          // Draw cropped & resized image to canvas
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            targetDimension,
            targetDimension
          );

          // Export as clean WebP Blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                // Fallback to JPEG if browser doesn't support WebP canvas export
                canvas.toBlob(
                  (fallbackBlob) => {
                    if (fallbackBlob) {
                      resolve(fallbackBlob);
                    } else {
                      reject(new Error("Canvas blob conversion failed."));
                    }
                  },
                  "image/jpeg",
                  quality
                );
              }
            },
            "image/webp",
            quality
          );
        } catch (err) {
          reject(err);
        }
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
