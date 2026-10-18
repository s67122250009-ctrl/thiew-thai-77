import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // ดึงค่าภาษาเดิมจาก localStorage ถ้าไม่มีให้เริ่มที่ 'th'
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("app_lang") || "th";
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("app_lang", lang);
  };

  // ฟังก์ชันสลับข้อความ TH / EN
  const t = (thText, enText) => {
    return language === "en" ? (enText || thText) : thText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export default function useLanguage() {
  return useContext(LanguageContext);
}