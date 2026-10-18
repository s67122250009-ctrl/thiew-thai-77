import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import EmptyState from "../common/EmptyState";
import { getProvinces, getAttractions } from "../../services/attractionService";
import "../styles/ProvinceList.css";

export default function ProvinceListPage() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getProvinces(), getAttractions()])
      .then(([provs, attractions]) => {
        if (!active) return;
        const countMap = {};
        attractions.forEach((a) => {
          countMap[a.province_id] = (countMap[a.province_id] || 0) + 1;
        });
        setProvinces(provs);
        setCounts(countMap);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const name = (p) => (language === "en" && p.name_en) || p.name_th || "";

  const keyword = query.trim().toLowerCase();
  const visible = keyword
    ? provinces.filter((p) =>
        [p.name_th, p.name_en].some((s) =>
          String(s || "").toLowerCase().includes(keyword)
        )
      )
    : provinces;

  return (
    <main className="page-with-nav province-page">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>
        ← {t("ย้อนกลับ", "Back")}
      </button>

      <header className="province-heading">
        <p className="eyebrow">PROVINCES</p>
        <h1>{t("จังหวัดทั้ง 77 จังหวัด", "All 77 provinces")}</h1>
        <p className="page-sub">
          {t("เลือกจังหวัดเพื่อดูสถานที่ท่องเที่ยว", "Choose a province to explore attractions.")}
        </p>
      </header>

      <div className="province-toolbar">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("ค้นหาจังหวัด...", "Search provinces...")}
          aria-label={t("ค้นหาจังหวัด", "Search provinces")}
        />
        {!loading && !error && (
          <span className="province-count">
            {t(`แสดง ${visible.length} จังหวัด`, `Showing ${visible.length} provinces`)}
          </span>
        )}
      </div>

      {loading ? (
        <p className="state-text">{t("กำลังโหลดข้อมูล...", "Loading...")}</p>
      ) : error ? (
        <EmptyState title={t("โหลดข้อมูลไม่ได้", "Could not load data")} message="" />
      ) : visible.length === 0 ? (
        <p className="state-text">
          {t("ไม่พบจังหวัดที่ค้นหา", "No provinces match your search")}
        </p>
      ) : (
        <div className="province-grid">
          {visible.map((p) => (
            <Link
              key={p.province_id}
              to={`/attractions?province_id=${p.province_id}`}
              className="province-tile"
            >
              <span className="province-tile__name">{name(p)}</span>
              <span className="province-tile__count">
                {counts[p.province_id] || 0} {t("สถานที่", "places")} ↗
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}