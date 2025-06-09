import React, { useState, useRef, useEffect, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  style,
  width,
  height,
  quality = 75,
  priority = false,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  // Generate optimized image URL with compression
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    if (originalSrc.includes('pexels.com')) {
      // Add Pexels optimization parameters
      const url = new URL(originalSrc);
      if (width) url.searchParams.set('w', width.toString());
      if (height) url.searchParams.set('h', height.toString());
      url.searchParams.set('auto', 'compress');
      url.searchParams.set('cs', 'tinysrgb');
      url.searchParams.set('dpr', '1');
      return url.toString();
    }
    return originalSrc;
  }, [width, height]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1,
      }
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  const optimizedSrc = getOptimizedSrc(src);

  return (
    <div 
      ref={placeholderRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shiny-text"
          style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Failed to load image</span>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          // Add responsive image attributes
          sizes={width ? `${width}px` : '100vw'}
        />
      )}
    </div>
  );
};

export { OptimizedImage };