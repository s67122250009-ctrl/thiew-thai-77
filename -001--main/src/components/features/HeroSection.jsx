import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/attractions");
  };

  return (
    <section className="hero-section">
      <p className="hero-subtitle-top">THAI 77 PROVINCES</p>
      <h1 className="hero-title">
        {t(
          "เที่ยวไทยให้ครบ ค้นพบสถานที่ที่ใช่ สำหรับคุณ",
          "Explore all of Thailand, find the right place for you"
        )}
      </h1>
      <p className="hero-description">
        {t(
          "ค้นหาสถานที่ตามจังหวัดหรือหมวดหมู่ บันทึกรายการโปรด และดูข้อมูลอย่างสะดวก",
          "Search places by province or category, save favorites, and browse with ease."
        )}
      </p>

      <form className="search-pill" onSubmit={submit} role="search">
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t("ค้นหาสถานที่ท่องเที่ยว, จังหวัด...", "Search attractions, provinces...")}
          aria-label={t("ค้นหาสถานที่ท่องเที่ยว", "Search attractions")}
        />
        <button type="submit">{t("ค้นหา", "Search")}</button>
      </form>
    </section>
  );
}