import React, { useEffect, useState } from 'react';
import '../styles/LoadingScreen.css';

function LoadingScreen({ onLoadingComplete }) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simple loading simulation - just wait a bit then complete
    const timer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => {
        onLoadingComplete();
      }, 500);
    }, 2000); // 2 second loading time

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className={`loading-screen ${isComplete ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-logo">
          <img src="/willkayelogo.png" alt="Will Kaye" />
        </div>
        
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
