const modal   = document.getElementById('modal01');
const img01   = document.getElementById('img01');
const counter = document.getElementById('modal-counter');

// Images are set as CSS backgrounds; pull the URL out of `url("...")`.
function getImageUrl(item) {
    const bg = window.getComputedStyle(item).getPropertyValue('background-image');
    // Anchored and greedy: file names here contain parentheses, e.g. "photo-grid (2).jpg".
    const match = bg.match(/^url\((["']?)(.*)\1\)$/);
    return match ? match[2] : null;
}

const allItems = Array.from(document.querySelectorAll('.griditem')).filter(getImageUrl);
// Items whose image failed to load are marked `img-missing` (see below) and
// skipped, so the lightbox never shows a broken image.
const available = () => allItems.filter(item => !item.classList.contains('img-missing'));

// Some referenced photos may not be deployed; hide those tiles instead of
// showing empty squares. They reappear automatically once the file exists.
allItems.forEach(item => {
    const probe = new Image();
    probe.onerror = () => item.classList.add('img-missing');
    probe.src = getImageUrl(item);
});

let items = [];
let current = 0;

function show(index) {
    current = (index + items.length) % items.length;
    img01.src = getImageUrl(items[current]);
    img01.alt = `Photo ${current + 1} of ${items.length}`;
    counter.textContent = `${current + 1} / ${items.length}`;
    // Restart the zoom-in animation.
    img01.classList.remove('mod-img');
    void img01.offsetWidth;
    img01.classList.add('mod-img');
}

function openModal(item) {
    items = available();
    show(items.indexOf(item));
    modal.classList.add('open');
}

function closeModal() {
    modal.classList.remove('open');
}

const showNext = () => show(current + 1);
const showPrev = () => show(current - 1);

allItems.forEach(item => {
    item.addEventListener('click', () => openModal(item));
});

document.getElementById('btn1').addEventListener('click', closeModal);
document.getElementById('btn-next').addEventListener('click', showNext);
document.getElementById('btn-prev').addEventListener('click', showPrev);

window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft')  showPrev();
});

modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-inner')) closeModal();
});
