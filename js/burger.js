const hamburger = document.querySelector(".hamburger");
const navbarMenu = document.querySelector(".navbar-menu");

function setMenu(open) {
    hamburger.classList.toggle("active", open);
    navbarMenu.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", String(open));
}

hamburger.addEventListener("click", () => setMenu(!navbarMenu.classList.contains("active")));
hamburger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setMenu(!navbarMenu.classList.contains("active"));
    }
});

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => setMenu(false)));
