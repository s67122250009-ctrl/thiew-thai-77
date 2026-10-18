import React, { useState } from 'react';
import Navbar from './components/Navbar';
import MenuOverlay from './components/MenuOverlay';
import HeroSection from './components/HeroSection';
import AttractionSlider from './components/AttractionSlider';
import ProvinceGrid from './components/ProvinceGrid';
import CategoryGrid from './components/CategoryGrid';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="app-container">
      {/* 1. Navbar */}
      <Navbar onOpenMenu={() => setIsMenuOpen(true)} />

      {/* 2. Fullscreen Menu Overlay */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* 3. Hero Section (ภาพใหญ่หน้าแรก) */}
      <HeroSection />

      {/* 4. สไลด์การ์ดแนะนำ 10 การ์ด */}
      <AttractionSlider />

      {/* 5. ค้นหาตามจังหวัด */}
      <ProvinceGrid />

      {/* 6. ประเภทที่เที่ยว / หมวดหมู่ */}
      <CategoryGrid />

      {/* 7. Footer ด้านล่าง */}
      <Footer />
    </div>
  );
}

export default App;