import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SANITY_CONFIG } from '../config/sanity'

// Sanity client configuration
export const client = createClient(SANITY_CONFIG)

// Image URL builder for optimized images
const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)

// GROQ queries for fetching data with proper null handling
export const queries = {
  // Get all releases ordered by release date (newest first)
  releases: `*[_type == "release"] | order(releaseDate desc) {
    _id,
    title,
    releaseDate,
    albumCover,
    streamLink,
    buyLink,
    lyricsLink
  }`,
  
  // Get all shows ordered by date (newest first) with venue images
  shows: `*[_type == "show"] | order(date desc) {
    _id,
    date,
    venue,
    city,
    address,
    ticketStatus,
    ticketLink,
    venueImage {
      ...,
      alt
    }
  }`,
  
  // Get site settings with comprehensive field coverage
  siteSettings: `*[_type == "siteSettings"][0] {
    shortBio,
    mainPicture,
    backgroundImage,
    longBio,
    gallery,
    headshot {
      ...,
      alt
    },
    epkFile {
      ...,
      "url": asset->url
    },
    contactEmail,
    bookingEmail,
    instagramUrl,
    facebookUrl,
    tiktokUrl,
    spotifyUrl,
    appleMusicUrl,
    youtubeUrl
  }`
}

// Utility functions for safe data access
export const safeDataAccess = {
  // Safe image URL generation with fallback
  getImageUrl: (image, width = 600, height = null) => {
    if (!image) return null;
    try {
      const builder = urlFor(image);
      if (height) {
        return builder.width(width).height(height).url();
      }
      return builder.width(width).url();
    } catch (error) {
      console.warn('Error generating image URL:', error);
      return null;
    }
  },

  // Safe text access with fallback
  getText: (text, fallback = '') => {
    return text || fallback;
  },

  // Safe array access with fallback
  getArray: (array, fallback = []) => {
    return Array.isArray(array) ? array : fallback;
  },

  // Safe URL access with validation
  getUrl: (url) => {
    if (!url) return null;
    try {
      new URL(url);
      return url;
    } catch (error) {
      console.warn('Invalid URL:', url);
      return null;
    }
  },

  // Safe date formatting
  formatDate: (dateString, fallback = 'TBA') => {
    if (!dateString) return fallback;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return fallback;
      return date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return fallback;
    }
  },

  // Safe time formatting
  formatTime: (dateString, fallback = 'TBA') => {
    if (!dateString) return fallback;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return fallback;
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.warn('Error formatting time:', error);
      return fallback;
    }
  }
}
