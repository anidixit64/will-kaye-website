import React, { createContext, useContext, useState, useEffect } from 'react';
import { client, queries, safeDataAccess } from '../lib/sanity';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [shows, setShows] = useState([]);
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel for better performance
      const [siteData, showsData, releasesData] = await Promise.all([
        client.fetch(queries.siteSettings),
        client.fetch(queries.shows),
        client.fetch(queries.releases)
      ]);

      setSiteSettings(siteData);
      setShows(showsData);
      setReleases(releasesData);
      setLastFetch(Date.now());
    } catch (err) {
      setError('Failed to load content');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const data = await client.fetch(queries.siteSettings);
      setSiteSettings(data);
      setLastFetch(Date.now());
    } catch (err) {
      setError('Failed to load site settings');
      console.error('Error fetching site settings:', err);
    }
  };

  const fetchShows = async () => {
    try {
      const data = await client.fetch(queries.shows);
      setShows(data);
      setLastFetch(Date.now());
    } catch (err) {
      setError('Failed to load shows');
      console.error('Error fetching shows:', err);
    }
  };

  const fetchReleases = async () => {
    try {
      const data = await client.fetch(queries.releases);
      setReleases(data);
      setLastFetch(Date.now());
    } catch (err) {
      setError('Failed to load releases');
      console.error('Error fetching releases:', err);
    }
  };

  const refreshData = async () => {
    await fetchAllData();
  };

  const isDataStale = () => {
    if (!lastFetch) return true;
    return Date.now() - lastFetch > CACHE_DURATION;
  };

  useEffect(() => {
    // Only fetch if we don't have data or if data is stale
    if (!siteSettings || !shows.length || !releases.length || isDataStale()) {
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    siteSettings,
    shows,
    releases,
    loading,
    error,
    refreshData,
    fetchSiteSettings,
    fetchShows,
    fetchReleases,
    isDataStale: isDataStale()
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
