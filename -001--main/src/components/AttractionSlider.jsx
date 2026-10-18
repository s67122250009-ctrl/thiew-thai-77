import React, { useRef } from 'react';

// ข้อมูลตัวอย่าง 10 สถานที่ท่องเที่ยว
const mockAttractions = [
  { id: 1, title: 'อุทยานแห่งชาติดอยอินทนนท์', location: 'เชียงใหม่', desc: 'ยอดเขาที่สูงที่สุดในประเทศไทย อากาศหนาวเย็นตลอดปี', img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=80' },
  { id: 2, title: 'วัดพระธาตุดอยสุเทพราชวรวิหาร', location: 'เชียงใหม่', desc: 'วัดคู่บ้านคู่เมืองเชียงใหม่ ประดิษฐานพระบรมสารีริกธาตุ', img: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80' },
  { id: 3, title: 'หมู่บ้านแม่กำปอง', location: 'เชียงใหม่', desc: 'หมู่บ้านท่องเที่ยวเชิงอนุรักษ์กลางหุบเขา อากาศเย็นสบาย', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { id: 4, title: 'เกาะพีพี', location: 'กระบี่', desc: 'สวรรค์แห่งทะเลอันดามัน น้ำทะเลใสและหาดทรายขาวละเอียด', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80' },
  { id: 5, title: 'อุทยานแห่งชาติประวัติศาสตร์สุโขทัย', location: 'สุโขทัย', desc: 'มรดกโลกทางวัฒนธรรม ชมโบราณสถานและสถาปัตยกรรมไทยโบราณ', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80' },
  { id: 6, title: 'เขาใหญ่', location: 'นครราชสีมา', desc: 'อุทยานแห่งชาติแห่งแรกของไทย อุดมสมบูรณ์ด้วยผืนป่าและสัตว์ป่า', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80' },
  { id: 7, title: 'เกาะเสม็ด', location: 'ระยอง', desc: 'หาดทรายแก้วสวยงาม ใกล้กรุงเทพฯ เหมาะกับการพักผ่อนวันหยุด', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80' },
  { id: 8, title: 'วัดอรุณราชวราราม', location: 'กรุงเทพมหานคร', desc: 'พระปรางค์ริมแม่น้ำเจ้าพระยาอันงดงามและทรงคุณค่าทางประวัติศาสตร์', img: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=600&q=80' },
  { id: 9, title: 'ปาย', location: 'แม่ฮ่องสอน', desc: 'เมืองเล็กๆ ในสายหมอก บรรยากาศเงียบสงบ วิวทิวทัศน์สวยงาม', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
  { id: 10, title: 'ตลาดน้ำดำเนินสะดวก', location: 'ราชบุรี', desc: 'สัมผัสวิถีชีวิตริมน้ำดั้งเดิม เลือกซื้อของกินและผลไม้สดๆ จากเรือ', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80' },
];

export default function AttractionSlider() {
  const sliderRef = useRef(null);

  // ฟังก์ชันเลื่อนการ์ด ซ้าย - ขวา
  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="slider-section">
      <div className="slider-header">
        <div>
          <h2 className="slider-title">สถานที่แนะนำ</h2>
          <p className="slider-subtitle">สถานที่ท่องเที่ยวยอดนิยมที่ไม่ควรพลาด</p>
        </div>

        {/* ปุ่มควบคุมการสไลด์ ซ้าย/ขวา */}
        <div className="slider-controls">
          <button className="control-btn" onClick={() => scroll('left')} aria-label="เลื่อนซ้าย">
            ❮
          </button>
          <button className="control-btn" onClick={() => scroll('right')} aria-label="เลื่อนขวา">
            ❯
          </button>
        </div>
      </div>

      {/* คอนเทนเนอร์การ์ดสไลด์ 10 ใบ */}
      <div className="slider-container" ref={sliderRef}>
        {mockAttractions.map((item) => (
          <div className="attraction-card" key={item.id}>
            <div className="card-image-wrapper">
              <img src={item.img} alt={item.title} className="card-img" />
              <button className="favorite-btn" aria-label="ถูกใจ">
                🤍
              </button>
            </div>
            <div className="card-content">
              <span className="card-location">📍 {item.location}</span>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-desc">{item.desc}</p>
              <a href={`#attraction-${item.id}`} className="card-link">
                ดูรายละเอียด →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}