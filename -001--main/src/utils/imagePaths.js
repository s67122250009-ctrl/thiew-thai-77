const extensions = [".jpg", ".jpeg"];
const suffixes = ["", " (1)", " (2)", " (1) (1)", " (1) (2)", " (2) (1)", " (1) (1) (1)"];

export function getImagePaths(attraction, field) {
  const id = String(attraction?.attraction_id || attraction?.id || "").padStart(3, "0");
  const preferred = attraction?.[field];
  const localFiles = extensions.flatMap((extension) => suffixes.map((suffix) => `/images/attraction_${id}${suffix}${extension}`));
  return [...new Set([preferred, ...localFiles].filter(Boolean))];
}
export function handleImgError(event) {
  const img = event.currentTarget;
  if (!img.dataset.triedJpeg && img.src.endsWith(".jpg")) {
    img.dataset.triedJpeg = "1";
    img.src = img.src.replace(/\.jpg$/, ".jpeg");
    return;
  }
  img.onerror = null;
  img.src = `${import.meta.env.BASE_URL}images/placeholder.jpg`;
}