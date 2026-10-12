import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import { 
  getAttractions, 
  getAttractionsByProvince, 
  getAttractionsByCategory 
} from "../../services/attractionService";
import FavoriteButton from "../features/FavoriteButton";
import EmptyState from "../common/EmptyState";
import "../styles/AttractionsPage.css";

export default function AttractionsPage() {
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguage();

  // ดึงค่า province_id หรือ province จาก URL
  const provinceId = searchParams.get("province_id") || searchParams.get("province");
  const categoryId = searchParams.get("category_id") || searchParams.get("category");

  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let data = [];
        if (provinceId) {
          // ดึงเฉพาะสถานที่ในจังหวัดที่เลือกจาก Neon
          data = await getAttractionsByProvince(provinceId);
        } else if (categoryId) {
          // ดึงเฉพาะสถานที่ในหมวดหมู่ที่เลือก
          data = await getAttractionsByCategory(categoryId);
        } else {
          // ดึงสถานที่ท่องเที่ยวทั้งหมด
          data = await getAttractions();
        }
        setAttractions(data || []);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        setAttractions([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [provinceId, categoryId]);

  if (loading) {
    return (
      <div className="container page loading-state">
        {t("กำลังโหลดข้อมูล...", "Loading attractions...")}
      </div>
    );
  }

  return (
    <div className="page container attractions-page">
      <header className="page-header">
        <h1>{t("สถานที่ท่องเที่ยวทั้งหมด", "All Attractions")}</h1>
        <p>
          {t(
            `พบสถานที่ท่องเที่ยวทั้งหมด ${attractions.length} แห่ง`,
            `Found ${attractions.length} attractions`
          )}
        </p>
      </header>

      {attractions.length === 0 ? (
        <EmptyState
          title={t("ไม่พบสถานที่ท่องเที่ยว", "No attractions found")}
          message={t(
            "ไม่พบข้อมูลสถานที่ท่องเที่ยวตรงตามเงื่อนไขที่เลือก",
            "No attractions matched your filter criteria."
          )}
        />
      ) : (
        <div className="attraction-grid">
          {attractions.map((item) => (
            <div key={item.attraction_id} className="attraction-card">
              <div className="card-image-placeholder">
                {t("ยังไม่มีรูปภาพ", "Image coming soon")}
              </div>
              <div className="card-content">
                <h3>{item[language === "en" ? "name_en" : "name_th"]}</h3>
                <p className="card-description">
                  {item[language === "en" ? "description_en" : "description_th"]}
                </p>
                <div className="card-actions">
                  <Link
                    to={`/attractions/${item.attraction_id}`}
                    className="btn primary"
                  >
                    {t("ดูรายละเอียด", "View Details")}
                  </Link>
                  <FavoriteButton attractionId={item.attraction_id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}