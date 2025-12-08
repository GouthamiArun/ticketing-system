"use client";

import { useState } from "react";
import {
  X,
  Download,
  File,
  Image as ImageIcon,
  FileText,
  Video,
} from "lucide-react";
import { getFileUrl, getFileName, isImageFile } from "@/lib/utils";

interface FilePreviewProps {
  url: string;
  onClose: () => void;
}

export function FilePreview({ url, onClose }: FilePreviewProps) {
  const fullUrl = getFileUrl(url);
  const filename = getFileName(url);
  const isImage = isImageFile(filename);

  // Debug logging
  console.log("FilePreview - Original URL:", url);
  console.log("FilePreview - Full URL:", fullUrl);
  console.log("FilePreview - Filename:", filename);
  console.log("FilePreview - Is Image:", isImage);

  const getFileIcon = () => {
    if (isImage) return <ImageIcon className="h-8 w-8" />;
    if (filename.endsWith(".pdf")) return <FileText className="h-8 w-8" />;
    if (filename.match(/\.(mp4|webm|ogg)$/i))
      return <Video className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-white rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <div>
              <h3 className="font-semibold text-gray-900">{filename}</h3>
              <p className="text-sm text-gray-500">File Preview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={fullUrl}
              download
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="h-5 w-5 text-gray-700" />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Close"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[80vh] overflow-auto bg-gray-100">
          {isImage ? (
            <img
              src={fullUrl}
              alt={filename}
              className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
              onError={(e) => {
                console.error("Image failed to load:", fullUrl);
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML =
                    '<div class="flex flex-col items-center justify-center py-12 space-y-4"><p class="text-red-600">Failed to load image</p><p class="text-sm text-gray-500">' +
                    fullUrl +
                    "</p></div>";
                }
              }}
            />
          ) : filename.endsWith(".pdf") ? (
            <iframe
              src={fullUrl}
              className="w-full h-[70vh] border-0 rounded-lg"
              title={filename}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <File className="h-16 w-16 text-gray-400" />
              <p className="text-gray-600">
                Preview not available for this file type
              </p>
              <a
                href={fullUrl}
                download
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
