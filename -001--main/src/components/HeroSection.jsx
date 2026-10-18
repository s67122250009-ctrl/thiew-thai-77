import React from 'react';

export default function HeroSection() {
  return (
    <section className="hero-section">
      {/* ภาพพื้นหลังเต็มหน้าจอ */}
      <div className="hero-bg-overlay"></div>
      
      {/* ข้อความและช่องค้นหาตรงกลาง */}
      <div className="hero-content">
        <p className="hero-subtitle">THAI 77 PROVINCES</p>
        <h1 className="hero-title">
          เที่ยวไทยให้ครบ <br />
          ค้นพบสถานที่ที่ใช่ สำหรับคุณ
        </h1>
        <p className="hero-desc">
          ค้นหาสถานที่ตามจังหวัดหรือหมวดหมู่ บันทึกรายการโปรด และดูข้อมูลอย่างสะดวก
        </p>

        {/* ช่องค้นหา */}
        <div className="hero-search-box">
          <input 
            type="text" 
            placeholder="ค้นหาสถานที่ท่องเที่ยว, จังหวัด..." 
            className="hero-search-input"
          />
          <button className="hero-search-btn">ค้นหา</button>
        </div>
      </div>
    </section>
  );
}