import React, { useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useUpload } from "../../hooks/useUpload";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

export const ImageUploader = ({
  value, // { url: string, publicId: string } or string
  onChange, // ({ url, publicId }) => void
  type = "restaurant", // 'food' | 'restaurant'
  aspect = "aspect-[4/3]",
  className,
}) => {
  const fileInputRef = useRef(null);
  const { uploadImage, deleteImage, isUploading, progress } = useUpload();

  const currentUrl = typeof value === "string" ? value : value?.url;
  const currentPublicId = typeof value === "object" ? value?.publicId : "";

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, or WebP image");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image size must be less than 4 MB");
      return;
    }

    try {
      if (currentPublicId) {
        await deleteImage(currentPublicId);
      }
      const result = await uploadImage(file, type);
      onChange?.(result);
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async (e) => {
    e.stopPropagation();
    if (currentPublicId) {
      await deleteImage(currentPublicId);
    }
    onChange?.({ url: "", publicId: "" });
    toast.info("Image removed");
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {currentUrl ? (
        <div
          className={cn(
            "relative w-full rounded-lg overflow-hidden border border-border group cursor-pointer bg-surface-muted",
            aspect
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={currentUrl}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white">
            <span className="text-xs font-semibold px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-md hover:bg-white/30 transition-colors">
              Change Image
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-red-600/80 hover:bg-red-600 rounded-md transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isUploading && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-4">
              <Loader2 className="w-6 h-6 animate-spin mb-2 text-primary" />
              <span className="text-xs font-medium">Uploading... {progress}%</span>
              <div className="w-32 bg-white/20 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-primary h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "w-full border-2 border-dashed border-border hover:border-primary/60 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-surface/50 hover:bg-surface-muted/50",
            aspect,
            isUploading && "pointer-events-none opacity-80"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
              <span className="text-sm font-medium text-fg">Uploading... {progress}%</span>
              <div className="w-36 bg-surface-muted h-1.5 rounded-full overflow-hidden mt-2 border border-border">
                <div
                  className="bg-primary h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center text-primary">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-fg">Click to upload photo</p>
                <p className="text-xs text-fg-3 mt-0.5">JPEG, PNG, or WebP (max 4MB)</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
