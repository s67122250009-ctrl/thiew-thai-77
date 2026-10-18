import { Link } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import { useFavorites } from "../../hooks/useFavorites.jsx";
import "../styles/AttractionCard.css";

const BASE = import.meta.env.BASE_URL;
const PLACEHOLDER = `${BASE}images/placeholder.jpg`;

export default function AttractionCard({ attraction }) {
  const { language, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!attraction) return null;

  const id = attraction.attraction_id;
  const isEn = language === "en";
  const name = (isEn && attraction.name_en) || attraction.name_th || "";
  const desc = (isEn && attraction.description_en) || attraction.description_th || "";
  const prov = (isEn && attraction.province_en) || attraction.province_th || "";
  const detailPath = `/attractions/${id}`;
  const fav = isFavorite(id);

  // ลองนามสกุล .jpeg ก่อน แล้วใช้ placeholder ถ้าไม่มีไฟล์
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

  return (
    <article className="attraction-card">
      <div className="card-img-wrapper">
        <Link to={detailPath} className="card-img-link" aria-label={name}>
          <img
            src={attraction.image_thumbnail || PLACEHOLDER}
            alt={name}
            className="card-img"
            loading="lazy"
            onError={handleImgError}
          />
        </Link>
        <button
          type="button"
          className={`fav-badge-btn ${fav ? "is-active" : ""}`}
          aria-pressed={fav}
          aria-label={
            fav
              ? t("ลบออกจากรายการโปรด", "Remove from favorites")
              : t("เพิ่มในรายการโปรด", "Add to favorites")
          }
          onClick={() => toggleFavorite(id)}
        >
          {fav ? "♥" : "♡"}
        </button>
      </div>

      <div className="card-body">
        <div className="card-province">📍 {prov}</div>
        <h3 className="card-heading">
          <Link to={detailPath}>{name}</Link>
        </h3>
        <p className="card-desc">{desc}</p>
        <Link to={detailPath} className="card-action-link">
          {t("ดูรายละเอียด →", "View Details →")}
        </Link>
      </div>
    </article>
  );
}