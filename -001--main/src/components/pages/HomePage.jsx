import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "../common/SearchBar";
import AttractionCard from "../common/AttractionCard";
import EmptyState from "../common/EmptyState";
import useLanguage from "../../context/LanguageContext";
import { getAttractions, getProvinces } from "../../services/attractionService";
import { getImagePaths, nextImageSource } from "../../utils/imagePaths";
import "../styles/HomePage.css";

export default function HomePage() {
  const { language, t } = useLanguage();
  const [state, setState] = useState({
    loading: true,
    items: [],
    provinces: [],
    error: false,
  });

  useEffect(() => {
    Promise.all([getAttractions(), getProvinces()])
      .then(([items, provinces]) =>
        setState({ loading: false, items, provinces, error: false })
      )
      .catch(() =>
        setState((x) => ({ ...x, loading: false, error: true }))
      );
  }, []);

  // กรองสถานที่แนะนำ (รองรับทั้ง boolean true และ String "true")
  const featured = state.items.filter(
    (x) => x.is_featured === true || x.is_featured === "true"
  );
  const heroItem = featured[0];
  const heroImageSources = heroItem ? getImagePaths(heroItem, "image_detail") : [];

  return (
    <div className="page home-page">
      {/* Hero Section */}
      <section className="hero">
        {heroImageSources.length > 0 && <img className="hero-media" src={heroImageSources[0]} alt="" data-source-index="0" onError={nextImageSource(heroImageSources)} />}
        <div className="hero-overlay" />
        <div className="hero-content container">
          <p className="eyebrow">THAI 77 PROVINCES</p>
          <h1>
            {t(
              "เที่ยวไทยให้ครบ ค้นพบสถานที่ที่ใช่สำหรับคุณ",
              "Discover Thailand, one place at a time"
            )}
          </h1>
          <p className="hero-description">
            {t(
              "ค้นหาสถานที่ตามจังหวัดหรือหมวดหมู่ บันทึกรายการโปรด และดูข้อมูลอย่างสะดวก",
              "Search by province or category, save favorites, and explore details with ease."
            )}
          </p>
          <SearchBar />
          <p className="hero-note">
            {t(
              "เริ่มต้นการเดินทางด้วยการค้นหาสถานที่หรือเลือกดูจังหวัด",
              "Start your journey by searching for a place or browsing a province."
            )}
          </p>
        </div>
      </section>

      {/* Featured Section */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2>{t("สถานที่แนะนำ", "Featured attractions")}</h2>
            <p>
              {t(
                "สถานที่ท่องเที่ยวยอดนิยมที่ไม่ควรพลาด",
                "Must-visit popular attractions"
              )}
            </p>
          </div>
          <Link className="btn secondary" to="/attractions">
            {t("ดูทั้งหมด", "View all")}
          </Link>
        </div>

        {state.loading ? (
          <div className="loading-state">
            {t("กำลังโหลดข้อมูล...", "Loading...")}
          </div>
        ) : state.error ? (
          <EmptyState
            title={t("โหลดข้อมูลไม่ได้", "Could not load data")}
            message={t("กรุณาลองใหม่อีกครั้ง", "Please try again.")}
          />
        ) : featured.length ? (
          <div className="grid home-featured-grid">
            {featured.map((item) => (
              <AttractionCard
                key={item.attraction_id || item.id}
                attraction={item}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={t("ยังไม่มีสถานที่แนะนำ", "No featured attractions")}
            message={t(
              "ขณะนี้ยังไม่มีรายการสถานที่แนะนำ",
              "No featured items available right now."
            )}
          />
        )}
      </section>

      {/* Browse by Province Section */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2>{t("ค้นหาตามจังหวัด", "Browse by province")}</h2>
            <p>
              {state.provinces.length} {t("จังหวัด", "provinces")}
            </p>
          </div>
          <Link className="btn secondary" to="/provinces">
            {t("ดูจังหวัดทั้งหมด", "All provinces")}
          </Link>
        </div>

        <div className="province-grid home-province-grid">
          {state.provinces.slice(0, 12).map((p) => {
            const provinceId = p.province_id || p.id;
            return (
              <Link
                key={provinceId}
                to={`/attractions?province_id=${provinceId}`}
              >
                {p[language === "en" ? "name_en" : "name_th"]}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
