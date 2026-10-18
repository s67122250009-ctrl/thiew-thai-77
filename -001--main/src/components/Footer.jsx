import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="navbar-logo">
            <span className="logo-icon">🇹🇭</span>
            <span className="logo-text">เที่ยวไทย 77</span>
          </div>
          <p className="footer-desc">
            รวบรวมข้อมูลสถานที่ท่องเที่ยวทั่วประเทศไทย 77 จังหวัด ค้นหาง่าย ได้ข้อมูลครบจบในที่เดียว
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>เมนูหลัก</h4>
            <a href="#home">หน้าแรก</a>
            <a href="#provinces">จังหวัด</a>
            <a href="#attractions">สถานที่ท่องเที่ยว</a>
            <a href="#favorites">รายการโปรด</a>
          </div>
          <div className="footer-col">
            <h4>หมวดหมู่ฮิต</h4>
            <a href="#sea">ทะเลและเกาะ</a>
            <a href="#nature">อุทยานแห่งชาติ</a>
            <a href="#temple">วัดและศาสนสถาน</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 เที่ยวไทย 77 (Thiew Thai 77). All rights reserved.</p>
      </div>
    </footer>
  );
}