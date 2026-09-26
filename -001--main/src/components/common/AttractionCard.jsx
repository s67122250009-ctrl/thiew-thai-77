import { Link } from "react-router-dom";
import useLanguage from "../../context/LanguageContext";
import { getProvince } from "../../services/attractionService";
import FavoriteButton from "../features/FavoriteButton";
import "../styles/AttractionCard.css";
export default function AttractionCard({attraction}){const {language,t}=useLanguage(), province=getProvince(attraction);return <article className="attraction-card"><div className="card-image-placeholder">{language==="en"?"Image coming soon":"ยังไม่มีรูปภาพ"}</div><div className="card-body"><div className="card-meta"><span>{province?.[language==="en"?"name_en":"name_th"]}</span><FavoriteButton attractionId={attraction.attraction_id}/></div><h3>{attraction[language==="en"?"name_en":"name_th"]}</h3><p>{attraction[language==="en"?"description_en":"description_th"]}</p><Link className="card-link" to={`/attractions/${attraction.attraction_id}`}>{t("ดูรายละเอียด →","View details →")}</Link></div></article>}
