import React from 'react';

export const PageSkeleton = () => (
  <div style={{
    minHeight: '100vh',
    backgroundColor: 'rgba(36, 60, 79, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  }}>
    <div style={{
      width: '200px',
      height: '200px',
      backgroundColor: 'rgba(76, 68, 60, 0.3)',
      borderRadius: '8px',
      marginBottom: '2rem',
      animation: 'pulse 1.5s ease-in-out infinite'
    }} />
    <div style={{
      width: '300px',
      height: '20px',
      backgroundColor: 'rgba(76, 68, 60, 0.3)',
      borderRadius: '4px',
      marginBottom: '1rem',
      animation: 'pulse 1.5s ease-in-out infinite'
    }} />
    <div style={{
      width: '250px',
      height: '16px',
      backgroundColor: 'rgba(76, 68, 60, 0.3)',
      borderRadius: '4px',
      animation: 'pulse 1.5s ease-in-out infinite'
    }} />
    <style jsx>{`
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `}</style>
  </div>
);

export const ImageSkeleton = ({ width = 400, height = 300, borderRadius = '8px' }) => (
  <div style={{
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: 'rgba(76, 68, 60, 0.3)',
    borderRadius,
    animation: 'pulse 1.5s ease-in-out infinite',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FAF9F6',
    fontSize: '1rem',
    fontFamily: 'Unna, serif'
  }}>
    Loading...
    <style jsx>{`
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `}</style>
  </div>
);

export const TextSkeleton = ({ lines = 3, width = '100%' }) => (
  <div>
    {Array.from({ length: lines }).map((_, index) => (
      <div
        key={index}
        style={{
          width: index === lines - 1 ? '60%' : width,
          height: '16px',
          backgroundColor: 'rgba(76, 68, 60, 0.3)',
          borderRadius: '4px',
          marginBottom: index < lines - 1 ? '0.5rem' : '0',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}
      />
    ))}
    <style jsx>{`
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `}</style>
  </div>
);

export const CardSkeleton = () => (
  <div style={{
    backgroundColor: 'rgba(76, 68, 60, 0.7)',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
    animation: 'pulse 1.5s ease-in-out infinite'
  }}>
    <div style={{
      width: '100%',
      height: '200px',
      backgroundColor: 'rgba(76, 68, 60, 0.3)',
      borderRadius: '8px',
      marginBottom: '1rem'
    }} />
    <div style={{
      width: '80%',
      height: '20px',
      backgroundColor: 'rgba(76, 68, 60, 0.3)',
      borderRadius: '4px',
      marginBottom: '0.5rem'
    }} />
    <div style={{
      width: '60%',
      height: '16px',
      backgroundColor: 'rgba(76, 68, 60, 0.3)',
      borderRadius: '4px'
    }} />
    <style jsx>{`
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `}</style>
  </div>
);
