import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  AlertCircle,
  RefreshCw,
  Camera,
  Video,
  StopCircle,
  FlipHorizontal,
  Sparkles
} from 'lucide-react';

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
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeTab, setActiveTab] = useState<'webcam' | 'upload'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stop video stream when component unmounts or mode changes
  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsWebcamActive(false);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startWebcam = async (mode: 'environment' | 'user' = facingMode) => {
    setError(null);
    stopWebcam();
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setStream(mediaStream);
      setIsWebcamActive(true);
      setActiveTab('webcam');
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error('Webcam access error:', err);
      setError(
        'Unable to access camera. Please allow camera permissions in your browser or switch to "Upload Photo".'
      );
      setIsWebcamActive(false);
      setActiveTab('upload');
    }
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (isWebcamActive) {
      startWebcam(nextMode);
    }
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      stopWebcam();
      onImageSelected(dataUrl);
    }
  };

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
        stopWebcam();
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
    auto: 'min-h-[250px]'
  };

  return (
    <div className="space-y-3.5">
      {/* Top Header & Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <label className="block text-sm font-bold text-[#17211B]">
            {label}
          </label>
          {description && !isWebcamActive && (
            <p className="text-xs text-[#647067] mt-0.5">{description}</p>
          )}
        </div>

        {/* Input Source Mode Switcher */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('webcam');
              if (!isWebcamActive) startWebcam();
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'webcam' || isWebcamActive
                ? 'bg-white text-[#15803D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
            {isWebcamActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              stopWebcam();
              setActiveTab('upload');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'upload' && !isWebcamActive
                ? 'bg-white text-[#15803D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Live Webcam Stream View */}
      {isWebcamActive ? (
        <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/80 bg-slate-950 shadow-lg p-2.5 space-y-3">
          <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              onLoadedMetadata={() => videoRef.current?.play()}
            />

            {/* High-tech Scanning HUD Reticle */}
            <div className="absolute inset-5 border-2 border-dashed border-emerald-400/70 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
              {/* Corner brackets aesthetic */}
              <div className="flex justify-between items-center text-[10px] font-mono text-emerald-300 bg-slate-950/80 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE GEMINI VISION FEED
                </span>
                <span className="text-emerald-400 font-bold">READY TO CAPTURE</span>
              </div>

              {/* Animated laser scanning line */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#22c55e] animate-bounce" />

              <div className="text-center text-[11px] text-emerald-200/90 font-mono bg-slate-950/70 py-1 px-3 rounded-lg self-center backdrop-blur-xs">
                Center the waste object inside the reticle frame
              </div>
            </div>

            {/* Quick Switch Camera Button on top-right of stream */}
            <button
              type="button"
              onClick={toggleCameraFacing}
              className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-900 text-emerald-300 rounded-xl backdrop-blur-md text-xs font-bold border border-emerald-500/30 shadow-md transition-all flex items-center gap-1.5"
              title="Flip camera"
            >
              <FlipHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Flip</span>
            </button>
          </div>

          {/* Camera Controls Bar */}
          <div className="flex items-center gap-2 justify-between px-1">
            <button
              type="button"
              onClick={stopWebcam}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <StopCircle className="w-4 h-4 text-rose-400" />
              <span>Cancel</span>
            </button>

            <button
              type="button"
              onClick={captureFrame}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#15803D] to-emerald-600 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Capture & Analyze Frame</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-200 animate-spin" />
            </button>
          </div>
        </div>
      ) : selectedImage ? (
        /* Image Preview View */
        <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-200/80 bg-slate-50 shadow-sm p-2 space-y-2 group">
          <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900/5">
            <img
              src={selectedImage}
              alt="Uploaded waste preview"
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.01]"
            />

            {/* Visual Action Overlay Buttons */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => startWebcam()}
                className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-emerald-300 rounded-xl text-xs font-bold shadow-md hover:bg-slate-900 transition-all flex items-center gap-1.5 border border-emerald-400/30"
              >
                <Camera className="w-3.5 h-3.5" />
                Live Camera
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-slate-800 rounded-xl text-xs font-bold shadow-md hover:bg-white transition-all flex items-center gap-1.5 border border-slate-200"
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
        /* Upload Photo Drag-and-drop View */
        <div className="space-y-3">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-200 text-center ${aspectClasses[aspectRatio]} ${
              isDragging
                ? 'border-[#15803D] bg-[#DCFCE7]/40 scale-[0.99]'
                : 'border-slate-300 hover:border-[#15803D]/60 bg-[#F7FAF7]/60 hover:bg-[#F7FAF7]'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] flex items-center justify-center text-[#15803D] mb-3 shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>

            <p className="text-sm font-bold text-[#17211B] flex items-center gap-1">
              <span className="text-[#15803D]">Upload waste photo</span> or drag & drop
            </p>

            <p className="text-xs text-[#647067] mt-1">
              {description || 'PNG, JPG or WEBP up to 5MB'}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white text-slate-800 rounded-xl text-xs font-bold border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4 text-[#15803D]" />
                Choose Image File
              </button>

              <button
                type="button"
                onClick={() => startWebcam()}
                className="px-4 py-2 bg-[#15803D] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#15803D]/90 transition-all flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                Open Live Camera
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      <canvas ref={canvasRef} className="hidden" />

      {error && (
        <p className="text-xs text-rose-600 flex items-center gap-1.5 mt-1 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
