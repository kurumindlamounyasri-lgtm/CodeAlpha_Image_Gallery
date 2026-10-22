const photos = [
  { title: "Quiet mountains", category: "nature", alt: "Mountain peaks beneath a soft sky", src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85" },
  { title: "Morning in the city", category: "architecture", alt: "City architecture in morning light", src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=85" },
  { title: "Coastal escape", category: "travel", alt: "Blue sea beside a rocky coast", src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=85" },
  { title: "A little green", category: "details", alt: "Green leaves with sunlight", src: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=900&q=85" },
  { title: "Forest path", category: "nature", alt: "A peaceful path surrounded by trees", src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85" },
  { title: "Lines and light", category: "architecture", alt: "Modern building lines and geometric shapes", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=85" },
  { title: "Open road", category: "travel", alt: "A road leading toward a distant landscape", src: "https://images.unsplash.com/photo-1469820291471-a6d3f5a5e9c8?auto=format&fit=crop&w=900&q=85" },
  { title: "Soft petals", category: "details", alt: "Close-up of delicate flower petals", src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85" },
  { title: "Alpine air", category: "nature", alt: "Mountain lake and alpine landscape", src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85" },
  { title: "Old town charm", category: "architecture", alt: "Historic buildings along a European street", src: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85" },
  { title: "Wander often", category: "travel", alt: "Scenic travel landscape with distant hills", src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85" },
  { title: "Golden hour", category: "details", alt: "Warm golden sunlight across a natural scene", src: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85" }
];

const gallery = document.getElementById("gallery");
const filters = document.getElementById("filters");
const photoCount = document.getElementById("photoCount");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxCount = document.getElementById("lightboxCount");
const closeLightbox = document.getElementById("closeLightbox");
const prevImage = document.getElementById("prevImage");
const nextImage = document.getElementById("nextImage");

let activeFilter = "all";
let visiblePhotos = [...photos];
let currentIndex = 0;
let lastFocusedElement = null;

function categoryName(category) {
  return category === "details" ? "Little details" : category.charAt(0).toUpperCase() + category.slice(1);
}

function renderGallery() {
  visiblePhotos = photos.filter(photo => activeFilter === "all" || photo.category === activeFilter);
  gallery.replaceChildren();
  photoCount.textContent = `${visiblePhotos.length} ${visiblePhotos.length === 1 ? "photo" : "photos"}`;

  visiblePhotos.forEach((photo, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-item";
    button.setAttribute("aria-label", `Open ${photo.title} image`);

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = "lazy";
    img.decoding = "async";

    const overlay = document.createElement("span");
    overlay.className = "gallery-overlay";
    const category = document.createElement("p");
    category.className = "gallery-category";
    category.textContent = categoryName(photo.category);
    const title = document.createElement("p");
    title.className = "gallery-title";
    title.textContent = photo.title;
    overlay.append(category, title);
    button.append(img, overlay);
    button.addEventListener("click", () => openLightbox(index));
    gallery.appendChild(button);
  });
}

function updateLightbox() {
  const photo = visiblePhotos[currentIndex];
  if (!photo) return;
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxTitle.textContent = photo.title;
  lightboxCategory.textContent = categoryName(photo.category);
  lightboxCount.textContent = `${currentIndex + 1} / ${visiblePhotos.length}`;
  prevImage.disabled = visiblePhotos.length < 2;
  nextImage.disabled = visiblePhotos.length < 2;
}

function openLightbox(index) {
  if (!visiblePhotos.length) return;
  currentIndex = index;
  lastFocusedElement = document.activeElement;
  updateLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeLightbox.focus();
}

function hideLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusedElement) lastFocusedElement.focus();
}

function moveImage(direction) {
  if (!visiblePhotos.length) return;
  currentIndex = (currentIndex + direction + visiblePhotos.length) % visiblePhotos.length;
  updateLightbox();
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  filters.querySelectorAll(".filter-btn").forEach(btn => {
    const selected = btn === button;
    btn.classList.toggle("active", selected);
    btn.setAttribute("aria-pressed", String(selected));
  });
  renderGallery();
});

closeLightbox.addEventListener("click", hideLightbox);
prevImage.addEventListener("click", () => moveImage(-1));
nextImage.addEventListener("click", () => moveImage(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) hideLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") hideLightbox();
  if (event.key === "ArrowLeft") moveImage(-1);
  if (event.key === "ArrowRight") moveImage(1);
});

renderGallery();
