import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  fallbackText?: string;
  fallbackCategory?: string;
  className?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  fallbackText,
  fallbackCategory,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-emerald-900 via-slate-800 to-teal-950 flex flex-col items-center justify-center p-4 text-center text-white relative overflow-hidden ${className}`}
      >
        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 border border-white/20 shadow-md">
          <ImageIcon className="w-6 h-6 text-emerald-300" />
        </div>
        <span className="font-extrabold text-xs text-white tracking-tight line-clamp-1 max-w-full px-2">
          {fallbackText || alt}
        </span>
        {fallbackCategory && (
          <span className="mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
            {fallbackCategory}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-slate-400 animate-bounce" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
