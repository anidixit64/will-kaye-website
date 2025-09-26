import React, { useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { urlFor } from '../lib/sanity';
import '../styles/GalleryModal.css';

function GalleryModal({ images, currentIndex, onClose, onNext, onPrevious }) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrevious]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Preload images effect - moved before conditional return
  useEffect(() => {
    if (!images || images.length === 0 || currentIndex < 0 || currentIndex >= images.length) {
      return;
    }

    const preloadImage = (url) => {
      const img = new Image();
      img.src = url;
    };
    
    if (images.length > 1) {
      const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      
      const nextImageUrl = urlFor(images[nextIndex]).width(1200).quality(90).url();
      const prevImageUrl = urlFor(images[prevIndex]).width(1200).quality(90).url();
      
      preloadImage(nextImageUrl);
      preloadImage(prevImageUrl);
    }
  }, [currentIndex, images]);

  // Conditional return after all hooks
  if (!images || images.length === 0 || currentIndex < 0 || currentIndex >= images.length) {
    return null;
  }

  const currentImage = images[currentIndex];
  const imageUrl = urlFor(currentImage).width(1200).quality(90).url();

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="gallery-modal-overlay" onClick={handleBackdropClick}>
      {/* Close button */}
      <button 
        className="gallery-modal-close"
        onClick={onClose}
        aria-label="Close gallery"
      >
        <FaTimes size={24} />
      </button>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button 
            className="gallery-modal-nav gallery-modal-nav-left"
            onClick={onPrevious}
            aria-label="Previous image"
          >
            <FaChevronLeft size={32} />
          </button>
          
          <button 
            className="gallery-modal-nav gallery-modal-nav-right"
            onClick={onNext}
            aria-label="Next image"
          >
            <FaChevronRight size={32} />
          </button>
        </>
      )}

      {/* Image */}
      <img
        src={imageUrl}
        alt={currentImage.alt || `Gallery image ${currentIndex + 1}`}
        className="gallery-modal-image"
      />

      {/* Image counter */}
      {images.length > 1 && (
        <div className="gallery-modal-counter">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

export default GalleryModal;
