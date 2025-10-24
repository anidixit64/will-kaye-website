import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaInstagram, FaFacebook, FaTiktok, FaSpotify, FaApple, FaYoutube } from 'react-icons/fa';
import '../styles/MobileNav.css';

function MobileNav({ currentPath, navItems, socialLinks }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
    if (isSocialOpen) setIsSocialOpen(false);
  };

  const toggleSocial = () => {
    setIsSocialOpen(!isSocialOpen);
    if (isNavOpen) setIsNavOpen(false);
  };

  const closeAll = () => {
    setIsNavOpen(false);
    setIsSocialOpen(false);
  };

  return (
    <>
      {/* Mobile Navigation Buttons */}
      <div className="mobile-nav-buttons">
        {/* Left Pages Button */}
        <button 
          className={`mobile-nav-btn mobile-nav-left ${isNavOpen ? 'active' : ''}`}
          onClick={toggleNav}
          aria-label="Toggle Pages"
        >
          <span className="mobile-nav-btn-text">Pages</span>
          {isNavOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
        </button>

        {/* Center Logo/Title */}
        <div className="mobile-nav-center">
          <img src="/willkayelogo.png" alt="Will Kaye" className="mobile-nav-logo" />
        </div>

        {/* Right Social Media Button */}
        <button 
          className={`mobile-nav-btn mobile-nav-right ${isSocialOpen ? 'active' : ''}`}
          onClick={toggleSocial}
          aria-label="Toggle Social Media"
        >
          <span className="mobile-nav-btn-text">Social</span>
          {isSocialOpen ? <FaTimes size={16} /> : <FaInstagram size={16} />}
        </button>
      </div>

      {/* Mobile Navigation Panel */}
      {isNavOpen && (
        <div className="mobile-nav-panel mobile-nav-left-panel">
          <div className="mobile-nav-content">
            <h3 className="mobile-nav-title">Pages</h3>
            <div className="mobile-nav-list">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`mobile-nav-item ${item.path === currentPath ? 'active' : ''}`}
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Social Panel */}
      {isSocialOpen && (
        <div className="mobile-nav-panel mobile-nav-right-panel">
          <div className="mobile-nav-content">
            <h3 className="mobile-nav-title">Connect</h3>
            <div className="mobile-nav-list">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a 
                    key={social.name} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mobile-nav-item"
                    onClick={closeAll}
                  >
                    <IconComponent size={18} />
                    <span>{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close panels when clicking outside */}
      {(isNavOpen || isSocialOpen) && (
        <div className="mobile-nav-overlay" onClick={closeAll} />
      )}
    </>
  );
}

export default MobileNav;
