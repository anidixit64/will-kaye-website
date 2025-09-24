// Sanity Configuration
// Uses environment variables for flexibility and security

export const SANITY_CONFIG = {
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || '85zzbmzs',
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: process.env.REACT_APP_SANITY_API_VERSION || '2023-05-03',
  useCdn: true,
};
