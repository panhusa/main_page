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

// Only items that actually have an image take part in the lightbox.
const gridItems = Array.from(document.querySelectorAll('.griditem')).filter(getImageUrl);

let current = 0;

function show(index) {
    current = (index + gridItems.length) % gridItems.length;
    img01.src = getImageUrl(gridItems[current]);
    img01.alt = `Photo ${current + 1} of ${gridItems.length}`;
    counter.textContent = `${current + 1} / ${gridItems.length}`;
    // Restart the zoom-in animation.
    img01.classList.remove('mod-img');
    void img01.offsetWidth;
    img01.classList.add('mod-img');
}

function openModal(index) {
    show(index);
    modal.classList.add('open');
}

function closeModal() {
    modal.classList.remove('open');
}

const showNext = () => show(current + 1);
const showPrev = () => show(current - 1);

gridItems.forEach((item, index) => {
    item.addEventListener('click', () => openModal(index));
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
