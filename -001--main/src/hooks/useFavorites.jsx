import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

// ฟังก์ชันดึง ID จาก Object หรือ String/Number อย่างปลอดภัย
const getItemId = (item) => {
  if (!item) return null;
  if (typeof item === "object") {
    return String(item.attraction_id || item.id || "");
  }
  return String(item);
};

export function FavoritesProvider({ children }) {
  // โหลดข้อมูลรายการโปรดจาก LocalStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("thiew_thai_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load favorites:", e);
      return [];
    }
  });

  // บันทึกลง LocalStorage ทุกครั้งที่รายการโปรดเปลี่ยน
  useEffect(() => {
    try {
      localStorage.setItem("thiew_thai_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites:", e);
    }
  }, [favorites]);

  // ตรวจสอบว่าถูกใจรายการนี้หรือยัง
  const isFavorite = (itemOrId) => {
    const targetId = getItemId(itemOrId);
    if (!targetId) return false;
    return favorites.some((fav) => getItemId(fav) === targetId);
  };

  // สลับสถานะ เพิ่ม / ลบ รายการโปรด
  const toggleFavorite = (attraction) => {
    if (!attraction) return;
    const targetId = getItemId(attraction);
    if (!targetId) return;

    setFavorites((prevFavs) => {
      const exists = prevFavs.some((fav) => getItemId(fav) === targetId);
      if (exists) {
        return prevFavs.filter((fav) => getItemId(fav) !== targetId);
      } else {
        return [...prevFavs, attraction];
      }
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    return { favorites: [], isFavorite: () => false, toggleFavorite: () => {} };
  }
  return context;
}

export default useFavorites;