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
import '../styles/Home.css';

function Home() {
  const { siteSettings, loading, error } = useData();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [layloLoaded, setLayloLoaded] = useState(false);

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


  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="home-container">
        <h1 className="main-title">Will Kaye</h1>
        <div className="bio-section">
          <p className="bio-text">
            Musician, artist, and creative soul. Welcome to my musical journey.
          </p>
        </div>
      </div>
    );
  }

  const mainImageUrl = safeDataAccess.getImageUrl(siteSettings?.mainPicture, 1920);
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
        className="home-container"
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
        currentPath="/"
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
                className={`nav-item ${item.path === '/' ? 'active' : ''}`}
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
      {mainImageUrl && (
        <div className="main-image-container">
          <OptimizedImage 
            src={mainImageUrl} 
            alt="Will Kaye" 
            className="main-image"
            priority={true}
          />
        </div>
      )}
      
      {/* Content that appears after the image */}
      <div className="content-after-image">
        <div className="bio-section" style={{ zIndex: 10 }}>
          <p className="bio-text">
            {safeDataAccess.getText(siteSettings?.shortBio, 
              'Musician, artist, and creative soul. Welcome to my musical journey.')}
          </p>
        </div>

        <div className="divider-bar" style={{ zIndex: 10 }}></div>

        <div className="mailing-list-section" style={{ zIndex: 10 }}>
          <h2 style={{
            color: '#FAF9F6',
            fontSize: '2rem',
            fontFamily: 'Unna, serif',
            textAlign: 'center',
            marginBottom: '2rem',
            fontWeight: '700'
          }}>
            Sign up for my Mailing List
          </h2>
          <div style={{ position: 'relative' }}>
            <iframe 
              id="laylo-drop-hgTsE"
              frameBorder="0"
              scrolling="no"
              allow="web-share"
              allowTransparency="true"
              style={{
                width: '100%',
                minWidth: '300px',
                maxWidth: '1000px',
                height: '200px',
                border: '1px solid rgba(250, 249, 246, 0.3)',
                borderRadius: '8px',
                display: 'block',
                margin: '0 auto',
                backgroundColor: 'rgba(76, 68, 60, 0.3)'
              }}
              src="https://embed.laylo.com?dropId=hgTsE&color=0000FF&minimal=false&theme=light"
              title="Laylo Email Signup"
              onLoad={() => {
                console.log('Laylo iframe loaded');
                // Check if iframe has content after a delay
                setTimeout(() => {
                  const iframe = document.getElementById('laylo-drop-hgTsE');
                  if (iframe) {
                    try {
                      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                      console.log('Iframe content:', iframeDoc.body?.innerHTML || 'No content');
                    } catch (e) {
                      console.log('Cannot access iframe content (CORS):', e.message);
                    }
                  }
                }, 2000);
              }}
              onError={() => {
                console.log('Laylo iframe failed to load');
              }}
            />
            
            {/* Debug overlay */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: '#FAF9F6',
              padding: '0.5rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              zIndex: 10
            }}>
              Debug: Iframe loaded
            </div>
            
            {/* Fallback message if no content */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(76, 68, 60, 0.9)',
              color: '#FAF9F6',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '0.9rem',
              zIndex: 5
            }}>
              <p style={{ margin: '0 0 1rem 0' }}>
                Laylo embed not showing content
              </p>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', opacity: 0.8 }}>
                Drop ID: hgTsE
              </p>
              <a 
                href="https://laylo.com/hgTsE" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: '#FAF9F6',
                  textDecoration: 'underline',
                  backgroundColor: 'rgba(99, 101, 100, 0.8)',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}
              >
                Try Direct Link
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default Home;