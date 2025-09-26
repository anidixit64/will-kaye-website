import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { safeDataAccess } from '../lib/sanity';
import { FaInstagram, FaFacebook, FaTiktok, FaSpotify, FaApple, FaYoutube } from 'react-icons/fa';
import MobileNav from '../components/MobileNav';
import ErrorBoundary from '../components/ErrorBoundary';
import { PageSkeleton } from '../components/LoadingSkeleton';
import '../styles/Home.css';

function Contact() {
  const { siteSettings, loading, error } = useData();
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

  const handleEmailClick = (email) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div 
        className="contact-container"
        style={{
          minHeight: '100vh',
          backgroundColor: 'rgba(36, 60, 79, 0.85)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '200px 2rem 2rem'
        }}
      >
        <h1 className="contact-title">Contact</h1>
        <div className="bio-section">
          <p className="bio-text">
            Failed to load contact information.
          </p>
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
    { name: 'Instagram', url: '#', icon: FaInstagram },
    { name: 'Facebook', url: '#', icon: FaFacebook },
    { name: 'TikTok', url: '#', icon: FaTiktok },
    { name: 'Spotify', url: '#', icon: FaSpotify },
    { name: 'Apple Music', url: '#', icon: FaApple },
    { name: 'YouTube', url: '#', icon: FaYoutube },
  ];

  return (
    <ErrorBoundary>
      <div 
        className="contact-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          minHeight: '100vh',
          backgroundColor: 'rgba(36, 60, 79, 0.85)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '200px 2rem 2rem'
        }}
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
          backgroundColor: 'rgba(36, 60, 79, 0.90)', // Less transparent navy overlay
          zIndex: 2
        }}
      />
      
      {/* Mobile Navigation */}
      <MobileNav 
        currentPath="/contact"
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
                className={`nav-item ${item.path === '/contact' ? 'active' : ''}`}
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
      <h1 className="contact-title" style={{ zIndex: 10 }}>Contact</h1>
      
      <div className="bio-section" style={{ zIndex: 10 }}>
        <p className="bio-text">
          Get in touch for bookings, press inquiries, or just to say hello.
        </p>
      </div>

      <div className="divider-bar" style={{ zIndex: 10 }}></div>

      {/* Contact Information */}
      <div className="mailing-list-section" style={{ zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ 
            color: '#7C898B', 
            fontSize: '2rem', 
            marginBottom: '1rem',
            fontFamily: 'Unna, serif'
          }}>
            General Contact
          </h2>
          <p style={{ 
            color: '#93A3B1', 
            fontSize: '1.2rem', 
            marginBottom: '1rem',
            fontFamily: 'Unna, serif'
          }}>
            {safeDataAccess.getText(siteSettings?.contactEmail, 'Contact email coming soon')}
          </p>
          {safeDataAccess.getText(siteSettings?.contactEmail) && (
            <button 
              className="submit-button"
              onClick={() => handleEmailClick(siteSettings.contactEmail)}
              style={{ marginBottom: '2rem' }}
            >
              Send Email
            </button>
          )}
        </div>

        {safeDataAccess.getText(siteSettings?.bookingEmail) && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ 
              color: '#7C898B', 
              fontSize: '2rem', 
              marginBottom: '1rem',
              fontFamily: 'Unna, serif'
            }}>
              Booking Inquiries
            </h2>
            <p style={{ 
              color: '#93A3B1', 
              fontSize: '1.2rem', 
              marginBottom: '1rem',
              fontFamily: 'Unna, serif'
            }}>
              {safeDataAccess.getText(siteSettings.bookingEmail)}
            </p>
            <button 
              className="submit-button"
              onClick={() => handleEmailClick(siteSettings.bookingEmail)}
              style={{ marginTop: '1.5rem' }}
            >
              Book Now
            </button>
          </div>
        )}
      </div>

      </div>
    </ErrorBoundary>
  );
}

export default Contact;