# Will Kaye Website

A modern React website for musician Will Kaye, built with Sanity CMS integration.

## Features

- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Sanity CMS Integration**: Dynamic content management for releases, shows, and site settings
- **Modern Tech Stack**: React, Styled Components, React Router
- **Performance Optimized**: Image optimization and lazy loading
- **SEO Friendly**: Semantic HTML and proper meta tags

## Pages

- **Home**: Hero section with bio and main image
- **About**: Detailed bio, photo gallery, and EPK download
- **Music**: Music releases with streaming and purchase links
- **Shows**: Upcoming and past shows with ticket links
- **Contact**: Contact form and booking information

## Tech Stack

- React 18
- React Router DOM
- Styled Components
- Sanity Client
- Sanity Image URL

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Sanity Configuration

The website connects to a Sanity project with the following schema:

- **Releases**: Music releases with album covers and streaming links
- **Shows**: Concert dates and venues
- **Site Settings**: Home page content, about page, and contact information

### Project Details
- Project ID: `85zzbmzs`
- Dataset: `production`

## Content Management

Content is managed through the Sanity Studio at `will-kuch-studio`. The website automatically fetches and displays:

- Music releases with album artwork
- Show dates and venues
- Bio content and images
- Contact information
- Photo galleries

## Customization

### Styling
- Global styles: `src/styles/GlobalStyles.js`
- Theme configuration: `src/styles/theme.js`
- Component styles use Styled Components with theme variables

### Content
- All content is managed through Sanity CMS
- Images are automatically optimized through Sanity's CDN
- Rich text content supports formatting and links

## Deployment

The website can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `build` folder to your hosting service

### Recommended Hosting
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── styles/             # Global styles and theme
├── lib/                # Sanity client configuration
└── App.js              # Main application component
```

### Adding New Features
1. Create components in `src/components/`
2. Add new pages in `src/pages/`
3. Update routing in `src/App.js`
4. Style components using Styled Components

## License

All rights reserved. This website is for Will Kaye's personal use.