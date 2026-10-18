import React, { useState } from 'react';

export default function MenuOverlay({ isOpen, onClose }) {
  const [activeDropdown, setActiveDropdown] = useState('categories'); // เปิดหมวดหมู่ไว้เป็นตัวอย่าง

  if (!isOpen) return null;

  const toggleDropdown = (menuName) => {
    setActiveDropdown(activeDropdown === menuName ? null : menuName);
  };

  return (
    <div className="menu-overlay">
      {/* Header */}
      <div className="menu-header">
        <div className="navbar-logo">
          <span className="logo-icon">🇹🇭</span>
          <span className="logo-text">เที่ยวไทย 77</span>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="ปิดเมนู">
          ✕
        </button>
      </div>

      {/* Menu Body */}
      <div className="menu-body">
        {/* 1. จังหวัด */}
        <div className="menu-item">
          <div 
            className={`menu-title ${activeDropdown === 'provinces' ? 'active' : ''}`} 
            onClick={() => toggleDropdown('provinces')}
          >
            <span>จังหวัด (77 จังหวัด)</span>
            <span className="arrow">{activeDropdown === 'provinces' ? '⌵' : '❯'}</span>
          </div>
          {activeDropdown === 'provinces' && (
            <div className="menu-submenu">
              <a href="#provinces" onClick={onClose}>ดูจังหวัดทั้งหมด (77 จังหวัด)</a>
              <a href="#north" onClick={onClose}>ภาคเหนือ</a>
              <a href="#central" onClick={onClose}>ภาคกลาง</a>
              <a href="#south" onClick={onClose}>ภาคใต้</a>
              <a href="#isan" onClick={onClose}>ภาคตะวันออกเฉียงเหนือ</a>
            </div>
          )}
        </div>

        {/* 2. สถานที่ท่องเที่ยว */}
        <div className="menu-item">
          <div 
            className={`menu-title ${activeDropdown === 'attractions' ? 'active' : ''}`} 
            onClick={() => toggleDropdown('attractions')}
          >
            <span>สถานที่ท่องเที่ยว</span>
            <span className="arrow">{activeDropdown === 'attractions' ? '⌵' : '❯'}</span>
          </div>
          {activeDropdown === 'attractions' && (
            <div className="menu-submenu">
              <a href="#all-attractions" onClick={onClose}>สถานที่ท่องเที่ยวทั้งหมด</a>
              <a href="#popular" onClick={onClose}>สถานที่ท่องเที่ยวยอดนิยม</a>
            </div>
          )}
        </div>

        {/* 3. ประเภทที่เที่ยว (หมวดหมู่) */}
        <div className="menu-item">
          <div 
            className={`menu-title ${activeDropdown === 'categories' ? 'active' : ''}`} 
            onClick={() => toggleDropdown('categories')}
          >
            <span>ประเภทที่เที่ยว (หมวดหมู่)</span>
            <span className="arrow">{activeDropdown === 'categories' ? '⌵' : '❯'}</span>
          </div>
          {activeDropdown === 'categories' && (
            <div className="menu-submenu category-menu-list">
              <a href="#cat-sea" onClick={onClose}>
                <span className="menu-icon">🌊</span>
                <span>ทะเลและเกาะ</span>
              </a>
              <a href="#cat-nature" onClick={onClose}>
                <span className="menu-icon">🌲</span>
                <span>อุทยานและธรรมชาติ</span>
              </a>
              <a href="#cat-temple" onClick={onClose}>
                <span className="menu-icon">🛕</span>
                <span>วัดและศาสนสถาน</span>
              </a>
              <a href="#cat-market" onClick={onClose}>
                <span className="menu-icon">🛍️</span>
                <span>ชุมชนและตลาด</span>
              </a>
              <a href="#cat-history" onClick={onClose}>
                <span className="menu-icon">🏛️</span>
                <span>โบราณสถานและประวัติศาสตร์</span>
              </a>
              <a href="#cat-cafe" onClick={onClose}>
                <span className="menu-icon">☕</span>
                <span>คาเฟ่และร้านอาหาร</span>
              </a>
            </div>
          )}
        </div>

        {/* 4. รายการโปรด (ถูกใจ) */}
        <div className="menu-item">
          <a href="#favorites" className="menu-link-single" onClick={onClose}>
            <span>รายการโปรด (ถูกใจ)</span>
          </a>
        </div>
      </div>
    </div>
  );
}