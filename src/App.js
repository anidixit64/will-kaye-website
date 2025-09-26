import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { PageSkeleton } from './components/LoadingSkeleton';

// Lazy load pages for code splitting
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Releases = React.lazy(() => import('./pages/Releases'));
const Shows = React.lazy(() => import('./pages/Shows'));
const Contact = React.lazy(() => import('./pages/Contact'));

function App() {
  return (
    <DataProvider>
      <Router>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/releases" element={<Releases />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </Router>
    </DataProvider>
  );
}

export default App;