import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { client, queries, urlFor } from '../lib/sanity';
import { FaInstagram, FaFacebook, FaTiktok, FaSpotify, FaApple, FaYoutube } from 'react-icons/fa';
import MobileNav from '../components/MobileNav';
import '../styles/Home.css';

function Contact() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleEmailClick = (email) => {
    if (email) {
      window.location.href = `mailto:${email}`;
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
        <h1 className="main-title">Contact</h1>
        <div className="bio-section">
          <p className="bio-text">
            Failed to load contact information.
          </p>
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
        currentPath="/contact"
        navItems={navItems}
        socialLinks={socialLinks}
      />

      {/* Top Navigation Bar */}
      <div className="top-navbar" style={{ zIndex: 10 }}>
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
                  <IconComponent size={24} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <h1 className="main-title" style={{ zIndex: 10 }}>Contact</h1>
      
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
            {siteSettings?.contactEmail || 'Contact email coming soon'}
          </p>
          {siteSettings?.contactEmail && (
            <button 
              className="submit-button"
              onClick={() => handleEmailClick(siteSettings.contactEmail)}
              style={{ marginBottom: '2rem' }}
            >
              📧 Send Email
            </button>
          )}
        </div>

        {siteSettings?.bookingEmail && (
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
              {siteSettings.bookingEmail}
            </p>
            <button 
              className="submit-button"
              onClick={() => handleEmailClick(siteSettings.bookingEmail)}
            >
              📧 Book Now
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

export default Contact;