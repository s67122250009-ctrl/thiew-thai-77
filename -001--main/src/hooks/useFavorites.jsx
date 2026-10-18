import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext();
const STORAGE_KEY = "thiew_thai_favorites";
const getItemId = (item) => item === null || item === undefined ? "" : typeof item === "object" ? String(item.attraction_id ?? item.id ?? "") : String(item);
const normalizeFavorites = (items) => [...new Set((Array.isArray(items) ? items : []).map(getItemId).filter(Boolean))];

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try { return normalizeFavorites(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); }
    catch { return []; }
  });
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)); }, [favorites]);
  const isFavorite = (itemOrId) => favorites.includes(getItemId(itemOrId));
  const toggleFavorite = (itemOrId) => {
    const id = getItemId(itemOrId);
    if (!id) return;
    setFavorites((current) => current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id]);
  };
  const clearFavorites = () => setFavorites([]);
  return <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, clearFavorites }}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() { const context = useContext(FavoritesContext); if (!context) throw new Error("useFavorites must be used inside FavoritesProvider"); return context; }
export default useFavorites;
