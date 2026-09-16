import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  description?: string;
  onImageSelected: (base64OrUrl: string, fileObj?: File) => void;
  selectedImage?: string | null;
  onClear?: () => void;
  aspectRatio?: 'square' | 'video' | 'auto';
  maxSizeMB?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  description,
  onImageSelected,
  selectedImage,
  onClear,
  aspectRatio = 'auto',
  maxSizeMB = 5
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image size exceeds ${maxSizeMB}MB limit. Please choose a smaller photo.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImageSelected(reader.result, file);
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: 'min-h-[220px]'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-[#17211B]">
          {label}
        </label>
        {selectedImage && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold text-[#15803D] hover:text-[#15803D]/80 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Change Photo
          </button>
        )}
      </div>

      {selectedImage ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-200/80 bg-slate-50 shadow-sm p-2 space-y-2 group">
          <div className="relative w-full h-52 sm:h-60 rounded-xl overflow-hidden bg-slate-900/5">
            <img
              src={selectedImage}
              alt="Uploaded preview"
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
            />
            {/* Always visible top-right controls overlay */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-slate-800 rounded-xl text-xs font-bold shadow-md hover:bg-white transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#15803D]" />
                Change
              </button>
              {onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  className="p-1.5 bg-rose-600/90 backdrop-blur-md text-white rounded-xl text-xs font-bold shadow-md hover:bg-rose-700 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 text-center ${aspectClasses[aspectRatio]} ${
            isDragging
              ? 'border-[#15803D] bg-[#DCFCE7]/40 scale-[0.99]'
              : 'border-slate-300 hover:border-[#15803D]/60 bg-[#F7FAF7]/60 hover:bg-[#F7FAF7]'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] flex items-center justify-center text-[#15803D] mb-3 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>

          <p className="text-sm font-bold text-[#17211B] flex items-center gap-1">
            <span className="text-[#15803D]">Upload photo</span> or drag & drop
          </p>

          <p className="text-xs text-[#647067] mt-1">
            {description || 'PNG, JPG or WEBP up to 5MB'}
          </p>

          <button
            type="button"
            className="mt-4 px-4 py-2 bg-white text-slate-800 rounded-xl text-xs font-bold border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4 text-[#15803D]" />
            Choose Image
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-rose-600 flex items-center gap-1.5 mt-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
