import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { safeDataAccess } from '../lib/sanity';
import { FaInstagram, FaFacebook, FaTiktok, FaSpotify, FaApple, FaYoutube } from 'react-icons/fa';
import { PortableText } from '@portabletext/react';
import MobileNav from '../components/MobileNav';
import ErrorBoundary from '../components/ErrorBoundary';
import OptimizedImage from '../components/OptimizedImage';
import GalleryModal from '../components/GalleryModal';
import Footer from '../components/Footer';
import { PageSkeleton } from '../components/LoadingSkeleton';
import '../styles/About.css';

function About() {
  const { siteSettings, loading, error } = useData();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY < 50) {
            // Near top - always show
            setShowHeader(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down past threshold - hide
            setShowHeader(false);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up - show
            setShowHeader(true);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle hover state
  const handleMouseEnter = () => {
    setIsHovering(true);
    setShowHeader(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Only hide if not near top and not scrolling up
    if (window.scrollY > 100) {
      setShowHeader(false);
    }
  };

  const handleEPKDownload = () => {
    if (siteSettings?.epkFile?.asset?._ref) {
      // Construct the proper Sanity file URL
      const fileUrl = urlFor(siteSettings.epkFile).url();
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = siteSettings.epkFile.originalFilename || 'Will_Kaye_EPK.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Gallery modal handlers
  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setGalleryModalOpen(true);
  };

  const handleCloseModal = () => {
    setGalleryModalOpen(false);
  };

  const handleNextImage = () => {
    const galleryImages = siteSettings?.galleryImages || [];
    setCurrentImageIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousImage = () => {
    const galleryImages = siteSettings?.galleryImages || [];
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="about-container">
        <h1 className="about-title">About Will Kaye</h1>
        <div className="about-content">
          <p className="about-text">
            Welcome to the story behind the music. Will Kaye's journey through the world of sound and storytelling.
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/releases', label: 'Music' },
    { path: '/shows', label: 'Shows' },
    { path: '/contact', label: 'Contact' },
  ];

  const socialLinks = [
    { name: 'Instagram', url: '#', icon: FaInstagram },
    { name: 'Facebook', url: '#', icon: FaFacebook },
    { name: 'TikTok', url: '#', icon: FaTiktok },
    { name: 'Spotify', url: '#', icon: FaSpotify },
    { name: 'Apple Music', url: '#', icon: FaApple },
    { name: 'YouTube', url: '#', icon: FaYoutube },
  ];

  const backgroundImageUrl = safeDataAccess.getImageUrl(siteSettings?.backgroundImage, 1920);

  return (
    <ErrorBoundary>
      <div 
        className="about-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      {/* Background image with transparency overlay */}
      {backgroundImageUrl && (
        <div 
          className="background-image-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.25, // More visible background - 25% visible
            zIndex: 1
          }}
        />
      )}
      
      {/* Dark overlay to ensure content readability */}
      <div 
        className="content-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(36, 60, 79, 0.70)', // More transparent navy overlay
          zIndex: 2
        }}
      />
      
      {/* Mobile Navigation */}
      <MobileNav 
        currentPath="/about"
        navItems={navItems}
        socialLinks={socialLinks}
      />

      {/* Top Navigation Bar */}
      <div className={`top-navbar ${showHeader ? 'visible' : 'hidden'}`}>
        <div className="nav-section">
          <div className="nav-list">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-item ${item.path === '/about' ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="title-section">
          <img src="/willkayelogo.png" alt="Will Kaye" className="header-logo" />
        </div>
        
        <div className="connect-section">
          <div className="social-list">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a 
                  key={social.name} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-item"
                  title={social.name}
                >
                  <IconComponent size={36} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <h1 className="about-title" style={{ zIndex: 10 }}>About Will Kaye</h1>
      
      <div className="divider-bar" style={{ zIndex: 10 }}></div>
      
      <div className="about-content" style={{ zIndex: 10 }}>
        {siteSettings?.longBio && Array.isArray(siteSettings.longBio) && siteSettings.longBio.length > 0 ? (
          <div className="about-text">
            <PortableText value={siteSettings.longBio} />
          </div>
        ) : (
          <p className="about-text">
            Welcome to the story behind the music. Will Kaye's journey through the world of sound and storytelling.
            From humble beginnings to creating music that touches the soul, Will has dedicated his life to the craft 
            of storytelling through song. With roots deeply planted in Americana traditions, his music weaves together 
            the threads of folk, country, and rock into a tapestry that speaks to the heart of the American experience.
          </p>
        )}
      </div>

      {/* Gallery Section */}
      {safeDataAccess.getArray(siteSettings?.gallery).length > 0 && (
        <div className="gallery-section" style={{ zIndex: 10 }}>
          <h2 className="gallery-title">Gallery</h2>
          <div className="gallery-grid">
            {safeDataAccess.getArray(siteSettings?.gallery).map((image, index) => {
              const imageUrl = safeDataAccess.getImageUrl(image, 600);
              return imageUrl ? (
                <div 
                  key={index} 
                  className="gallery-item"
                  onClick={() => handleImageClick(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <OptimizedImage 
                    src={imageUrl} 
                    alt={`Gallery image ${index + 1}`}
                    className="gallery-image"
                    width="100%"
                    height="300px"
                  />
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* EPK Download Section - Standalone if no gallery */}
      {safeDataAccess.getArray(siteSettings?.gallery).length === 0 && siteSettings?.epkFile?.url && (
        <div className="epk-section" style={{ zIndex: 10 }}>
          <h2 className="epk-title">Electronic Press Kit</h2>
          <button 
            className="epk-button"
            onClick={handleEPKDownload}
          >
            Download EPK
          </button>
        </div>
      )}

      {/* Horizontal bar between gallery and EPK button */}
      <div className="divider-bar" style={{ zIndex: 10 }}></div>

      {/* EPK Button - Positioned halfway between gallery and bottom */}
      <div className="epk-section-spacer" style={{ zIndex: 10 }}>
        <button 
          className="epk-button"
          onClick={handleEPKDownload}
        >
          Download EPK
        </button>
      </div>

      {/* Gallery Modal */}
      {galleryModalOpen && (
        <GalleryModal
          images={safeDataAccess.getArray(siteSettings?.gallery)}
          currentIndex={currentImageIndex}
          onClose={handleCloseModal}
          onNext={handleNextImage}
          onPrevious={handlePreviousImage}
        />
      )}

      <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default About;