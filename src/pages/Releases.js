import React from 'react';

function Releases() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      backgroundColor: '#93A3B1',
      color: '#322214',
      fontFamily: 'Georgia, serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>
        Music Releases
      </h1>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto' }}>
        This is the Releases page. Music releases will be displayed here.
      </p>
    </div>
  );
}

export default Releases;