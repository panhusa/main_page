// ═══════════════════════════════════════════════════════════
// MAIN APP JS — SPA Routing + Scroll Animations
// ═══════════════════════════════════════════════════════════

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animatable elements
document.querySelectorAll('.skill-bubble, .preview-card, .case-study').forEach(el => {
    observer.observe(el);
});

// ═══════════════════════════════════════════════════════════
// NAVBAR TOGGLE (Mobile Menu)
// ═══════════════════════════════════════════════════════════

const toggle = document.getElementById('toggle');
const navbarMenu = document.querySelector('.navbar-menu');

toggle.addEventListener('click', () => {
    navbarMenu.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
    });
});

// ═══════════════════════════════════════════════════════════
// SMOOTH SCROLL TO SECTIONS
// ═══════════════════════════════════════════════════════════

function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ═══════════════════════════════════════════════════════════
// SPA ROUTER (Simple Page Navigation)
// ═══════════════════════════════════════════════════════════

function navigateTo(path) {
    // Map paths to HTML files
    const pages = {
        '/': 'index.html',
        '/photo': 'photography.html',
        '/music': 'music.html',
        '/tech': 'coding.html'
    };

    const targetFile = pages[path] || pages['/'];

    // Fade out current page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';

    setTimeout(() => {
        // Navigate to new page
        window.location.href = targetFile;
    }, 300);
}

// ═══════════════════════════════════════════════════════════
// SCROLL INDICATOR (Navbar)
// ═══════════════════════════════════════════════════════════

const scrollIndicator = document.querySelector('.scroll-indicator');

window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

    if (scrollPercent > 10) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
    } else {
        scrollIndicator.style.opacity = '0.5';
        scrollIndicator.style.pointerEvents = 'auto';
    }
});

// ═══════════════════════════════════════════════════════════
// SKILL BUBBLE INTERACTIVITY
// ═══════════════════════════════════════════════════════════

document.querySelectorAll('.skill-bubble').forEach(bubble => {
    bubble.addEventListener('click', function() {
        const skill = this.dataset.skill;

        // Route based on skill type
        const routes = {
            'photography': '/photo',
            'music': '/music',
            'code': '/tech',
            'leadership': '#skills',
            'systems': '#skills',
            'creative': '#skills'
        };

        const route = routes[skill] || '/';
        if (route.startsWith('/')) {
            navigateTo(route);
        } else {
            scrollToSection(route);
        }
    });
});

// ═══════════════════════════════════════════════════════════
// PARALLAX EFFECT (Decorative elements)
// ═══════════════════════════════════════════════════════════

const decoItems = document.querySelectorAll('.deco-item');

window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    decoItems.forEach(item => {
        const speed = item.dataset.speed || 0.05;
        const xPos = x * 20 * speed;
        const yPos = y * 20 * speed;
        item.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
});

// ═══════════════════════════════════════════════════════════
// BUTTON INTERACTIONS
// ═══════════════════════════════════════════════════════════

document.querySelectorAll('.cta-primary, .cta-secondary').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ═══════════════════════════════════════════════════════════
// FADE IN ON LOAD
// ═══════════════════════════════════════════════════════════

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '1';
document.body.style.transition = 'opacity 0.5s ease';

// ═══════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION
// ═══════════════════════════════════════════════════════════

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        window.scrollBy(0, 100);
    } else if (e.key === 'ArrowUp') {
        window.scrollBy(0, -100);
    }
});

// ═══════════════════════════════════════════════════════════
// ACTIVE NAV LINK (Based on scroll position)
// ═══════════════════════════════════════════════════════════

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (window.scrollY >= top - 200 && window.scrollY < top + height - 200) {
            const id = section.getAttribute('id');
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Add active style to nav links
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--color-accent); }`;
document.head.appendChild(style);

// ═══════════════════════════════════════════════════════════
// SERVICES & TOOLS (Open external links)
// ═══════════════════════════════════════════════════════════

function openService(url) {
    // Use anchor tag for reliable cross-browser compatibility
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Attach click handlers to service cards using data-url attribute
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.service-card').forEach(card => {
        // Observe for animations
        observer.observe(card);

        // Add click handler
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('data-url');
            if (url) {
                openService(url);
            }
        });

        // Add keyboard accessibility (Enter key)
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const url = this.getAttribute('data-url');
                if (url) {
                    openService(url);
                }
            }
        });
    });
});

// ═══════════════════════════════════════════════════════════
// CONSOLE MESSAGE
// ═══════════════════════════════════════════════════════════

console.log('%c🎨 Dawid Gąsior — Portfolio', 'font-size: 20px; color: #ff6b6b; font-weight: bold;');
console.log('%cPhotography • Music • Engineering', 'font-size: 14px; color: #8f96a3;');
