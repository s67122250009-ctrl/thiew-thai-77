import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

// ดึง ID ของสถานที่อย่างปลอดภัย (รองรับทั้ง attraction_id และ id)
const getItemId = (item) => {
  if (!item) return "";
  if (typeof item === "object") {
    return String(item.attraction_id || item.id || "");
  }
  return String(item);
};

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("thiew_thai_favorites");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to load favorites:", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("thiew_thai_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites:", e);
    }
  }, [favorites]);

  // ตรวจสอบว่ามีในรายการโปรดหรือยัง
  const isFavorite = (itemOrId) => {
    const targetId = getItemId(itemOrId);
    if (!targetId) return false;
    return favorites.some((fav) => getItemId(fav) === targetId);
  };

  // สลับสถานะเพิ่ม / ลบ
  const toggleFavorite = (attraction) => {
    if (!attraction) return;
    const targetId = getItemId(attraction);
    if (!targetId) return;

    setFavorites((prevFavs) => {
      const exists = prevFavs.some((fav) => getItemId(fav) === targetId);
      if (exists) {
        return prevFavs.filter((fav) => getItemId(fav) !== targetId);
      } else {
        // บันทึก Object สถานที่ทั้งชุดไว้เพื่อให้นำไปแสดงการ์ดได้ทันที
        const itemToSave =
          typeof attraction === "object"
            ? attraction
            : { id: targetId, attraction_id: targetId };
        return [...prevFavs, itemToSave];
      }
    });
  };

  // ฟังก์ชันล้างรายการโปรดทั้งหมด
  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    return {
      favorites: [],
      isFavorite: () => false,
      toggleFavorite: () => {},
      clearFavorites: () => {},
    };
  }
  return context;
}

export default useFavorites;