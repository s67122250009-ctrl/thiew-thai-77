import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import { getAttractionById } from "../../services/attractionService";
import { useFavorites } from "../../hooks/useFavorites.jsx";
import "../styles/DetailPage.css";

const PLACEHOLDER = `${import.meta.env.BASE_URL}images/placeholder.jpg`;

function handleImgError(e) {
  const img = e.currentTarget;
  if (!img.dataset.step && img.src.endsWith(".jpg")) {
    img.dataset.step = "1";
    img.src = img.src.replace(/\.jpg$/, ".jpeg");
    return;
  }
  img.onerror = null;
  img.src = PLACEHOLDER;
}

export default function AttractionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAttractionById(id)
      .then((data) => active && setAttraction(data))
      .catch((err) => console.error("โหลดรายละเอียดไม่สำเร็จ", err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page">
        <p>{t("กำลังโหลดข้อมูล...", "Loading...")}</p>
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="detail-page">
        <p>{t("ไม่พบสถานที่ท่องเที่ยวนี้", "Attraction not found")}</p>
      </div>
    );
  }

  const isEn = language === "en";
  const name = (isEn && attraction.name_en) || attraction.name_th;
  const province = (isEn && attraction.province_en) || attraction.province_th;
  const category = (isEn && attraction.category_en) || attraction.category_th;
  const desc = (isEn && attraction.description_en) || attraction.description_th;
  const history = (isEn && attraction.history_en) || attraction.history_th;
  const fav = isFavorite(attraction.attraction_id);

  return (
    <main className="detail-page">
      <button type="button" className="detail-back-btn" onClick={() => navigate(-1)}>
        ← {t("ย้อนกลับ", "Back")}
      </button>

      <article className="detail-card">
        <img
          className="detail-hero-img"
          src={attraction.image_detail}
          alt={name}
          onError={handleImgError}
        />

        <div className="detail-body">
          <h1 className="detail-title">{name}</h1>

          <div className="detail-meta">
            {province && <span>📍 {province}</span>}
            {category && <span>🏷 {category}</span>}
            <button
              type="button"
              className={`detail-fav-btn ${fav ? "is-active" : ""}`}
              aria-pressed={fav}
              onClick={() => toggleFavorite(attraction.attraction_id)}
            >
              {fav ? "♥" : "♡"}{" "}
              {fav
                ? t("ลบออกจากรายการโปรด", "Remove from favorites")
                : t("เพิ่มในรายการโปรด", "Add to favorites")}
            </button>
          </div>

          {desc && (
            <section className="detail-section">
              <h2>{t("รายละเอียด", "Description")}</h2>
              <p>{desc}</p>
            </section>
          )}

          {history && (
            <section className="detail-section">
              <h2>{t("ประวัติความเป็นมา", "History")}</h2>
              <p>{history}</p>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}