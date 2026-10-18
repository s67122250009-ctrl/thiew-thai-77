import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";

export default function Navbar({ onOpenMenu }) {
  const { language, setLanguage, t } = useLanguage();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  return (
    <header
      className={`site-header ${isHome ? "site-header--home" : ""} ${
        scrolled ? "is-scrolled" : ""
      }`}
    >
      <div className="site-nav container">
        <Link to="/" className="site-brand">
          <span className="site-brand__mark">TH</span>
          <span>{t("เที่ยวไทย 77", "Thiew Thai 77")}</span>
        </Link>

        <div className="site-nav__actions">
          <div className="language-toggle">
            <button
              type="button"
              className={language === "th" ? "is-active" : ""}
              onClick={() => setLanguage("th")}
            >
              TH
            </button>
            <button
              type="button"
              className={language === "en" ? "is-active" : ""}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            className="menu-toggle"
            onClick={onOpenMenu}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}