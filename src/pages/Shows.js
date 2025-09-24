import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../lib/sanity';
import { urlFor } from '../lib/sanity';
import { FaInstagram, FaFacebook, FaTiktok, FaSpotify, FaApple, FaYoutube } from 'react-icons/fa';
import '../styles/Shows.css';

function Shows() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        // Fetch all shows sorted by date (newest first)
        const showsData = await client.fetch(`
          *[_type == "show"] | order(date desc) {
            _id,
            date,
            venue,
            city,
            ticketLink,
            venueImage
          }
        `);
        setShows(showsData);
      } catch (err) {
        setError('Failed to load content');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleTicketClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="shows-container">
        <div style={{ fontSize: '1.5rem', color: '#7C898B' }}>Loading...</div>
      </div>
    );
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
    <div className="shows-container">
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

      {/* Left Sidebar - Navigation */}
      <div className="left-sidebar" style={{ zIndex: 10 }}>
        <h3 className="sidebar-title">Pages</h3>
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
                  <img 
                    src={urlFor(show.venueImage).width(600).height(400).url()} 
                    alt={show.venueImage.alt || show.venue || 'Venue image'} 
                    className="show-venue-image"
                  />
                </div>
              )}
              
              {/* Right half - Venue Info */}
              <div className={`show-info-section ${!show.venueImage ? 'show-info-full' : ''}`}>
                {/* Top half - Venue name and city */}
                <div className="show-venue-info">
                  <h2 className="show-venue">
                    {show.venue || 'TBA'}
                  </h2>
                  {show.city && (
                    <p className="show-city">
                      {show.city}
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
                    {show.ticketLink && (
                      <button 
                        className="show-link tickets"
                        onClick={() => handleTicketClick(show.ticketLink)}
                      >
                        🎫 Buy Tickets
                      </button>
                    )}
                    
                    {!show.ticketLink && (
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
            No shows
          </div>
        )}
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

export default Shows;