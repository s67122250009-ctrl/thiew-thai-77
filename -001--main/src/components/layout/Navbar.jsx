import { Link, NavLink } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
        }}
      >
        {/* โลโก้แอป */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "1.2rem",
            color: "#0f172a",
          }}
        >
          <span
            style={{
              backgroundColor: "#0f172a",
              color: "#ffffff",
              padding: "0.2rem 0.5rem",
              borderRadius: "6px",
              fontSize: "0.85rem",
              fontWeight: "800",
            }}
          >
            TH
          </span>
          {t("เที่ยวไทย 77", "Thiew Thai 77")}
        </Link>

        {/* เมนูนำทาง */}
        <nav style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              textDecoration: "none",
              fontWeight: isActive ? "600" : "500",
              color: isActive ? "#2563eb" : "#475569",
              padding: "0.4rem 0.75rem",
              borderRadius: "8px",
              backgroundColor: isActive ? "#eff6ff" : "transparent",
            })}
          >
            {t("หน้าแรก", "Home")}
          </NavLink>
          <NavLink
            to="/provinces"
            style={({ isActive }) => ({
              textDecoration: "none",
              fontWeight: isActive ? "600" : "500",
              color: isActive ? "#2563eb" : "#475569",
              padding: "0.4rem 0.75rem",
              borderRadius: "8px",
              backgroundColor: isActive ? "#eff6ff" : "transparent",
            })}
          >
            {t("จังหวัด", "Provinces")}
          </NavLink>
          <NavLink
            to="/categories"
            style={({ isActive }) => ({
              textDecoration: "none",
              fontWeight: isActive ? "600" : "500",
              color: isActive ? "#2563eb" : "#475569",
              padding: "0.4rem 0.75rem",
              borderRadius: "8px",
              backgroundColor: isActive ? "#eff6ff" : "transparent",
            })}
          >
            {t("หมวดหมู่", "Categories")}
          </NavLink>
          <NavLink
            to="/attractions"
            style={({ isActive }) => ({
              textDecoration: "none",
              fontWeight: isActive ? "600" : "500",
              color: isActive ? "#2563eb" : "#475569",
              padding: "0.4rem 0.75rem",
              borderRadius: "8px",
              backgroundColor: isActive ? "#eff6ff" : "transparent",
            })}
          >
            {t("สถานที่ท่องเที่ยว", "Attractions")}
          </NavLink>
          <NavLink
            to="/favorites"
            style={({ isActive }) => ({
              textDecoration: "none",
              fontWeight: isActive ? "600" : "500",
              color: isActive ? "#2563eb" : "#475569",
              padding: "0.4rem 0.75rem",
              borderRadius: "8px",
              backgroundColor: isActive ? "#eff6ff" : "transparent",
            })}
          >
            {t("รายการโปรด", "Favorites")}
          </NavLink>
        </nav>

        {/* ปุ่มสลับภาษา (Language Switcher) */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "#f1f5f9",
            padding: "3px",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
          }}
        >
          <button
            type="button"
            onClick={() => setLanguage("th")}
            style={{
              padding: "4px 12px",
              fontSize: "0.85rem",
              fontWeight: "600",
              border: "none",
              backgroundColor: language === "th" ? "#2563eb" : "transparent",
              color: language === "th" ? "#ffffff" : "#64748b",
              borderRadius: "16px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow:
                language === "th"
                  ? "0 2px 4px rgba(37, 99, 235, 0.2)"
                  : "none",
            }}
          >
            TH
          </button>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            style={{
              padding: "4px 12px",
              fontSize: "0.85rem",
              fontWeight: "600",
              border: "none",
              backgroundColor: language === "en" ? "#2563eb" : "transparent",
              color: language === "en" ? "#ffffff" : "#64748b",
              borderRadius: "16px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow:
                language === "en"
                  ? "0 2px 4px rgba(37, 99, 235, 0.2)"
                  : "none",
            }}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}