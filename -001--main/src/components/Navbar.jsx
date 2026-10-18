import React from 'react';

export default function Navbar({ onOpenMenu }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-icon">🇹🇭</span>
        <span className="logo-text">เที่ยวไทย 77</span>
      </div>

      <div className="navbar-actions">
        {/* ปุ่มเปลี่ยนภาษา */}
        <div className="lang-switch">
          <button className="lang-btn active">TH</button>
          <span className="divider">/</span>
          <button className="lang-btn">EN</button>
        </div>

        {/* ไอคอนค้นหา */}
        <button className="icon-btn" aria-label="ค้นหา">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

        {/* ปุ่ม 3 ขีด (Hamburger Menu) */}
        <button className="hamburger-btn" onClick={onOpenMenu} aria-label="เปิดเมนู">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </nav>
  );
}