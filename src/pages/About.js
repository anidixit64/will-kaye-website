import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { client, queries, urlFor } from '../lib/sanity';
import { FaInstagram, FaFacebook, FaTiktok, FaSpotify, FaApple, FaYoutube } from 'react-icons/fa';
import { PortableText } from '@portabletext/react';
import MobileNav from '../components/MobileNav';
import '../styles/About.css';

function About() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
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

  if (loading) {
    return (
      <div className="about-container">
        <div style={{ fontSize: '1.5rem', color: '#7C898B' }}>Loading...</div>
      </div>
    );
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

  const backgroundImageUrl = siteSettings?.backgroundImage ? urlFor(siteSettings.backgroundImage).width(1920).url() : null;

  return (
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
          backgroundColor: 'rgba(36, 60, 79, 0.90)', // Less transparent navy overlay
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
        {siteSettings?.longBio && (
          <div className="about-text">
            <PortableText value={siteSettings.longBio} />
          </div>
        )}
        
        {!siteSettings?.longBio && (
          <p className="about-text">
            Welcome to the story behind the music. Will Kaye's journey through the world of sound and storytelling.
            From humble beginnings to creating music that touches the soul, Will has dedicated his life to the craft 
            of storytelling through song. With roots deeply planted in Americana traditions, his music weaves together 
            the threads of folk, country, and rock into a tapestry that speaks to the heart of the American experience.
          </p>
        )}
      </div>

      {/* Gallery Section */}
      {siteSettings?.gallery && siteSettings.gallery.length > 0 && (
        <div className="gallery-section" style={{ zIndex: 10 }}>
          <h2 className="gallery-title">Gallery</h2>
          <div className="gallery-grid">
            {siteSettings.gallery.map((image, index) => (
              <div key={index} className="gallery-item">
                <img 
                  src={urlFor(image).width(600).url()} 
                  alt={`Gallery image ${index + 1}`}
                  className="gallery-image"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EPK Download Section - Standalone if no gallery */}
      {(!siteSettings?.gallery || siteSettings.gallery.length === 0) && siteSettings?.epkFile && (
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

      {/* EPK Button - Positioned halfway between gallery and bottom */}
      <div className="epk-section-spacer" style={{ zIndex: 10 }}>
        <button 
          className="epk-button"
          onClick={handleEPKDownload}
        >
          Download EPK
        </button>
      </div>

    </div>
  );
}

export default About;