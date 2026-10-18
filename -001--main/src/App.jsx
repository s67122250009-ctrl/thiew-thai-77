import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

import Navbar from './components/layout/Navbar';
import MenuOverlay from './components/layout/MenuOverlay';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';

import HeroSection from './components/features/HeroSection';
import AttractionSlider from './components/features/AttractionSlider';
import ProvinceGrid from './components/features/ProvinceGrid';
import CategoryGrid from './components/features/CategoryGrid';

import AttractionsPage from './components/pages/AttractionsPage';
import AttractionDetailPage from './components/pages/AttractionDetailPage';
import ProvinceListPage from './components/pages/ProvinceListPage';
import CategoryListPage from './components/pages/CategoryListPage';
import FavoritesPage from './components/pages/FavoritesPage';
import SearchPage from './components/pages/SearchPage';

import { getAttractions, getProvinces } from './services/attractionService';
import './App.css';


function HomePageContent({ attractions, provinces, loading }) {
  return (
    <>
      <HeroSection />
      <AttractionSlider items={attractions} loading={loading} />
      <ProvinceGrid provinces={provinces} />
      <CategoryGrid />
    </>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [attractions, setAttractions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getAttractions(), getProvinces()])
      .then(([attrData, provData]) => {
        if (!active) return;
        setAttractions(attrData || []);
        setProvinces(provData || []);
      })
      .catch((err) => console.error('Error loading data:', err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <LanguageProvider>
      <div className="app-container">
        <Navbar onOpenMenu={() => setIsMenuOpen(true)} />
        <ScrollToTop />
        <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        <Routes>
          <Route
            path="/"
            element={
              <HomePageContent
                attractions={attractions}
                provinces={provinces}
                loading={loading}
              />
            }
          />
          <Route path="/attractions" element={<AttractionsPage />} />
          <Route path="/attractions/:id" element={<AttractionDetailPage />} />
          <Route path="/provinces" element={<ProvinceListPage />} />
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>

        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;