const BASE = import.meta.env.BASE_URL;
const DATA_URL = `${BASE}master-data.fixed.json`;
let cache = null;

async function loadData() {
  if (!cache) {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`โหลดข้อมูลไม่สำเร็จ (${response.status})`);
    cache = await response.json();
  }
  return cache;
}

function addImages(item) {
  const id = String(item.attraction_id).padStart(3, "0");
  const src = `${BASE}images/attraction_${id}.jpg`;
  return { ...item, image_thumbnail: src, image_detail: src };
}

export async function getAttractions() {
  const data = await loadData();
  return (data.data || []).map(addImages);
}

export async function getProvinces() {
  const data = await loadData();
  return data.provinces || [];
}

export async function getCategories() {
  const data = await loadData();
  return data.categories || [];
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