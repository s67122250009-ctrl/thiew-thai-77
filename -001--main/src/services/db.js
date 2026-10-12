import { neon } from '@neondatabase/serverless';

// ดึงค่า Connection String จากไฟล์ .env
const DATABASE_URL = import.meta.env.VITE_NEON_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('⚠️ ไม่พบค่า VITE_NEON_DATABASE_URL ในไฟล์ .env กรุณาตรวจสอบไฟล์ .env - db.js:7');
}

const sql = neon(DATABASE_URL);

export default sql;