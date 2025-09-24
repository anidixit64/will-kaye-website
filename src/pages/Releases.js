import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../lib/sanity';
import { urlFor } from '../lib/sanity';
import { FaInstagram, FaFacebook, FaTiktok, FaSpotify, FaApple, FaYoutube, FaBandcamp } from 'react-icons/fa';
import MobileNav from '../components/MobileNav';
import '../styles/Music.css';

function Releases() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch site settings for background image
        const siteData = await client.fetch(`
          *[_type == "siteSettings"][0] {
            backgroundImage
          }
        `);
        setSiteSettings(siteData);

        // Fetch all releases sorted by release date (newest first)
        const releasesData = await client.fetch(`
          *[_type == "release"] | order(releaseDate desc) {
            _id,
            title,
            releaseDate,
            albumCover,
            streamLink,
            buyLink,
            lyricsLink
          }
        `);
        setReleases(releasesData);
      } catch (err) {
        setError('Failed to load content');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleLinkClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="music-container">
        <div style={{ fontSize: '1.5rem', color: '#7C898B' }}>Loading...</div>
      </div>
    );
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
          backgroundColor: 'rgba(36, 60, 79, 0.90)', // Less transparent navy overlay
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
          <h1 className="header-title">Will Kaye</h1>
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
                {release.albumCover ? (
                  <img 
                    src={urlFor(release.albumCover).width(400).url()} 
                    alt={`${release.title} album cover`}
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
                )}
              </div>
              
              {/* Middle - Album name and release date */}
              <div className="release-info">
                <h2 className="release-title">
                  {release.title || 'TBA'}
                </h2>
                <p className="release-date">
                  {formatDate(release.releaseDate)}
                </p>
              </div>
              
              {/* Right side - Vertical column of action buttons */}
              <div className="release-actions">
                {release.streamLink && (
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
                
                {release.buyLink && (
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
                
                {release.lyricsLink && (
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
                
                {!release.streamLink && !release.buyLink && !release.lyricsLink && (
                  <div className="no-actions">
                    <span>Links coming soon</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-releases">
            No releases
          </div>
        )}
      </div>

    </div>
  );
}

export default Releases;