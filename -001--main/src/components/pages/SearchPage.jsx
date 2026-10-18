import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import SearchBar from "../common/SearchBar";
import AttractionCard from "../common/AttractionCard";
import EmptyState from "../common/EmptyState";
import { searchAttractions } from "../../services/attractionService";
import "../styles/SearchPage.css";

export default function SearchPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();

  const [state, setState] = useState({ loading: Boolean(q), items: [], error: false });

  useEffect(() => {
    let active = true;
    if (!q) {
      setState({ loading: false, items: [], error: false });
      return;
    }
    setState((s) => ({ ...s, loading: true }));
    searchAttractions(q)
      .then((items) => active && setState({ loading: false, items, error: false }))
      .catch(() => active && setState({ loading: false, items: [], error: true }));
    return () => {
      active = false;
    };
  }, [q]);

  return (
    <main className="page-with-nav search-page">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>
        ← {t("ย้อนกลับ", "Back")}
      </button>

      <header className="search-heading">
        <p className="eyebrow">SEARCH</p>
        <h1>{t("ค้นหาสถานที่ท่องเที่ยว", "Search attractions")}</h1>
        <SearchBar initialValue={q} />
        {q && !state.loading && !state.error && (
          <p className="search-summary">
            {t(
              `ผลการค้นหา "${q}" พบ ${state.items.length} รายการ`,
              `Results for "${q}": ${state.items.length} found`
            )}
          </p>
        )}
      </header>

      {!q ? (
        <EmptyState
          title={t("เริ่มค้นหา", "Start searching")}
          message={t(
            "พิมพ์ชื่อสถานที่ จังหวัด หรือคำที่เกี่ยวข้องเพื่อค้นหา",
            "Search by place, province, or a related term."
          )}
        />
      ) : state.loading ? (
        <p className="state-text">{t("กำลังโหลดข้อมูล...", "Loading...")}</p>
      ) : state.error ? (
        <EmptyState title={t("โหลดข้อมูลไม่ได้", "Could not load data")} message="" />
      ) : state.items.length === 0 ? (
        <EmptyState
          title={t("ไม่พบผลการค้นหา", "No results")}
          message={t("ลองใช้คำค้นอื่น", "Try a different search term.")}
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