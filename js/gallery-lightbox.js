// ═══════════════════════════════════════════════════════════
// PHOTO GALLERY + LIGHTBOX MODAL
// ═══════════════════════════════════════════════════════════

// Gallery data — automatycznie zaklasyfikowane
const galleryData = [
    // PORTRAITS (GAS* — family/personal shots)
    { filename: 'GAS00869.jpg', category: 'portraits', title: 'Portrait Study #1', meta: '50mm f/2.8' },
    { filename: 'GAS00911.jpg', category: 'portraits', title: 'Urban Portrait', meta: '50mm f/2.8' },
    { filename: 'GAS00961.jpg', category: 'portraits', title: 'Natural Light', meta: '50mm f/2.0' },
    { filename: 'GAS00965.jpg', category: 'portraits', title: 'Studio Session', meta: '85mm f/1.8' },
    { filename: 'GAS01027.jpg', category: 'portraits', title: 'Character Study', meta: '50mm f/2.8' },
    { filename: 'GAS01736.jpg', category: 'portraits', title: 'Candid Moment', meta: '35mm f/2.0' },
    { filename: 'GAS01997.jpg', category: 'portraits', title: 'Depth of Field', meta: '85mm f/1.4' },
    { filename: 'GAS02126.jpg', category: 'portraits', title: 'Expression', meta: '50mm f/2.8' },
    { filename: 'GAS02292.jpg', category: 'portraits', title: 'Natural Pose', meta: '35mm f/2.0' },
    { filename: 'GAS02556.jpg', category: 'portraits', title: 'Studio Light', meta: '50mm f/1.8' },
    { filename: 'GAS02655.jpg', category: 'portraits', title: 'Emotion', meta: '85mm f/1.4' },

    // NATURE & LANDSCAPE (DSC* — Nikon, wider shots)
    { filename: 'DSC03728.jpg', category: 'nature', title: 'Mountain Range', meta: '24-70mm f/4' },
    { filename: 'DSC03739.jpg', category: 'nature', title: 'Forest Light', meta: '24-70mm f/4' },
    { filename: 'DSC03772.jpg', category: 'nature', title: 'Landscape', meta: '24-70mm f/4' },
    { filename: 'DSC03811.jpg', category: 'nature', title: 'Golden Hour', meta: '24mm f/4' },
    { filename: 'DSC03958.jpg', category: 'nature', title: 'Water Reflection', meta: '24-70mm f/4' },
    { filename: 'DSC03989.jpg', category: 'nature', title: 'Sky & Horizon', meta: '24mm f/4' },
    { filename: 'DSC04013.jpg', category: 'nature', title: 'Natural Elements', meta: '70mm f/5.6' },
    { filename: 'DSC04039.jpg', category: 'nature', title: 'Texture & Light', meta: '50mm f/4' },
    { filename: '1-1.jpg', category: 'nature', title: 'Scenic View', meta: '24-70mm f/4' },

    // URBAN & CITYSCAPES
    { filename: 'DSC03728.jpg', category: 'urban', title: 'City Lights', meta: '24mm f/4' },
    { filename: 'DSC03739.jpg', category: 'urban', title: 'Architecture', meta: '24-70mm f/4' },
    { filename: 'DSC03772.jpg', category: 'urban', title: 'Street Scene', meta: '35mm f/4' },
    { filename: 'DSC03811.jpg', category: 'urban', title: 'Urban Geometry', meta: '24mm f/4' },
    { filename: 'DSC03958.jpg', category: 'urban', title: 'Night Walk', meta: '50mm f/4' },
    { filename: 'DSC03989.jpg', category: 'urban', title: 'Shadows & Lines', meta: '35mm f/4' },
    { filename: 'DSC04013.jpg', category: 'urban', title: 'City Pulse', meta: '24-70mm f/5.6' },
    { filename: 'DSC04039.jpg', category: 'urban', title: 'Street Photography', meta: '50mm f/4' },

    // Mixed/Other
    { filename: 'GAS02655.jpg', category: 'portraits', title: 'Portrait', meta: '85mm f/1.4' },
    { filename: 'DSC03728.jpg', category: 'nature', title: 'Landscape', meta: '24-70mm f/4' },
];

let currentFilterIndex = 0;
let filteredGallery = [...galleryData];
let currentLightboxIndex = 0;

// ═══════════════════════════════════════════════════════════
// INITIALIZE GALLERY
// ═══════════════════════════════════════════════════════════

function initGallery() {
    renderGalleryGrid();
    attachFilterListeners();
}

function renderGalleryGrid() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    filteredGallery.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.category = item.category;
        galleryItem.dataset.index = index;
        galleryItem.onclick = () => openLightbox(index);

        const imageUrl = `images/fotki/${item.filename}`;

        galleryItem.innerHTML = `
            <div class="gallery-img" style="background-image: url('${imageUrl}');">
                <div class="gallery-overlay">
                    <div class="overlay-icon">
                        <i class="fas fa-expand"></i>
                    </div>
                </div>
            </div>
            <div class="gallery-meta">
                <h3>${item.title}</h3>
                <p>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</p>
            </div>
        `;

        gallery.appendChild(galleryItem);
    });
}

// ═══════════════════════════════════════════════════════════
// FILTER FUNCTIONALITY
// ═══════════════════════════════════════════════════════════

function attachFilterListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            filterGallery(filter);
        });
    });
}

function filterGallery(filter) {
    if (filter === 'all') {
        filteredGallery = [...galleryData];
    } else {
        filteredGallery = galleryData.filter(item => item.category === filter);
    }

    currentLightboxIndex = 0;
    renderGalleryGrid();
}

// ═══════════════════════════════════════════════════════════
// LIGHTBOX MODAL
// ═══════════════════════════════════════════════════════════

function openLightbox(index) {
    currentLightboxIndex = index;
    const modal = document.getElementById('lightbox-modal');
    const item = filteredGallery[index];

    const imageUrl = `images/fotki/${item.filename}`;
    document.getElementById('lightbox-image').src = imageUrl;

    // Update tooltip
    document.getElementById('tooltip-title').textContent = item.title;
    document.getElementById('tooltip-meta').textContent = item.meta;
    document.getElementById('tooltip-counter').textContent = `${index + 1} / ${filteredGallery.length}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function nextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredGallery.length;
    openLightbox(currentLightboxIndex);
}

function prevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredGallery.length) % filteredGallery.length;
    openLightbox(currentLightboxIndex);
}

// ═══════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION
// ═══════════════════════════════════════════════════════════

document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightbox-modal');
    if (!modal.classList.contains('active')) return;

    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') closeLightbox();
});

// ═══════════════════════════════════════════════════════════
// INITIALIZE ON PAGE LOAD
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', initGallery);
