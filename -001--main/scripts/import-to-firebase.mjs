import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "node:fs";
import path from "node:path";

// ⚠️ ใส่ค่า config ของ Firebase ของคุณตรงนี้
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DATA_PATH = path.resolve("./src/data/master-data.fixed.json");

async function uploadData() {
  const rawData = fs.readFileSync(DATA_PATH, "utf-8");
  const data = JSON.parse(rawData);

  console.log("กำลังอัปโหลดสถานที่ท่องเที่ยวเข้า Firebase... - import-to-firebase.mjs:25");
  for (const item of data.attractions) {
    const id = String(item.attraction_id || item.id);
    await setDoc(doc(db, "attractions", id), item, { merge: true });
  }

  console.log("กำลังอัปโหลดจังหวัดเข้า Firebase... - import-to-firebase.mjs:31");
  for (const prov of data.provinces) {
    const id = String(prov.province_id || prov.id);
    await setDoc(doc(db, "provinces", id), prov, { merge: true });
  }

  console.log("✅ อัปเดตข้อมูลเข้า Firebase สำเร็จเรียบร้อยแล้ว! - import-to-firebase.mjs:37");
}

uploadData().catch(console.error);