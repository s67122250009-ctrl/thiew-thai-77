import { useRef } from "react";
import { Link } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";

const PLACEHOLDER = `${import.meta.env.BASE_URL}images/placeholder.jpg`;

function handleImgError(e) {
  const img = e.currentTarget;
  if (!img.dataset.step && img.src.endsWith(".jpg")) {
    img.dataset.step = "1";
    img.src = img.src.replace(/\.jpg$/, ".jpeg");
    return;
  }
  img.onerror = null;
  img.src = PLACEHOLDER;
}

export default function AttractionSlider({ items = [], loading = false }) {
  const { language, t } = useLanguage();
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  const featured = items.slice(0, 12);

  return (
    <section className="section-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            {t("สถานที่แนะนำ", "Featured attractions")}
          </h2>
          <p className="section-subtitle">
            {t("สถานที่ท่องเที่ยวยอดนิยมที่ไม่ควรพลาด", "Popular places you shouldn't miss")}
          </p>
        </div>
        <div className="slider-controls">
          <button type="button" className="arrow-btn" onClick={() => scrollBy(-1)} aria-label="Previous">
            ‹
          </button>
          <button type="button" className="arrow-btn" onClick={() => scrollBy(1)} aria-label="Next">
            ›
          </button>
        </div>
      </div>

      {loading ? (
        <p className="state-text">{t("กำลังโหลดข้อมูล...", "Loading...")}</p>
      ) : featured.length === 0 ? (
        <p className="state-text">{t("ไม่พบข้อมูลสถานที่ท่องเที่ยว", "No attractions found")}</p>
      ) : (
        <div className="slider-track" ref={trackRef}>
          {featured.map((item) => {
            const name = (language === "en" && item.name_en) || item.name_th;
            const prov = (language === "en" && item.province_en) || item.province_th;
            const desc = (language === "en" && item.description_en) || item.description_th;
            const img = item.image_thumbnail || PLACEHOLDER;

            return (
              <article key={item.attraction_id} className="attraction-card">
                <Link to={`/attractions/${item.attraction_id}`} className="card-img-wrapper">
                  <img
                    src={img}
                    alt={name}
                    className="card-img"
                    loading="lazy"
                    onError={handleImgError}
                  />
                </Link>
                <div className="card-body">
                  <span className="card-province">📍 {prov}</span>
                  <h3 className="card-heading">
                    <Link to={`/attractions/${item.attraction_id}`}>{name}</Link>
                  </h3>
                  <p className="card-desc">{desc}</p>
                  <Link to={`/attractions/${item.attraction_id}`} className="card-action-link">
                    {t("ดูรายละเอียด →", "View Details →")}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}