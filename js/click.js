const gridItems = Array.from(document.querySelectorAll('.griditem'));
const modal     = document.getElementById('modal01');
const img01     = document.getElementById('img01');
const counter   = document.getElementById('modal-counter');

let current = 0;

function getImageUrl(item) {
    const bg = window.getComputedStyle(item).getPropertyValue('background-image');
    return bg.slice(5, -2);
}

function openModal(index) {
    current = index;
    img01.src = getImageUrl(gridItems[current]);
    counter.textContent = `${current + 1} / ${gridItems.length}`;
    modal.classList.add('open');
}

function closeModal() {
    modal.classList.remove('open');
}

function showNext() {
    current = (current + 1) % gridItems.length;
    img01.src = getImageUrl(gridItems[current]);
    counter.textContent = `${current + 1} / ${gridItems.length}`;
    img01.classList.remove('mod-img');
    void img01.offsetWidth;
    img01.classList.add('mod-img');
}

function showPrev() {
    current = (current - 1 + gridItems.length) % gridItems.length;
    img01.src = getImageUrl(gridItems[current]);
    counter.textContent = `${current + 1} / ${gridItems.length}`;
    img01.classList.remove('mod-img');
    void img01.offsetWidth;
    img01.classList.add('mod-img');
}

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
    if (e.target === modal) closeModal();
});
