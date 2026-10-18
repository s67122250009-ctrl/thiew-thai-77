import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import { getAttractions } from "../../services/attractionService";

const ICONS = {
  category_beach: "🌊",
  category_nature: "🌲",
  category_temple: "🛕",
  category_historical: "🏛️",
  category_community: "🏘️",
  category_museum: "🖼️",
  category_other: "📍",
};

const TINTS = ["#dbeafe", "#dcfce7", "#fef9c3", "#fee2e2", "#ede9fe", "#ffedd5", "#e0f2fe"];

export default function CategoryGrid() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAttractions()
      .then((attractions) => {
        if (!active) return;
        const map = new Map();
        attractions.forEach((a) => {
          if (!a.category_id) return;
          if (!map.has(a.category_id)) {
            map.set(a.category_id, {
              id: a.category_id,
              th: a.category_th,
              en: a.category_en,
              count: 0,
            });
          }
          map.get(a.category_id).count += 1;
        });
        setCategories([...map.values()].sort((x, y) => y.count - x.count));
      })
      .catch((err) => console.error("โหลดหมวดหมู่ไม่สำเร็จ", err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const go = (id) => navigate(`/attractions?category_id=${encodeURIComponent(id)}`);

  return (
    <section className="section-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">{t("ประเภทที่เที่ยว", "Categories")}</h2>
          <p className="section-subtitle">
            {t("ค้นหาสถานที่ตามสไตล์ที่คุณชอบ", "Find places by the style you like")}
          </p>
        </div>
        <button type="button" className="pill-btn" onClick={() => navigate("/categories")}>
          {t("ดูทุกหมวดหมู่ →", "View all categories →")}
        </button>
      </div>

      {loading ? (
        <p className="state-text">{t("กำลังโหลดข้อมูล...", "Loading...")}</p>
      ) : (
        <div className="category-card-grid">
          {categories.map((c, i) => {
            const name = (language === "en" && c.en) || c.th;
            return (
              <button
                key={c.id}
                type="button"
                className="category-card-item"
                onClick={() => go(c.id)}
              >
                <span
                  className="category-icon-wrapper"
                  style={{ background: TINTS[i % TINTS.length] }}
                >
                  {ICONS[c.id] || "📍"}
                </span>
                <span className="category-name">{name}</span>
                <span className="province-card-count">
                  {c.count} {t("สถานที่", "places")}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}