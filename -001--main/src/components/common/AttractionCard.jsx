import { Link } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import useFavorites from "../../hooks/useFavorites.jsx";

export default function AttractionCard({ attraction }) {
  const { t, language } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!attraction) return null;

  const id = attraction.attraction_id || attraction.id;
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
    <div
      className="attraction-card"
      style={{
        backgroundColor: "var(--bg-card)",
        borderRadius: "12px",
        border: "1px solid var(--border-color)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* รูปภาพ */}
      <div
        style={{
          height: "190px",
          backgroundColor: "var(--primary-light)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-sub)",
        }}
      >
        {attraction.cover_image ? (
          <img
            src={attraction.cover_image}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: "0.875rem" }}>
            📷 {t("ยังไม่มีรูปภาพ", "No image available")}
          </span>
        )}

        {/* ปุ่มหัวใจรายการโปรด */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(attraction);
          }}
          title={t("รายการโปรด", "Favorites")}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
          }}
        >
          {fav ? "❤️" : "🤍"}
        </button>
      </div>

      {/* เนื้อหาการ์ด */}
      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          flex: 1,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1.1rem",
            fontWeight: "700",
            color: "var(--text-main)",
          }}
        >
          {name}
        </h3>

        <p
          style={{
            margin: 0,
            color: "var(--text-sub)",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {desc}
        </p>

        <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
          <Link
            to={`/attractions/${id}`}
            className="btn primary"
            style={{
              display: "block",
              textAlign: "center",
              padding: "0.65rem 1rem",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: "600",
            }}
          >
            {t("ดูรายละเอียด", "View details")} →
          </Link>
        </div>
      </div>
    </div>
  );
}