import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SANITY_CONFIG } from '../config/sanity'

// Sanity client configuration
export const client = createClient(SANITY_CONFIG)

// Image URL builder for optimized images
const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)

// GROQ queries for fetching data
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
  
  // Get all shows ordered by date (newest first)
  shows: `*[_type == "show"] | order(date desc) {
    _id,
    date,
    venue,
    city,
    ticketLink
  }`,
  
  // Get site settings
  siteSettings: `*[_type == "siteSettings"][0] {
    shortBio,
    mainPicture,
    backgroundImage,
    longBio,
    gallery,
    epkFile,
    contactEmail,
    bookingEmail
  }`
}
