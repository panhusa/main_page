// ═══════════════════════════════════════════════════════════
// PHOTO GALLERY — MASONRY GRID + VERTICAL SCROLL + LIGHTBOX
// With real EXIF metadata from JSON
// ═══════════════════════════════════════════════════════════

let allPhotos = [];
let filteredPhotos = [];
let currentFilter = 'all';
let currentLightboxIndex = 0;

// ═══════════════════════════════════════════════════════════
// LOAD GALLERY DATA
// ═══════════════════════════════════════════════════════════

async function loadGalleryData() {
    try {
        const response = await fetch('data/gallery.json');
        const data = await response.json();

        allPhotos = data.photos;
        filteredPhotos = [...allPhotos];

        console.log(`✓ Loaded ${allPhotos.length} photos with EXIF metadata`);

        return true;
    } catch (error) {
        console.error('Error loading gallery data:', error);
        return false;
    }
}

// ═══════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════

async function initGallery() {
    const loaded = await loadGalleryData();

    if (!loaded) {
        console.error('Failed to load gallery data');
        return;
    }

    renderGalleryGrid();
    attachFilterListeners();
}

// ═══════════════════════════════════════════════════════════
// MASONRY GRID RENDERING (Lazy Load)
// ═══════════════════════════════════════════════════════════

function renderGalleryGrid() {
    const gallery = document.getElementById('gallery-grid');
    gallery.innerHTML = '';

    filteredPhotos.forEach((photo, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.index = index;

        // Lazy load image (use data-src)
        galleryItem.innerHTML = `
            <div class="gallery-img-wrapper">
                <img class="gallery-img lazy-img"
                     data-src="images/fotki/${photo.filename}"
                     alt="${photo.filename}"
                     onclick="openLightbox(${index})">
                <div class="gallery-overlay" onclick="openLightbox(${index})">
                    <i class="fas fa-expand"></i>
                </div>
            </div>
        `;

        gallery.appendChild(galleryItem);
    });

    // Trigger lazy loading for visible items
    lazyLoadImages();
}

// ═══════════════════════════════════════════════════════════
// LAZY LOADING (Intersection Observer)
// ═══════════════════════════════════════════════════════════

function lazyLoadImages() {
    const images = document.querySelectorAll('.lazy-img');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '100px'
    });

    images.forEach(img => imageObserver.observe(img));
}

// ═══════════════════════════════════════════════════════════
// FILTERS
// ═══════════════════════════════════════════════════════════

function attachFilterListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            applyFilter(filter);
        });
    });
}

function applyFilter(filter) {
    currentFilter = filter;

    if (filter === 'all') {
        filteredPhotos = [...allPhotos];
    } else {
        filteredPhotos = allPhotos.filter(p => p.category === filter);
    }

    renderGalleryGrid();
}

// ═══════════════════════════════════════════════════════════
// LIGHTBOX + EXIF TOOLTIP
// ═══════════════════════════════════════════════════════════

function openLightbox(index) {
    currentLightboxIndex = index;
    const modal = document.getElementById('lightbox-modal');
    const photo = filteredPhotos[index];

    const imageUrl = `images/fotki/${photo.filename}`;
    document.getElementById('lightbox-image').src = imageUrl;

    // Format EXIF data for tooltip
    const exifInfo = formatExifInfo(photo);

    // Update tooltip with real data
    document.getElementById('tooltip-title').textContent = photo.filename;
    document.getElementById('tooltip-exif').innerHTML = exifInfo;
    document.getElementById('tooltip-counter').textContent = `${index + 1} / ${filteredPhotos.length}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function formatExifInfo(photo) {
    const parts = [];

    if (photo.camera && photo.camera !== 'Unknown') {
        parts.push(`<strong>${photo.camera}</strong>`);
    }

    if (photo.lens && photo.lens !== 'Unknown') {
        parts.push(`${photo.lens}`);
    }

    const settings = [];

    if (photo.focal_length && photo.focal_length !== 'Unknown') {
        settings.push(`${photo.focal_length}`);
    }

    if (photo.aperture && photo.aperture !== 'Unknown') {
        settings.push(`f/${photo.aperture}`);
    }

    if (photo.shutter && photo.shutter !== 'Unknown') {
        settings.push(`${photo.shutter}s`);
    }

    if (photo.iso && photo.iso !== 'Unknown') {
        settings.push(`ISO ${photo.iso}`);
    }

    if (settings.length > 0) {
        parts.push(`<small>${settings.join(' • ')}</small>`);
    }

    return parts.join('<br>');
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function nextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredPhotos.length;
    openLightbox(currentLightboxIndex);
}

function prevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    openLightbox(currentLightboxIndex);
}

// ═══════════════════════════════════════════════════════════
// KEYBOARD NAV
// ═══════════════════════════════════════════════════════════

document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightbox-modal');
    if (!modal.classList.contains('active')) return;

    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') closeLightbox();
});

// ═══════════════════════════════════════════════════════════
// ON LOAD
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', initGallery);
