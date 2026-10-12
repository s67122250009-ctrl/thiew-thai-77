import sql from './db';

// 1. ดึงรายการสถานที่ท่องเที่ยวทั้งหมด (ที่ HomePage.jsx เรียกใช้)
export const getAttractions = async () => {
  try {
    return await sql`SELECT * FROM attractions ORDER BY attraction_id`;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสถานที่ท่องเที่ยว: - attractionService.js:8', error);
    return [];
  }
};

// 2. ดึงข้อมูลรวมทั้งหมด (จังหวัด, หมวดหมู่, สถานที่ท่องเที่ยว)
export const getMasterData = async () => {
  try {
    const provinces = await sql`SELECT * FROM provinces ORDER BY province_id`;
    const categories = await sql`SELECT * FROM categories ORDER BY category_id`;
    const attractions = await sql`SELECT * FROM attractions ORDER BY attraction_id`;

    return {
      metadata: {
        total_records: attractions.length,
        provinces: provinces.length,
        categories: categories.length,
      },
      provinces: provinces,
      categories: categories,
      data: attractions,
    };
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลจาก Neon: - attractionService.js:31', error);
    throw error;
  }
};

// 3. ดึงสถานที่ท่องเที่ยวตาม ID
export const getAttractionById = async (id) => {
  try {
    const result = await sql`SELECT * FROM attractions WHERE attraction_id = ${id}`;
    return result[0] || null;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงรายละเอียดสถานที่: - attractionService.js:42', error);
    return null;
  }
};

// 4. ดึงสถานที่ท่องเที่ยวแนะนำ (Featured)
export const getFeaturedAttractions = async () => {
  try {
    return await sql`SELECT * FROM attractions WHERE is_featured = true ORDER BY attraction_id`;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงสถานที่แนะนำ: - attractionService.js:52', error);
    return [];
  }
};

// 5. ดึงรายการจังหวัดทั้งหมด
export const getProvinces = async () => {
  try {
    return await sql`SELECT * FROM provinces ORDER BY province_id`;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงจังหวัดทั้งหมด: - attractionService.js:62', error);
    return [];
  }
};

// 6. ดึงข้อมูลจังหวัดตาม ID
export const getProvince = async (provinceId) => {
  try {
    const result = await sql`SELECT * FROM provinces WHERE province_id = ${provinceId}`;
    return result[0] || null;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลจังหวัด: - attractionService.js:73', error);
    return null;
  }
};

export const getProvinceById = getProvince;

// 7. ดึงรายการหมวดหมู่ทั้งหมด
export const getCategories = async () => {
  try {
    return await sql`SELECT * FROM categories ORDER BY category_id`;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงหมวดหมู่ทั้งหมด: - attractionService.js:85', error);
    return [];
  }
};

// 8. ดึงข้อมูลหมวดหมู่ตาม ID
export const getCategory = async (categoryId) => {
  try {
    const result = await sql`SELECT * FROM categories WHERE category_id = ${categoryId}`;
    return result[0] || null;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่: - attractionService.js:96', error);
    return null;
  }
};

export const getCategoryById = getCategory;

// 9. ดึงสถานที่ท่องเที่ยวตามจังหวัด
export const getAttractionsByProvince = async (provinceId) => {
  try {
    return await sql`SELECT * FROM attractions WHERE province_id = ${provinceId} ORDER BY attraction_id`;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลตามจังหวัด: - attractionService.js:108', error);
    return [];
  }
};

// 10. ดึงสถานที่ท่องเที่ยวตามหมวดหมู่
export const getAttractionsByCategory = async (categoryId) => {
  try {
    return await sql`SELECT * FROM attractions WHERE category_id = ${categoryId} ORDER BY attraction_id`;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลตามหมวดหมู่: - attractionService.js:118', error);
    return [];
  }
};

// 11. ค้นหาสถานที่ท่องเที่ยว
export const searchAttractions = async (query) => {
  try {
    const searchTerm = `%${query}%`;
    return await sql`
      SELECT * FROM attractions 
      WHERE name_th ILIKE ${searchTerm} 
         OR name_en ILIKE ${searchTerm} 
         OR description_th ILIKE ${searchTerm}
      ORDER BY attraction_id
    `;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการค้นหา: - attractionService.js:135', error);
    return [];
  }
};

// Default Export รองรับทั้งแบบ named และ default import
export default {
  getAttractions,
  getMasterData,
  getAttractionById,
  getFeaturedAttractions,
  getProvinces,
  getProvince,
  getProvinceById,
  getCategories,
  getCategory,
  getCategoryById,
  getAttractionsByProvince,
  getAttractionsByCategory,
  searchAttractions,
};