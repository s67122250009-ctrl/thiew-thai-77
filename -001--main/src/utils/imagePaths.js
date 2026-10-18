const extensions = [".jpg", ".jpeg"];
const suffixes = ["", " (1)", " (2)", " (1) (1)", " (1) (2)", " (2) (1)", " (1) (1) (1)"];

export function getImagePaths(attraction, field) {
  const id = String(attraction?.attraction_id || attraction?.id || "").padStart(3, "0");
  const preferred = attraction?.[field];
  const localFiles = extensions.flatMap((extension) => suffixes.map((suffix) => `/images/attraction_${id}${suffix}${extension}`));
  return [...new Set([preferred, ...localFiles].filter(Boolean))];
}

export function nextImageSource(sources) {
  return (event) => {
    const next = Number(event.currentTarget.dataset.sourceIndex || 0) + 1;
    if (next < sources.length) {
      event.currentTarget.dataset.sourceIndex = String(next);
      event.currentTarget.src = sources[next];
      return;
    }
    event.currentTarget.style.display = "none";
    const placeholder = event.currentTarget.nextElementSibling;
    if (placeholder) placeholder.style.display = "inline-flex";
  };
}
