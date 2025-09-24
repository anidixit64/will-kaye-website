// Sanity Configuration
// Uses environment variables for flexibility and security

export const SANITY_CONFIG = {
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.REACT_APP_SANITY_DATASET,
  apiVersion: process.env.REACT_APP_SANITY_API_VERSION || '2023-08-31',
  useCdn: true, // `false` if you want to ensure fresh data
};
