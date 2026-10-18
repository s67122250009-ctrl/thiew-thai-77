import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import { getProvinces, getAttractions } from "../../services/attractionService";

export default function ProvinceGrid() {
  const { language, t } = useLanguage();
  const [provinces, setProvinces] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getProvinces(), getAttractions()])
      .then(([provs, attractions]) => {
        if (!active) return;
        const countMap = {};
        attractions.forEach((a) => {
          countMap[a.province_id] = (countMap[a.province_id] || 0) + 1;
        });
        setProvinces(provs);
        setCounts(countMap);
      })
      .catch((err) => console.error("โหลดจังหวัดไม่สำเร็จ", err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // แสดงเฉพาะจังหวัดที่มีสถานที่ เรียงจากมากไปน้อย แล้วจำกัดจำนวนบนหน้าแรก
  const featured = provinces
    .filter((p) => (counts[p.province_id] || 0) > 0)
    .sort((a, b) => (counts[b.province_id] || 0) - (counts[a.province_id] || 0))
    .slice(0, 8);

  const name = (p) => (language === "en" && p.name_en) || p.name_th || "";

  return (
    <section className="section-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">{t("ค้นหาตามจังหวัด", "Browse by province")}</h2>
          <p className="section-subtitle">
            {t("เลือกจุดหมายปลายทางจาก 77 จังหวัดทั่วไทย", "Pick a destination from 77 provinces")}
          </p>
        </div>
        <Link to="/provinces" className="pill-btn">
          {t("ดูจังหวัดทั้งหมด 77 จังหวัด →", "View all 77 provinces →")}
        </Link>
      </div>

      {loading ? (
        <p className="state-text">{t("กำลังโหลดข้อมูล...", "Loading...")}</p>
      ) : (
        <div className="province-card-grid">
          {featured.map((p) => (
            <Link
              key={p.province_id}
              to={`/attractions?province_id=${p.province_id}`}
              className="province-card-item"
            >
              <span className="province-card-name">{name(p)}</span>
              <span className="province-card-count">
                {counts[p.province_id]} {t("สถานที่", "places")} ↗
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}