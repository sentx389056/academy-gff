"use client";

import { useState, useRef, DragEvent } from "react";

export type UploadResult = {
  url: string;
  name: string;
  type: string;
  size: number;
  isVideo: boolean;
};

interface Props {
  accept: "image" | "video" | "both";
  onUploaded: (result: UploadResult) => void;
  currentUrl?: string;
  compact?: boolean;
}

const ACCEPT_MAP = {
  image: "image/jpeg,image/png,image/gif,image/webp,image/svg+xml",
  video: "video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo",
  both: "image/*,video/*",
};

const ACCEPT_HINT = {
  image: "JPG, PNG, GIF, WEBP, SVG — до 10 МБ",
  video: "MP4, WEBM, OGG, MOV, AVI — до 200 МБ",
  both: "Изображения до 10 МБ, видео до 200 МБ",
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

export default function FileUploader({ accept, onUploaded, currentUrl, compact = false }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState<UploadResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setError("");
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Use XMLHttpRequest to track progress
      const result = await new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.error || "Ошибка загрузки"));
            } catch {
              reject(new Error("Ошибка загрузки"));
            }
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Ошибка сети")));
        xhr.open("POST", "/api/upload");
        xhr.send(formData);
      });

      setUploaded(result);
      onUploaded(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    upload(files[0]);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  // Compact mode — just a button with filename
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {uploading ? `${progress}%` : "Загрузить файл"}
        </button>
        {(uploaded || currentUrl) && (
          <span className="text-xs text-green-600 truncate max-w-[200px]">
            ✓ {uploaded?.name || "Файл загружен"}
          </span>
        )}
        {error && <span className="text-xs text-red-500">{error}</span>}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_MAP[accept]}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  }

  // Full drop-zone mode
  return (
    <div className="space-y-2">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${dragging ? "border-red-800 bg-red-800/5" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"}
          ${uploading ? "pointer-events-none" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_MAP[accept]}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">Загрузка... {progress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-800 h-2 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : uploaded ? (
          <div className="space-y-2">
            {uploaded.isVideo ? (
              <video src={uploaded.url} className="max-h-32 mx-auto rounded-lg" controls />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={uploaded.url} alt="preview" className="max-h-32 mx-auto rounded-lg object-contain" />
            )}
            <p className="text-xs text-green-600 font-medium">✓ {uploaded.name}</p>
            <p className="text-xs text-gray-400">{formatSize(uploaded.size)}</p>
            <button
              type="button"
              className="text-xs text-red-800 hover:underline"
              onClick={(e) => { e.stopPropagation(); setUploaded(null); inputRef.current?.click(); }}
            >
              Заменить
            </button>
          </div>
        ) : currentUrl ? (
          <div className="space-y-2">
            {accept === "video" ? (
              <video src={currentUrl} className="max-h-32 mx-auto rounded-lg" controls />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentUrl} alt="preview" className="max-h-32 mx-auto rounded-lg object-contain" />
            )}
            <p className="text-xs text-gray-400">Нажмите чтобы заменить</p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg className="w-10 h-10 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-sm text-gray-500">
              Перетащите файл или <span className="text-red-800 font-medium">нажмите для выбора</span>
            </p>
            <p className="text-xs text-gray-400">{ACCEPT_HINT[accept]}</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
