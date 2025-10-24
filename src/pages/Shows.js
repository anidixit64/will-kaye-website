import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { safeDataAccess } from '../lib/sanity';
import { FaInstagram, FaFacebook, FaTiktok, FaSpotify, FaApple, FaYoutube } from 'react-icons/fa';
import MobileNav from '../components/MobileNav';
import ErrorBoundary from '../components/ErrorBoundary';
import OptimizedImage from '../components/OptimizedImage';
import Footer from '../components/Footer';
import { PageSkeleton } from '../components/LoadingSkeleton';
import '../styles/Shows.css';

function Shows() {
  const { siteSettings, shows, loading, error } = useData();
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

  const formatTime = (dateString) => {
    return safeDataAccess.formatTime(dateString, 'TBA');
  };

  const handleTicketClick = (url) => {
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
      <div className="shows-container">
        <h1 className="shows-title">Upcoming Shows</h1>
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
        className="shows-container"
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
        currentPath="/shows"
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
                className={`nav-item ${item.path === '/shows' ? 'active' : ''}`}
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
      <h1 className="shows-title" style={{ zIndex: 10 }}>Upcoming Shows</h1>
      
      <div className="divider-bar" style={{ zIndex: 10 }}></div>

      {/* Shows Section */}
      <div className="shows-section" style={{ zIndex: 10 }}>
        {shows.length > 0 ? (
          shows.map((show) => (
            <div key={show._id} className="show-item">
              {/* Left half - Venue Image (if available) */}
              {show.venueImage && (
                <div className="show-image-section">
                  {(() => {
                    const imageUrl = safeDataAccess.getImageUrl(show.venueImage, 600, 400);
                    return imageUrl ? (
                      <OptimizedImage 
                        src={imageUrl} 
                        alt={show.venueImage.alt || show.venue || 'Venue image'} 
                        className="show-venue-image"
                        width="100%"
                        height="400px"
                      />
                    ) : null;
                  })()}
                </div>
              )}
              
              {/* Right half - Venue Info */}
              <div className={`show-info-section ${!show.venueImage ? 'show-info-full' : ''}`}>
                {/* Ticket Status Banner */}
                {show.ticketStatus && (
                  <div className={`ticket-status-banner ${show.ticketStatus}`}>
                    {show.ticketStatus === 'no-tickets' && 'No Tickets Needed'}
                    {show.ticketStatus === 'tickets-needed' && 'Tickets Needed'}
                    {show.ticketStatus === 'tickets-at-door' && 'Tickets at Door'}
                  </div>
                )}
                
                {/* Top half - Venue name, city, and address */}
                <div className="show-venue-info">
                  <h2 className="show-venue">
                    {safeDataAccess.getText(show.venue, 'TBA')}
                  </h2>
                  {show.city && (
                    <p className="show-city">
                      {safeDataAccess.getText(show.city)}
                    </p>
                  )}
                  {show.address && (
                    <p className="show-address">
                      {safeDataAccess.getText(show.address)}
                    </p>
                  )}
                </div>
                
                {/* Bottom half - Date, time, and ticket button */}
                <div className="show-datetime-section">
                  <div className="show-datetime">
                    <p className="show-date">
                      {formatDate(show.date)}
                    </p>
                    <p className="show-time">
                      {formatTime(show.date)}
                    </p>
                  </div>
                  
                  <div className="show-links">
                    {safeDataAccess.getUrl(show.ticketLink) && (
                      <button 
                        className="show-link tickets"
                        onClick={() => handleTicketClick(show.ticketLink)}
                      >
                        Buy Tickets
                      </button>
                    )}
                    
                    {!safeDataAccess.getUrl(show.ticketLink) && (
                      <span style={{ color: '#93A3B1', fontStyle: 'italic' }}>
                        Tickets coming soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-shows">
            Shows coming soon
          </div>
        )}
      </div>

      <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default Shows;