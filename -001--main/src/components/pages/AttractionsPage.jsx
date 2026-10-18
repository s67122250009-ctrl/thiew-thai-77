import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AttractionCard from "../common/AttractionCard";
import EmptyState from "../common/EmptyState";
import useLanguage from "../../context/LanguageContext";
import {
  getAttractions,
  getAttractionsByCategory,
  getAttractionsByProvince,
} from "../../services/attractionService";

export default function AttractionsPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const provinceId = searchParams.get("province_id");
  const categoryId = searchParams.get("category_id");

  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    let fetchPromise;

    if (provinceId) {
      fetchPromise = getAttractionsByProvince(provinceId);
    } else if (categoryId) {
      fetchPromise = getAttractionsByCategory(categoryId);
    } else {
      fetchPromise = getAttractions();
    }

    fetchPromise
      .then((data) => {
        setAttractions(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading attractions:", err);
        setError(true);
        setLoading(false);
      });
  }, [provinceId, categoryId]);

  return (
    <div className="page container listing-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">ATTRACTIONS</p>
          <h1>
            {t("สถานที่ท่องเที่ยวทั้งหมด", "All Attractions")}
          </h1>
          <p>
            {t("พบสถานที่ท่องเที่ยวทั้งหมด", "Found total")} {attractions.length}{" "}
            {t("แห่ง", "places")}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          {t("กำลังโหลดข้อมูล...", "Loading...")}
        </div>
      ) : error ? (
        <EmptyState
          title={t("เกิดข้อผิดพลาดในการโหลดข้อมูล", "Error loading data")}
          message={t("กรุณาลองใหม่อีกครั้ง", "Please try again.")}
        />
      ) : attractions.length === 0 ? (
        <EmptyState
          title={t("ไม่พบสถานที่ท่องเที่ยว", "No attractions found")}
          message={t("ยังไม่มีสถานที่ท่องเที่ยวในหมวดหมู่นี้", "No items available in this section.")}
        />
      ) : (
        /* กล่อง Grid สำหรับจัดวางการ์ดให้ขนานเป็นตาราง 3-4 คอลัมน์ */
        <div className="grid">
          {attractions.map((item) => (
            <AttractionCard key={item.attraction_id || item.id} attraction={item} />
          ))}
        </div>
      )}
    </div>
  );
}
