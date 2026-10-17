import fs from 'fs';
import path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 1. อ่านไฟล์กุญแจ Service Account
const serviceAccountPath = './serviceAccountKey.json';
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ ไม่พบไฟล์ serviceAccountKey.json ใน Root โฟลเดอร์! - import-to-firebase.mjs:9');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// 2. เชื่อมต่อ Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// 3. ระบุที่อยู่ไฟล์ข้อมูล JSON
const jsonPath = './src/data/master-data.fixed.json';
if (!fs.existsSync(jsonPath)) {
  console.error(`❌ ไม่พบไฟล์ข้อมูล JSON ที่ตำแหน่ง: ${jsonPath} - import-to-firebase.mjs:25`);
  process.exit(1);
}

const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

async function importData() {
  console.log('🚀 กำลังเริ่มนำเข้าข้อมูลเข้า Firebase Firestore...\n - import-to-firebase.mjs:33');
  console.log('📌 Key ที่พบในไฟล์ JSON: - import-to-firebase.mjs:34', Object.keys(data)); // แสดง Key ทั้งหมดเพื่อตรวจสอบ

  // 3.1 ย้ายข้อมูล Provinces (จังหวัด)
  if (data.provinces && Array.isArray(data.provinces)) {
    console.log('\n📦 กำลังนำเข้าข้อมูลจังหวัด (provinces)... - import-to-firebase.mjs:38');
    for (const item of data.provinces) {
      const docId = String(item.province_id || item.id);
      await db.collection('provinces').doc(docId).set(item);
    }
    console.log(`✅ สำเร็จ: เพิ่มจังหวัดเรียบร้อย ${data.provinces.length} รายการ - import-to-firebase.mjs:43`);
  }

  // 3.2 ย้ายข้อมูล Categories (หมวดหมู่)
  if (data.categories && Array.isArray(data.categories)) {
    console.log('\n📦 กำลังนำเข้าข้อมูลหมวดหมู่ (categories)... - import-to-firebase.mjs:48');
    for (const item of data.categories) {
      const docId = String(item.category_id || item.id);
      await db.collection('categories').doc(docId).set(item);
    }
    console.log(`✅ สำเร็จ: เพิ่มหมวดหมู่เรียบร้อย ${data.categories.length} รายการ - import-to-firebase.mjs:53`);
  }

  // 3.3 ย้ายข้อมูล Attractions (ค้นหาตาม Key ที่เป็นไปได้)
  const attractionsList = data.attractions || data.places || data.items || data.data;

  if (attractionsList && Array.isArray(attractionsList)) {
    console.log('\n📦 กำลังนำเข้าข้อมูลสถานที่ท่องเที่ยว (attractions)... - import-to-firebase.mjs:60');
    for (const item of attractionsList) {
      const docId = String(item.attraction_id || item.id);
      await db.collection('attractions').doc(docId).set(item);
    }
    console.log(`✅ สำเร็จ: เพิ่มสถานที่ท่องเที่ยวเรียบร้อย ${attractionsList.length} รายการ - import-to-firebase.mjs:65`);
  } else {
    console.log('\n⚠️ ไม่พบ Key ข้อมูลสถานที่ท่องเที่ยวในไฟล์ JSON - import-to-firebase.mjs:67');
  }

  console.log('\n🎉 ย้ายข้อมูลทั้งหมดเข้า Firebase Firestore สำเร็จสมบูรณ์! - import-to-firebase.mjs:70');
}

importData().catch((error) => {
  console.error('❌ เกิดข้อผิดพลาดในการอัปโหลดข้อมูล: - import-to-firebase.mjs:74', error);
});