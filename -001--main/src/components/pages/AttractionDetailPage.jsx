import { Link } from "react-router-dom";
import AttractionCard from "../common/AttractionCard";
import useLanguage from "../../context/LanguageContext";
import useFavorites from "../../hooks/useFavorites.jsx";

export default function FavoritesPage() {
  const { t } = useLanguage();
  const { favorites, clearFavorites } = useFavorites();

  // กรองเฉพาะรายการที่เป็น Object สถานที่ท่องเที่ยวที่มีข้อมูลสมบูรณ์
  const validFavorites = Array.isArray(favorites)
    ? favorites.filter(
        (item) => item && typeof item === "object" && (item.name_th || item.name_en)
      )
    : [];

  return (
    <div className="container page" style={{ paddingTop: "1.5rem" }}>
      {/* ส่วนหัวแสดงชื่อหน้าและจำนวนรายการ */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "1.5rem",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "1rem",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "700",
              letterSpacing: "0.05em",
              color: "#64748b",
              textTransform: "uppercase",
            }}
          >
            FAVORITES
          </span>
          <h1
            style={{
              fontSize: "1.85rem",
              fontWeight: "700",
              color: "#0f172a",
              margin: "0.25rem 0 0 0",
            }}
          >
            {t("รายการโปรด", "My Favorites")}
          </h1>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0 0", fontSize: "0.95rem" }}>
            {t("บันทึกไว้", "Saved")} {validFavorites.length} {t("สถานที่", "places")}
          </p>
        </div>

        {validFavorites.length > 0 && (
          <button
            type="button"
            onClick={clearFavorites}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              color: "#ef4444",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            🗑️ {t("ล้างรายการโปรดทั้งหมด", "Clear all")}
          </button>
        )}
      </div>

      {/* ถ้ายังไม่มีรายการโปรด */}
      {validFavorites.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3.5rem 1rem",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            marginTop: "1rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❤️</div>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "0.5rem",
            }}
          >
            {t("ยังไม่มีรายการโปรด", "No favorite attractions yet")}
          </h3>
          <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            {t(
              "กดปุ่มหัวใจบนสถานที่ท่องเที่ยวเพื่อบันทึกไว้ที่นี่",
              "Click the heart icon on any attraction to save it here"
            )}
          </p>
          <Link
            to="/attractions"
            style={{
              display: "inline-block",
              padding: "0.65rem 1.35rem",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            {t("สำรวจสถานที่ท่องเที่ยว", "Explore Attractions")} →
          </Link>
        </div>
      ) : (
        /* แสดงรายการโปรดเป็นตาราง Grid การ์ด */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {validFavorites.map((item) => (
            <AttractionCard
              key={item.attraction_id || item.id || Math.random()}
              attraction={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}