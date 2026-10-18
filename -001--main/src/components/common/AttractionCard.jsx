import { Link } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import useFavorites from "../../hooks/useFavorites.jsx";
import { getImagePaths, nextImageSource } from "../../utils/imagePaths";
import "../styles/AttractionCard.css";

export default function AttractionCard({ attraction }) {
  const { t, language } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!attraction) return null;

  const id = attraction.attraction_id || attraction.id;
  const imageSources = getImagePaths(attraction, "image_thumbnail");
  const fav = isFavorite(attraction);

  const name =
    language === "en"
      ? attraction.name_en || attraction.name_th
      : attraction.name_th;
  const desc =
    language === "en"
      ? attraction.description_en || attraction.description_th
      : attraction.description_th;

  return (
    <div className="attraction-card">
      {/* รูปภาพ */}
      <div className="attraction-card__placeholder">
        {imageSources.length > 0 && <img className="attraction-card__image" src={imageSources[0]} alt={name} data-source-index="0" onError={nextImageSource(imageSources)} />}
        <span className="attraction-card__placeholder-label" style={{ display: imageSources.length ? "none" : "inline-flex" }}>
          {t("ยังไม่มีรูปภาพ", "No image available")}
        </span>

        {/* ปุ่มหัวใจรายการโปรด */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(attraction);
          }}
          title={t("รายการโปรด", "Favorites")}
          className="attraction-card__favorite"
        >
          {fav ? "❤️" : "🤍"}
        </button>
      </div>

      {/* เนื้อหาการ์ด */}
      <div className="attraction-card__body">
        <h3 className="attraction-card__title">{name}</h3>

        <p className="attraction-card__description">{desc}</p>

        <Link to={`/attractions/${id}`} className="attraction-card__link">
          {t("ดูรายละเอียด", "View details")} →
        </Link>
      </div>
    </div>
  );
}
