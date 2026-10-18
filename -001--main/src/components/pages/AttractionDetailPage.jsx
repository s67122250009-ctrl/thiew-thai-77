import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../common/EmptyState";
import FavoriteButton from "../features/FavoriteButton";
import MapView from "../features/MapView";
import useLanguage from "../../context/LanguageContext";
import { getAttractionById } from "../../services/attractionService";
import { getImagePaths, nextImageSource } from "../../utils/imagePaths";

export default function AttractionDetailPage() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const [state, setState] = useState({ loading: true, item: null });

  useEffect(() => {
    let active = true;
    setState({ loading: true, item: null });
    getAttractionById(id).then((item) => { if (active) setState({ loading: false, item }); });
    return () => { active = false; };
  }, [id]);

  if (state.loading) return <div className="container page loading-state">{t("กำลังโหลดข้อมูล...", "Loading...")}</div>;
  if (!state.item) return <section className="container empty-page"><EmptyState title={t("ไม่พบสถานที่ท่องเที่ยว", "Attraction not found")} message="" action={{ to: "/attractions", label: t("กลับไปสถานที่ท่องเที่ยว", "Back to attractions") }} /></section>;

  const item = state.item;
  const attractionId = String(item.attraction_id || item.id || id);
  const imageSources = getImagePaths(item, "image_detail");
  const value = (th, en, legacy) => language === "en" ? (item[en] || item[th] || item[legacy] || "-") : (item[th] || item[legacy] || "-");

  return <div className="container page detail-page">
    <Link to="/attractions" className="back-link">← {t("กลับไปสถานที่ท่องเที่ยว", "Back to attractions")}</Link>
    <section className="detail-hero"><div className="detail-image-placeholder">{imageSources.length>0&&<img className="detail-image" src={imageSources[0]} alt={value("name_th","name_en")} data-source-index="0" onError={nextImageSource(imageSources)} />}<span className="detail-image-label" style={{display:imageSources.length?"none":"inline-flex"}}>{t("ยังไม่มีรูปภาพ", "No image available")}</span></div><div className="detail-summary"><p className="eyebrow">{value("province_th", "province_en", "province")}</p><h1>{value("name_th", "name_en")}</h1><p>{value("description_th", "description_en", "description")}</p><FavoriteButton attractionId={attractionId} label /></div></section>
    <section className="detail-content"><div className="detail-section"><h2>{t("ข้อมูลสถานที่", "Attraction information")}</h2><dl className="info-list"><div><dt>{t("จังหวัด", "Province")}</dt><dd>{value("province_th", "province_en", "province")}</dd></div><div><dt>{t("หมวดหมู่", "Category")}</dt><dd>{value("category_th", "category_en", "category")}</dd></div></dl></div><div className="detail-section"><h2>{t("คำอธิบาย", "Description")}</h2><p>{value("description_th", "description_en", "description")}</p></div><div className="detail-section"><h2>{t("ประวัติ / ความเป็นมา", "History")}</h2><p>{value("history_th", "history_en", "history")}</p></div><MapView attraction={item} /></section>
  </div>;
}
