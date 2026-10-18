import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import { useFavorites } from "../../hooks/useFavorites.jsx";
import { getAttractions } from "../../services/attractionService";
import AttractionCard from "../common/AttractionCard";
import "../styles/FavoritesPage.css";

export default function FavoritesPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { favorites, clearFavorites } = useFavorites();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAttractions()
      .then((items) => active && setAll(items))
      .catch((err) => console.error("โหลดรายการโปรดไม่สำเร็จ", err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // คงลำดับตามที่กดบันทึก และกรองเฉพาะรายการที่ยังมีข้อมูล
  const items = favorites
    .map((id) => all.find((a) => String(a.attraction_id) === String(id)))
    .filter(Boolean);

  const handleClear = () => {
    if (window.confirm(t("ต้องการลบรายการโปรดทั้งหมดหรือไม่?", "Clear all favorites?"))) {
      clearFavorites();
    }
  };

  return (
    <main className="page-with-nav fav-page">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>
        ← {t("ย้อนกลับ", "Back")}
      </button>

      <header className="fav-header">
        <div>
          <p className="eyebrow">FAVORITES</p>
          <h1>{t("รายการโปรด", "Favorites")}</h1>
          <p className="page-sub">
            {t(`บันทึกไว้ ${items.length} สถานที่`, `${items.length} saved places`)}
          </p>
        </div>
        {items.length > 0 && (
          <button type="button" className="fav-clear-btn" onClick={handleClear}>
            {t("ลบทั้งหมด", "Clear all")}
          </button>
        )}
      </header>

      {loading ? (
        <p className="state-text">{t("กำลังโหลดข้อมูล...", "Loading...")}</p>
      ) : items.length === 0 ? (
        <div className="fav-empty">
          <div className="fav-empty__icon">♡</div>
          <h2>{t("ยังไม่มีรายการโปรด", "No favorites yet")}</h2>
          <p>
            {t(
              "กดปุ่มหัวใจบนสถานที่ท่องเที่ยวเพื่อบันทึกไว้ที่นี่",
              "Tap the heart on any place to save it here."
            )}
          </p>
          <Link to="/attractions" className="fav-empty__cta">
            {t("สำรวจสถานที่ท่องเที่ยว", "Explore attractions")}
          </Link>
        </div>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <AttractionCard key={item.attraction_id} attraction={item} />
          ))}
        </div>
      )}
    </main>
  );
}