"use client";

import { useState } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
}

export default function ImageUpload({ onUpload, currentImage, label = "Загрузить изображение" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Пожалуйста, выберите изображение");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      alert("Размер файла не должен превышать 30MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setPreview(data.url);
        onUpload(data.url);
      } else {
        alert("Ошибка загрузки: " + data.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Ошибка загрузки изображения");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-primary">
        {label}
      </label>
      
      {preview && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex gap-2">
        <label className="flex-1 cursor-pointer">
          <div className="px-4 py-2 bg-primary text-white rounded-lg text-center hover:bg-primary/90 transition-colors">
            {uploading ? "Загрузка..." : preview ? "Изменить" : "Выбрать файл"}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        
        {preview && (
          <button
            type="button"
            onClick={() => {
              setPreview("");
              onUpload("");
            }}
            className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            Удалить
          </button>
        )}
      </div>

      <p className="text-xs text-text-muted">
        Поддерживаются: JPG, PNG, GIF, WebP. Максимум 30MB
      </p>
    </div>
  );
}
