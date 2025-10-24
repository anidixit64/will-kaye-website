import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { safeDataAccess } from '../lib/sanity';
import { FaInstagram, FaFacebook, FaTiktok, FaSpotify, FaApple, FaYoutube, FaBandcamp } from 'react-icons/fa';
import MobileNav from '../components/MobileNav';
import ErrorBoundary from '../components/ErrorBoundary';
import OptimizedImage from '../components/OptimizedImage';
import Footer from '../components/Footer';
import { PageSkeleton } from '../components/LoadingSkeleton';
import '../styles/Music.css';

function Releases() {
  const { siteSettings, releases, loading, error } = useData();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY < 50) {
            setShowHeader(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setShowHeader(false);
          } else if (currentScrollY < lastScrollY) {
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

  const handleMouseEnter = () => {
    setIsHovering(true);
    setShowHeader(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (window.scrollY > 100) {
      setShowHeader(false);
    }
  };

  const formatDate = (dateString) => {
    return safeDataAccess.formatDate(dateString, 'TBA');
  };

  const handleLinkClick = (url) => {
    const validUrl = safeDataAccess.getUrl(url);
    if (validUrl) {
      window.open(validUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="music-container">
        <h1 className="music-title">Music Releases</h1>
        <div style={{ fontSize: '1.5rem', color: '#7C898B', textAlign: 'center' }}>
          {error}
        </div>
      </div>
    );
  }

  const backgroundImageUrl = safeDataAccess.getImageUrl(siteSettings?.backgroundImage, 1920);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/releases', label: 'Music' },
    { path: '/shows', label: 'Shows' },
    { path: '/contact', label: 'Contact' },
  ];

  const socialLinks = [
    { name: 'Instagram', url: siteSettings?.instagramUrl || '#', icon: FaInstagram },
    { name: 'Facebook', url: siteSettings?.facebookUrl || '#', icon: FaFacebook },
    { name: 'TikTok', url: siteSettings?.tiktokUrl || '#', icon: FaTiktok },
    { name: 'Spotify', url: siteSettings?.spotifyUrl || '#', icon: FaSpotify },
    { name: 'Apple Music', url: siteSettings?.appleMusicUrl || '#', icon: FaApple },
    { name: 'YouTube', url: siteSettings?.youtubeUrl || '#', icon: FaYoutube },
  ];

  return (
    <ErrorBoundary>
      <div 
        className="music-container"
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
        currentPath="/releases"
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
                className={`nav-item ${item.path === '/releases' ? 'active' : ''}`}
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
      <h1 className="music-title" style={{ zIndex: 10 }}>Music Releases</h1>
      
      <div className="divider-bar" style={{ zIndex: 10 }}></div>

      {/* Releases Section */}
      <div className="releases-section" style={{ zIndex: 10 }}>
        {releases.length > 0 ? (
          releases.map((release) => (
            <div key={release._id} className="release-item">
              {/* Left side - Square album cover */}
              <div className="release-cover">
                {(() => {
                  const imageUrl = safeDataAccess.getImageUrl(release.albumCover, 400);
                  return imageUrl ? (
                    <OptimizedImage 
                      src={imageUrl} 
                      alt={`${safeDataAccess.getText(release.title, 'Release')} album cover`}
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#636564',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#322214',
                      fontSize: '1.2rem',
                      fontFamily: 'Unna, serif'
                    }}>
                      TBA
                    </div>
                  );
                })()}
              </div>
              
              {/* Middle - Album name and release date */}
              <div className="release-info">
                <h2 className="release-title">
                  {safeDataAccess.getText(release.title, 'TBA')}
                </h2>
                <p className="release-date">
                  {formatDate(release.releaseDate)}
                </p>
              </div>
              
              {/* Right side - Vertical column of action buttons */}
              <div className="release-actions">
                {safeDataAccess.getUrl(release.streamLink) && (
                  <button 
                    className="release-action stream"
                    onClick={() => handleLinkClick(release.streamLink)}
                  >
                    <span className="action-icon">
                      <FaBandcamp size={20} />
                    </span>
                    <span className="action-text">Stream</span>
                  </button>
                )}
                
                {safeDataAccess.getUrl(release.buyLink) && (
                  <button 
                    className="release-action buy"
                    onClick={() => handleLinkClick(release.buyLink)}
                  >
                    <span className="action-icon">
                      <FaApple size={20} />
                    </span>
                    <span className="action-text">Buy</span>
                  </button>
                )}
                
                {safeDataAccess.getUrl(release.lyricsLink) && (
                  <button 
                    className="release-action lyrics"
                    onClick={() => handleLinkClick(release.lyricsLink)}
                  >
                    <span className="action-icon">
                      <FaSpotify size={20} />
                    </span>
                    <span className="action-text">Lyrics</span>
                  </button>
                )}
                
                {!safeDataAccess.getUrl(release.streamLink) && !safeDataAccess.getUrl(release.buyLink) && !safeDataAccess.getUrl(release.lyricsLink) && (
                  <div className="no-actions">
                    <span>Links coming soon</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-releases">
            Releases coming soon
          </div>
        )}
      </div>

      <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default Releases;