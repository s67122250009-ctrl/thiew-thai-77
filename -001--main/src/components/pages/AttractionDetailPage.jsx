import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import * as FavoritesHook from "../../hooks/useFavorites.jsx";
import { getAttractionById, getProvince } from "../../services/attractionService";

const useFavorites = FavoritesHook.useFavorites || FavoritesHook.default;

export default function AttractionDetailPage() {
  const { id } = useParams();
  const { t, language } = useLanguage();

  // ดึง Context รายการโปรดอย่างปลอดภัย
  let favContext = {};
  try {
    if (typeof useFavorites === "function") {
      favContext = useFavorites() || {};
    }
  } catch (e) {
    console.warn("Favorites context warning:", e);
  }

  const { isFavorite, toggleFavorite } = favContext;

  const [attraction, setAttraction] = useState(null);
  const [province, setProvince] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getAttractionById(id).then((data) => {
        setAttraction(data);
        if (data?.province_id || data?.provinceId) {
          getProvince(data.province_id || data.provinceId).then(setProvince);
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container page" style={{ textAlign: "center", padding: "4rem" }}>
        {t("กำลังโหลดข้อมูล...", "Loading...")}
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="container page" style={{ textAlign: "center", padding: "4rem" }}>
        <h2>{t("ไม่พบสถานที่ท่องเที่ยว", "Attraction not found")}</h2>
        <Link to="/attractions" className="btn primary" style={{ marginTop: "1rem" }}>
          {t("กลับไปหน้าสถานที่ท่องเที่ยว", "Back to Attractions")}
        </Link>
      </div>
    );
  }

  const targetId = attraction.attraction_id || attraction.id || id;
  const fav = isFavorite ? isFavorite(targetId) : false;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const name =
    language === "en"
      ? attraction.name_en || attraction.name_th
      : attraction.name_th;
  const desc =
    language === "en"
      ? attraction.description_en || attraction.description_th
      : attraction.description_th;
  const provinceName = province
    ? language === "en"
      ? province.name_en || province.name_th
      : province.name_th
    : "";

  return (
    <div className="container page" style={{ paddingTop: "1.5rem" }}>
      {/* ปุ่มย้อนกลับ */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          to="/attractions"
          style={{
            color: "#2563eb",
            fontWeight: "500",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          ← {t("กลับไปสถานที่ท่องเที่ยว", "Back to attractions")}
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        {/* รูปภาพสถานที่ */}
        <div
          style={{
            height: "360px",
            backgroundColor: "#f1f5f9",
            borderRadius: "16px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            border: "1px solid #e2e8f0",
          }}
        >
          {attraction.cover_image ? (
            <img
              src={attraction.cover_image}
              alt={name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: "1rem" }}>
              📷 {t("ยังไม่มีรูปภาพ", "No image available")}
            </span>
          )}
        </div>

        {/* ข้อมูลรายละเอียด & ปุ่มการทำรายการ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {provinceName && (
            <span
              style={{
                display: "inline-block",
                padding: "0.35rem 0.85rem",
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "600",
                width: "fit-content",
              }}
            >
              {provinceName}
            </span>
          )}

          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: "700",
              color: "#0f172a",
              margin: 0,
              lineHeight: "1.2",
            }}
          >
            {name}
          </h1>

          <p
            style={{
              color: "#475569",
              lineHeight: "1.6",
              fontSize: "1.05rem",
              margin: 0,
            }}
          >
            {desc}
          </p>

          {/* กลุ่มปุ่มรายการโปรดและแชร์ */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginTop: "auto",
              paddingTop: "1.5rem",
            }}
          >
            {toggleFavorite && (
              <button
                type="button"
                onClick={() => toggleFavorite(attraction)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "10px",
                  border: fav ? "1px solid #fecdd3" : "1px solid #cbd5e1",
                  backgroundColor: fav ? "#ffe4e6" : "#ffffff",
                  color: fav ? "#e11d48" : "#334155",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                {fav
                  ? `❤️ ${t("บันทึกในรายการโปรดแล้ว", "Saved to Favorites")}`
                  : `🤍 ${t("เพิ่มรายการโปรด", "Add to Favorites")}`}
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1.25rem",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#e0e7ff",
                color: "#3730a3",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
              }}
            >
              🔗 {copied ? t("คัดลอกลิงก์แล้ว!", "Copied!") : t("แชร์สถานที่นี้", "Share this place")}
            </button>
          </div>
        </div>
      </div>

      {/* ส่วนประวัติ / ความเป็นมาเพิ่มเติม (ถ้ามี) */}
      {(attraction.history_th || attraction.history_en) && (
        <div
          style={{
            marginTop: "2.5rem",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "1.5rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.35rem",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "0.75rem",
            }}
          >
            {t("ประวัติ / ความเป็นมา", "History & Background")}
          </h3>
          <p style={{ color: "#334155", lineHeight: "1.7", fontSize: "1rem" }}>
            {language === "en"
              ? attraction.history_en || attraction.history_th
              : attraction.history_th}
          </p>
        </div>
      )}
    </div>
  );
}