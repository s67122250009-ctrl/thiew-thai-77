import fs from "node:fs";
import path from "node:path";

const DATA_PATH = path.resolve("./src/data/master-data.fixed.json");

const nameFixes = {
  "157": { name_en: "Sukhothai Historical Park", lat: 17.0207, lng: 99.7037 },
  "021": { name_en: "Phu Soi Dao National Park", lat: 17.6972, lng: 100.9961 },
  "022": { name_en: "Sirikit Dam", lat: 17.7633, lng: 100.5622 },
  "023": { name_en: "Khao Yai National Park", lat: 14.4392, lng: 101.3722 },
  "025": { name_en: "Phra Mahathat Kaen Nakhon (Wat Nong Wang)", lat: 16.4139, lng: 102.8361 },
};

const regionMap = {
  "กรุงเทพมหานคร": { th: "ภาคกลาง", en: "Central Thailand" },
  "เชียงใหม่": { th: "ภาคเหนือ", en: "Northern Thailand" },
  "สุโขทัย": { th: "ภาคเหนือ", en: "Northern Thailand" },
  "อุตรดิตถ์": { th: "ภาคเหนือ", en: "Northern Thailand" },
  "นครราชสีมา": { th: "ภาคตะวันออกเฉียงเหนือ", en: "Northeastern Thailand" },
  "ขอนแก่น": { th: "ภาคตะวันออกเฉียงเหนือ", en: "Northeastern Thailand" },
  "ภูเก็ต": { th: "ภาคใต้", en: "Southern Thailand" },
  "ชลบุรี": { th: "ภาคตะวันออก", en: "Eastern Thailand" },
  "กาญจนบุรี": { th: "ภาคตะวันตก", en: "Western Thailand" },
};

function fixMasterData() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error("❌ ไม่พบไฟล์ข้อมูลที่: - fix-master-data.mjs:28", DATA_PATH);
    return;
  }

  const rawData = fs.readFileSync(DATA_PATH, "utf-8");
  const data = JSON.parse(rawData);

  data.attractions = (data.attractions || []).map((item) => {
    const idStr = String(item.attraction_id || item.id || "").padStart(3, "0");

    const image_thumbnail =
      item.image_thumbnail || `/images/thumbnails/attraction_${idStr}_thumb.webp`;
    const image_detail =
      item.image_detail || `/images/details/attraction_${idStr}_detail.webp`;

    const fix = nameFixes[idStr] || {};
    const name_en = fix.name_en || item.name_en;
    const latitude = fix.lat ?? item.latitude ?? null;
    const longitude = fix.lng ?? item.longitude ?? null;

    return {
      ...item,
      attraction_id: idStr,
      name_en,
      image_thumbnail,
      image_detail,
      latitude,
      longitude,
    };
  });

  data.provinces = (data.provinces || []).map((prov) => {
    const reg = regionMap[prov.name_th] || { th: "ภาคกลาง", en: "Central Thailand" };

    return {
      ...prov,
      region_th: prov.region_th || reg.th,
      region_en: prov.region_en || reg.en,
      description_th: prov.description_th || `จังหวัด${prov.name_th} แหล่งท่องเที่ยวยอดนิยม`,
      description_en: prov.description_en || `Travel and explore ${prov.name_en}`,
    };
  });

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
  console.log("✅ แก้ไขและบันทึกข้อมูลลง masterdata.fixed.json เรียบร้อยแล้ว! - fix-master-data.mjs:72");
}

fixMasterData();