import React from 'react';

function About() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      backgroundColor: '#93A3B1',
      color: '#322214',
      fontFamily: 'Georgia, serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>
        About Will Kaye
      </h1>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto' }}>
        This is the About page. Content will be added here.
      </p>
    </div>
  );
}

export default About;