import React, { useState, useRef, useEffect } from 'react';
import { ImageSkeleton } from './LoadingSkeleton';

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  style,
  priority = false,
  placeholder = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  if (hasError) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          width: width || '100%',
          height: height || 'auto',
          backgroundColor: 'rgba(76, 68, 60, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FAF9F6',
          fontSize: '1rem',
          fontFamily: 'Unna, serif'
        }}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <div ref={imgRef} style={{ position: 'relative' }}>
      {!isLoaded && placeholder && (
        <ImageSkeleton 
          width={width} 
          height={height} 
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            ...style,
            width: width || '100%',
            height: height || 'auto',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            position: isLoaded ? 'relative' : 'absolute',
            top: isLoaded ? 'auto' : 0,
            left: isLoaded ? 'auto' : 0
          }}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
