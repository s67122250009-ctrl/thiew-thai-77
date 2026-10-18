import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import "../styles/Navbar.css";

export default function Navbar() {
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
  const links = [["/", t("หน้าแรก", "Home")], ["/provinces", t("จังหวัด", "Provinces")], ["/categories", t("หมวดหมู่", "Categories")], ["/attractions", t("สถานที่ท่องเที่ยว", "Attractions")], ["/favorites", t("รายการโปรด", "Favorites")]];
  return <header className={`site-header ${isHome ? "site-header--home" : ""} ${scrolled ? "is-scrolled" : ""}`}><div className="site-nav container"><Link to="/" className="site-brand"><span className="site-brand__mark">TH</span><span>{t("เที่ยวไทย 77", "Thiew Thai 77")}</span></Link><nav className="site-nav__links">{links.map(([to,label])=><NavLink key={to} to={to} end={to==="/"}>{label}</NavLink>)}</nav><div className="language-toggle"><button type="button" className={language==="th"?"is-active":""} onClick={()=>setLanguage("th")}>TH</button><button type="button" className={language==="en"?"is-active":""} onClick={()=>setLanguage("en")}>EN</button></div></div></header>;
}
