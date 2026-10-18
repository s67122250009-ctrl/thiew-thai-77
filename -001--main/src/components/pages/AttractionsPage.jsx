import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const provinceId = params.get("province_id") || "";
  const categoryId = params.get("category_id") || "";

  const [state, setState] = useState({ loading: true, items: [], error: false });

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true }));

    const request = provinceId
      ? getAttractionsByProvince(provinceId)
      : categoryId
      ? getAttractionsByCategory(categoryId)
      : getAttractions();

    request
      .then((items) => active && setState({ loading: false, items, error: false }))
      .catch(() => active && setState({ loading: false, items: [], error: true }));

    return () => {
      active = false;
    };
  }, [provinceId, categoryId]);

  return (
    <main className="page-with-nav">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>
        ← {t("ย้อนกลับ", "Back")}
      </button>

      <header className="page-heading">
        <p className="eyebrow">ATTRACTIONS</p>
        <h1>{t("สถานที่ท่องเที่ยวทั้งหมด", "All attractions")}</h1>
        {!state.loading && !state.error && (
          <p className="page-sub">
            {t(`พบสถานที่ท่องเที่ยว ${state.items.length} แห่ง`, `Found ${state.items.length} places`)}
          </p>
        )}
      </header>

      {state.loading ? (
        <p className="state-text">{t("กำลังโหลดข้อมูล...", "Loading...")}</p>
      ) : state.error ? (
        <EmptyState
          title={t("โหลดข้อมูลไม่ได้", "Could not load data")}
          message=""
        />
      ) : state.items.length === 0 ? (
        <EmptyState
          title={t("ไม่พบสถานที่", "No attractions found")}
          message={t("ลองเลือกจังหวัดหรือหมวดหมู่อื่น", "Try another province or category.")}
          action={{ to: "/attractions", label: t("ดูทั้งหมด", "View all") }}
        />
      ) : (
        <div className="grid">
          {state.items.map((item) => (
            <AttractionCard key={item.attraction_id} attraction={item} />
          ))}
        </div>
      )}
    </main>
  );
}