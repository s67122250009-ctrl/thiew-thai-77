import { ref, get } from "firebase/database";
import { db } from "../firebase";

const BASE = import.meta.env.BASE_URL;
let cache = null;

// อ่านข้อมูลทั้งหมดจาก Realtime Database ครั้งเดียว แล้วเก็บไว้ในแคช
async function loadData() {
  if (!cache) {
    const snapshot = await get(ref(db));
    if (!snapshot.exists()) throw new Error("ไม่พบข้อมูลในฐานข้อมูล");
    cache = snapshot.val();
  }
  return cache;
}

// Realtime Database เก็บ array เป็น object ที่มีคีย์เป็นตัวเลข จึงแปลงกลับเป็น array
function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : Object.values(value);
}

function addImages(item) {
  const id = String(item.attraction_id).padStart(3, "0");
  const src = `${BASE}images/attraction_${id}.jpg`;
  return { ...item, image_thumbnail: src, image_detail: src };
}

export async function getAttractions() {
  const data = await loadData();
  return toArray(data.data).map(addImages);
}

export async function getProvinces() {
  const data = await loadData();
  return toArray(data.provinces);
}

export async function getCategories() {
  const data = await loadData();
  return toArray(data.categories);
}

export async function getAttractionById(id) {
  const attractions = await getAttractions();
  return attractions.find((item) => String(item.attraction_id) === String(id)) || null;
}

export async function getAttractionsByCategory(categoryId) {
  const attractions = await getAttractions();
  if (!categoryId) return attractions;
  return attractions.filter((item) => String(item.category_id) === String(categoryId));
}

export async function getAttractionsByProvince(provinceId) {
  const attractions = await getAttractions();
  if (!provinceId) return attractions;
  return attractions.filter((item) => String(item.province_id) === String(provinceId));
}

export async function searchAttractions(keyword = "") {
  const attractions = await getAttractions();
  const q = String(keyword).trim().toLowerCase();
  if (!q) return attractions;

  return attractions.filter((item) =>
    [
      item.name_th,
      item.name_en,
      item.province_th,
      item.province_en,
      item.category_th,
      item.category_en,
    ]
      .filter(Boolean)
      .some((text) => String(text).toLowerCase().includes(q))
  );
}