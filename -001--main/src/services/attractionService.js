import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// 1. ดึงสถานที่ท่องเที่ยวทั้งหมด
export const getAttractions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'attractions'));
    const attractions = [];
    querySnapshot.forEach((doc) => {
      attractions.push({ id: doc.id, ...doc.data() });
    });
    return attractions;
  } catch (error) {
    console.error('Error fetching attractions: - attractionService.js:14', error);
    return [];
  }
};

// 2. ดึงรายละเอียดสถานที่ท่องเที่ยวตาม ID
export const getAttractionById = async (id) => {
  try {
    const docRef = doc(db, 'attractions', String(id));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching attraction by ID: - attractionService.js:29', error);
    return null;
  }
};

// 3. ดึงสถานที่ท่องเที่ยวตามหมวดหมู่ (Category ID)
export const getAttractionsByCategory = async (categoryId) => {
  try {
    const all = await getAttractions();
    if (!categoryId) return all;
    return all.filter(item => 
      String(item.category_id) === String(categoryId) || 
      String(item.categoryId) === String(categoryId)
    );
  } catch (error) {
    console.error('Error fetching attractions by category: - attractionService.js:44', error);
    return [];
  }
};

// 4. ดึงสถานที่ท่องเที่ยวตามจังหวัด (Province ID)
export const getAttractionsByProvince = async (provinceId) => {
  try {
    const all = await getAttractions();
    if (!provinceId) return all;
    return all.filter(item => 
      String(item.province_id) === String(provinceId) || 
      String(item.provinceId) === String(provinceId)
    );
  } catch (error) {
    console.error('Error fetching attractions by province: - attractionService.js:59', error);
    return [];
  }
};

// 5. ค้นหาสถานที่ท่องเที่ยวตามคำค้น
export const searchAttractions = async (query) => {
  try {
    const all = await getAttractions();
    if (!query) return all;
    const lower = query.toLowerCase();
    return all.filter(item => 
      (item.name_th && item.name_th.toLowerCase().includes(lower)) ||
      (item.name_en && item.name_en.toLowerCase().includes(lower)) ||
      (item.description_th && item.description_th.toLowerCase().includes(lower))
    );
  } catch (error) {
    console.error('Error searching attractions: - attractionService.js:76', error);
    return [];
  }
};

// 6. ดึงรายการจังหวัดทั้งหมด
export const getProvinces = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'provinces'));
    const provinces = [];
    querySnapshot.forEach((doc) => {
      provinces.push({ id: doc.id, ...doc.data() });
    });
    return provinces;
  } catch (error) {
    console.error('Error fetching provinces: - attractionService.js:91', error);
    return [];
  }
};

// 7. ดึงข้อมูลจังหวัดรายรายการ (ตาม ID)
export const getProvince = async (id) => {
  try {
    const docRef = doc(db, 'provinces', String(id));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching province: - attractionService.js:106', error);
    return null;
  }
};
export const getProvinceById = getProvince;

// 8. ดึงรายการหมวดหมู่ทั้งหมด
export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories: - attractionService.js:122', error);
    return [];
  }
};

// 9. ดึงข้อมูลหมวดหมู่รายรายการ (ตาม ID)
export const getCategory = async (id) => {
  try {
    const docRef = doc(db, 'categories', String(id));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching category: - attractionService.js:137', error);
    return null;
  }
};
export const getCategoryById = getCategory;