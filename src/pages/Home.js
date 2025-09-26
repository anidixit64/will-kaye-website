import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { client, queries, urlFor } from '../lib/sanity';
import { FaInstagram, FaFacebook, FaTiktok, FaSpotify, FaApple, FaYoutube } from 'react-icons/fa';
import MobileNav from '../components/MobileNav';
import '../styles/Home.css';

function Home() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHeader, setShowHeader] = useState(true); // Always true for testing
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const data = await client.fetch(queries.siteSettings);
        setSiteSettings(data);
      } catch (err) {
        setError('Failed to load content');
        console.error('Error fetching site settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

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
    return (
      <div className="home-container">
        <div style={{ fontSize: '1.5rem', color: '#4C443C' }}>Loading...</div>
      </div>
    );
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

  const mainImageUrl = siteSettings?.mainPicture ? urlFor(siteSettings.mainPicture).width(1920).quality(90).url() : null;
  const backgroundImageUrl = siteSettings?.backgroundImage ? urlFor(siteSettings.backgroundImage).width(1920).url() : null;

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
          backgroundColor: 'rgba(36, 60, 79, 0.90)', // Less transparent navy overlay
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
          <img src={mainImageUrl} alt="Will Kaye" className="main-image" />
        </div>
      )}
      
      {/* Content that appears after the image */}
      <div className="content-after-image">
        <div className="bio-section" style={{ zIndex: 10 }}>
          <p className="bio-text">
            {siteSettings?.shortBio || 
              'Musician, artist, and creative soul. Welcome to my musical journey.'}
          </p>
        </div>

        <div className="divider-bar" style={{ zIndex: 10 }}></div>

        <div className="mailing-list-section" style={{ zIndex: 10 }}>
          <div style={{ 
            backgroundColor: 'rgba(76, 68, 60, 0.7)', 
            padding: '2rem', 
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <p style={{ color: '#FAF9F6', fontSize: '1.2rem', marginBottom: '1rem' }}>
              Join the mailing list
            </p>
          </div>
          <iframe 
            id="laylo-drop-hgTsE"
            frameBorder="0"
            scrolling="no"
            allow="web-share"
            allowTransparency="true"
            style={{
              width: '100%',
              minWidth: '300px',
              maxWidth: '600px',
              height: '200px',
              border: 'none',
              borderRadius: '8px',
              display: 'block',
              margin: '0 auto',
              backgroundColor: 'transparent'
            }}
            src="https://embed.laylo.com?dropId=hgTsE&color=0000FF&minimal=false&theme=light"
            title="Laylo Email Signup"
          />
        </div>
      </div>

    </div>
  );
}

export default Home;