import { useState } from "react";
import api from "../lib/api";

export const useUpload = () => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file, type = "restaurant") => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post(`/uploads/image?type=${type}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        },
      });
      return response.data; // { url, publicId }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (publicId) => {
    if (!publicId) return;
    try {
      await api.delete(`/uploads/image/${encodeURIComponent(publicId)}`);
    } catch (err) {
      console.warn("Could not delete previous image:", err.message);
    }
  };

  return {
    uploadImage,
    deleteImage,
    progress,
    isUploading,
    error,
  };
};
