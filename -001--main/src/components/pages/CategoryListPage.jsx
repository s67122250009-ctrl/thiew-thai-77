import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import EmptyState from "../common/EmptyState";
import { getCategories, getAttractions } from "../../services/attractionService";

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

export default function CategoryListPage() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getCategories(), getAttractions()])
      .then(([cats, attractions]) => {
        if (!active) return;
        const countMap = {};
        attractions.forEach((a) => {
          countMap[a.category_id] = (countMap[a.category_id] || 0) + 1;
        });
        setCounts(countMap);
        setCategories(cats);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const name = (c) => (language === "en" && c.name_en) || c.name_th || "";

  return (
    <main className="page-with-nav">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>
        ← {t("ย้อนกลับ", "Back")}
      </button>

      <header className="page-heading">
        <p className="eyebrow">CATEGORIES</p>
        <h1>{t("ประเภทที่เที่ยว", "Travel categories")}</h1>
        <p className="page-sub">
          {t("เลือกประเภทเพื่อดูสถานที่ที่ตรงกับความสนใจ", "Pick a type to see matching places")}
        </p>
      </header>

      {loading ? (
        <p className="state-text">{t("กำลังโหลดข้อมูล...", "Loading...")}</p>
      ) : error ? (
        <EmptyState title={t("โหลดข้อมูลไม่ได้", "Could not load data")} message="" />
      ) : (
        <div className="category-card-grid">
          {categories.map((c, i) => (
            <Link
              key={c.category_id}
              to={`/attractions?category_id=${c.category_id}`}
              className="category-card-item"
            >
              <span
                className="category-icon-wrapper"
                style={{ background: TINTS[i % TINTS.length] }}
              >
                {ICONS[c.category_id] || "📍"}
              </span>
              <span className="category-name">{name(c)}</span>
              <span className="province-card-count">
                {counts[c.category_id] || 0} {t("สถานที่", "places")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}