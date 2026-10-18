import React from 'react';

const categories = [
  { id: 'sea', name: 'ทะเลและเกาะ', icon: '🌊', color: '#e0f2fe' },
  { id: 'nature', name: 'อุทยานและธรรมชาติ', icon: '🌲', color: '#dcfce7' },
  { id: 'temple', name: 'วัดและศาสนสถาน', icon: '🛕', color: '#fef3c7' },
  { id: 'market', name: 'ชุมชนและตลาด', icon: '🛍️', color: '#ffe4e6' },
  { id: 'history', name: 'โบราณสถานและประวัติศาสตร์', icon: '🏛️', color: '#f3e8ff' },
  { id: 'cafe', name: 'คาเฟ่และร้านอาหาร', icon: '☕', color: '#ffedd5' },
];

export default function CategoryGrid() {
  return (
    <section className="section-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">ประเภทที่เที่ยว</h2>
          <p className="section-subtitle">ค้นหาสถานที่ตามสไตล์ที่คุณชอบ</p>
        </div>
      </div>

      <div className="category-grid">
        {categories.map((cat) => (
          <a href={`#category-${cat.id}`} key={cat.id} className="category-card">
            <div className="category-icon-bg" style={{ backgroundColor: cat.color }}>
              <span className="category-icon-symbol">{cat.icon}</span>
            </div>
            <span className="category-name">{cat.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}