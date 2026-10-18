import React from 'react';

const popularProvinces = [
  { id: 'bkk', name: 'กรุงเทพมหานคร', count: '12 สถานที่' },
  { id: 'cm', name: 'เชียงใหม่', count: '18 สถานที่' },
  { id: 'kb', name: 'กระบี่', count: '10 สถานที่' },
  { id: 'cb', name: 'ชลบุรี', count: '14 สถานที่' },
  { id: 'pk', name: 'ภูเก็ต', count: '11 สถานที่' },
  { id: 'nn', name: 'น่าน', count: '8 สถานที่' },
  { id: 'kan', name: 'กาญจนบุรี', count: '9 สถานที่' },
  { id: 'py', name: 'พะเยา', count: '5 สถานที่' },
];

export default function ProvinceGrid() {
  return (
    <section className="section-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">ค้นหาตามจังหวัด</h2>
          <p className="section-subtitle">เลือกจุดหมายปลายทางจาก 77 จังหวัดทั่วไทย</p>
        </div>
        <button className="view-all-btn">ดูจังหวัดทั้งหมด 77 จังหวัด →</button>
      </div>

      <div className="province-grid">
        {popularProvinces.map((prov) => (
          <a href={`#province-${prov.id}`} key={prov.id} className="province-card">
            <span className="province-name">{prov.name}</span>
            <span className="province-count">{prov.count} ↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}