import { useEffect, useState } from "react";
import { NavLink, useSearchParams, useLocation } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import { getCategories } from "../../services/attractionService";
import "../styles/MenuOverlay.css";

export default function MenuOverlay({ isOpen, onClose }) {
  const { t, language } = useLanguage();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const activeCategory = params.get("category_id");

  useEffect(() => {
    if (!isOpen || categories.length > 0) return;
    getCategories()
      .then(setCategories)
      .catch((err) => console.error("โหลดหมวดหมู่ไม่สำเร็จ", err));
  }, [isOpen, categories.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const name = (c) => (language === "en" && c.name_en) || c.name_th || "";

  const mainLinks = [
    { to: "/provinces", th: "จังหวัด (77 จังหวัด)", en: "Provinces (77)" },
    { to: "/attractions", th: "สถานที่ท่องเที่ยวทั้งหมด", en: "All attractions" },
    { to: "/favorites", th: "รายการโปรด", en: "Favorites" },
  ];

  return (
    <div className="menu-overlay" onClick={onClose} role="presentation">
      <nav
        className="menu-panel"
        onClick={(e) => e.stopPropagation()}
        aria-label={t("เมนูหลัก", "Main menu")}
      >
        <div className="menu-panel__head">
          <span className="menu-panel__brand">
            <span className="menu-panel__dot" />
            {t("เที่ยวไทย 77", "Thiew Thai 77")}
          </span>
          <button type="button" className="menu-close" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        <section className="menu-section">
          <h3 className="menu-title">{t("เมนูหลัก", "Main")}</h3>
          {mainLinks.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => `menu-card ${isActive ? "is-active" : ""}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="menu-card__text">{language === "en" ? link.en : link.th}</span>
              <span className="menu-card__arrow">›</span>
            </NavLink>
          ))}
        </section>

        <section className="menu-section">
          <h3 className="menu-title">{t("หมวดหมู่", "Categories")}</h3>
          {categories.map((c, i) => {
            const isActive = pathname === "/attractions" && activeCategory === c.category_id;
            return (
              <NavLink
                key={c.category_id}
                to={`/attractions?category_id=${c.category_id}`}
                onClick={onClose}
                className={`menu-card ${isActive ? "is-active" : ""}`}
                style={{ animationDelay: `${(mainLinks.length + i) * 60}ms` }}
              >
                <span className="menu-card__text">{name(c)}</span>
                <span className="menu-card__arrow">›</span>
              </NavLink>
            );
          })}
        </section>
      </nav>
    </div>
  );
}