// ═══════════════════════════════════════════════════════════
// GALLERY FILTERING
// ═══════════════════════════════════════════════════════════

const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        // Filter gallery items
        galleryItems.forEach(item => {
            const category = item.dataset.category;

            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.classList.add('fade-in');
                }, 10);
            } else {
                item.style.display = 'none';
                item.classList.remove('fade-in');
            }
        });
    });
});

// ═══════════════════════════════════════════════════════════
// GALLERY ITEM CLICK (Future: Lightbox)
// ═══════════════════════════════════════════════════════════

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // TODO: Implement lightbox modal
        console.log('Gallery item clicked:', item);
    });
});
