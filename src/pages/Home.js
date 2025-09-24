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
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate mailing list signup (replace with actual service)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setEmail('');
    }, 2000);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
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

  const mainImageUrl = siteSettings?.mainPicture ? urlFor(siteSettings.mainPicture).width(600).url() : null;
  const backgroundImageUrl = siteSettings?.backgroundImage ? urlFor(siteSettings.backgroundImage).width(1920).url() : null;

  const navItems = [
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
    <div className="home-container">
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
          backgroundColor: 'rgba(50, 34, 20, 0.70)', // More transparent dark overlay
          zIndex: 2
        }}
      />
      
      {/* Mobile Navigation */}
      <MobileNav 
        currentPath="/"
        navItems={navItems}
        socialLinks={socialLinks}
      />

      {/* Left Sidebar - Navigation */}
      <div className="left-sidebar" style={{ zIndex: 10 }}>
        <h3 className="sidebar-title">Pages</h3>
        <div className="nav-list">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="nav-item">
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <h1 className="main-title" style={{ zIndex: 10 }}>Will Kaye</h1>
      
      {mainImageUrl && (
        <div className="main-image-container" style={{ zIndex: 10 }}>
          <img src={mainImageUrl} alt="Will Kaye" className="main-image" />
        </div>
      )}
      
      <div className="bio-section" style={{ zIndex: 10 }}>
        <p className="bio-text">
          {siteSettings?.shortBio || 
            'Musician, artist, and creative soul. Welcome to my musical journey.'}
        </p>
      </div>

      <div className="divider-bar" style={{ zIndex: 10 }}></div>

      <div className="mailing-list-section" style={{ zIndex: 10 }}>
        <form className="mailing-list-form" onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            className="email-input"
            required
          />
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Joining...' : 'Join Mailing List'}
          </button>
          {submitSuccess && (
            <p style={{ 
              color: '#7C898B', 
              fontSize: '0.9rem',
              fontFamily: 'Georgia, serif',
              marginTop: '0.5rem',
              textAlign: 'center'
            }}>
              Thank you for joining!
            </p>
          )}
        </form>
      </div>

      {/* Right Sidebar - Social Media */}
      <div className="right-sidebar" style={{ zIndex: 10 }}>
        <h3 className="sidebar-title">Connect</h3>
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
              >
                <IconComponent size={18} />
                <span>{social.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;