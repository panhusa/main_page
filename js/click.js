// Get all elements with the class "griditem"
const gridItems = document.querySelectorAll('.griditem');

// Add a click event listener to each grid item
gridItems.forEach((gridItem) => {
    gridItem.addEventListener('click', () => {
        const modal = document.getElementById('modal01');
        const img01 = document.getElementById('img01');

        // Get the background image URL of the clicked element
        const backgroundImage = window.getComputedStyle(gridItem).getPropertyValue('background-image');
        const imageURL = backgroundImage.slice(5, -2); // Extract the URL from the computed style

        // Check if the imageURL is not empty
        if (imageURL) {
            // Set the src attribute of img01 to the imageURL
            img01.src = imageURL;

            // Display the modal
            modal.style.display = 'block';
        }
    });
});

// Add a click event listener to the close button inside the modal
const closeModalButton = document.getElementById('btn1');
closeModalButton.addEventListener('click', () => {
    const modal = document.getElementById('modal01');
    modal.style.display = 'none';
});

// Add event listeners for the "Esc" key and clicking outside of the modal
const modal = document.getElementById('modal01');
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        modal.style.display = 'none';
    }
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
