// Tour dates data
const tourDates = [
    {
        date: "Apr 10, 2025",
        venue: "Brooklyn Music Kitchen",
        location: "New York, NY",
        status: "past",
        tickets: "Sold Out"
    },
    {
        date: "June 7, 2025", 
        venue: "The Triad",
        location: "New York, NY",
        status: "past",
        tickets: "Sold Out"
    },
    {
        date: "August 22, 2025",
        venue: "Kirmes",
        location: "Oberkirchen, Germany", 
        status: "upcoming",
        tickets: "Buy Tickets"
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initTourDates();
    initContactForm();
    initMediaGallery();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav__menu--active');
            navToggle.classList.toggle('nav__toggle--active');
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navMenu.classList.contains('nav__menu--active')) {
                    navMenu.classList.remove('nav__menu--active');
                    navToggle.classList.remove('nav__toggle--active');
                }
            }
        });
    });

    // Header background on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });
}

// Tour dates functionality
function initTourDates() {
    const tourGrid = document.getElementById('tourGrid');
    
    if (tourGrid) {
        tourGrid.innerHTML = tourDates.map(show => createTourCard(show)).join('');
    }
}

function createTourCard(show) {
    const isPast = show.status === 'past';
    const cardClass = isPast ? 'tour__card tour__card--past' : 'tour__card';
    const ticketsClass = show.tickets === 'Sold Out' ? 'tour__tickets tour__tickets--sold-out' : 'tour__tickets';
    
    return `
        <div class="${cardClass}">
            <div class="tour__date">${show.date}</div>
            <div class="tour__venue">${show.venue}</div>
            <div class="tour__location">${show.location}</div>
            <a href="#" class="${ticketsClass}" ${show.tickets === 'Sold Out' ? 'aria-disabled="true"' : ''}>
                ${show.tickets}
            </a>
        </div>
    `;
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const statusElement = document.getElementById('form-status'); // Add this in your HTML

    if (contactForm && statusElement) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            // Use fetch to submit the form data
            fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    statusElement.textContent = "Thanks for your submission!";
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            statusElement.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            statusElement.textContent = "Oops! There was a problem submitting your form";
                        }
                    });
                }
            })
            .catch(error => {
                statusElement.textContent = "Oops! There was a problem submitting your form";
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
}


// Media gallery functionality
function initMediaGallery() {
    const mediaItems = document.querySelectorAll('.media__item');
    
    mediaItems.forEach(item => {
        if (item.classList.contains('media__video')) {
            item.addEventListener('click', function() {
                // Simulate video play
                const playButton = item.querySelector('.video__play-button');
                if (playButton) {
                    playButton.textContent = '⏸';
                    setTimeout(() => {
                        playButton.textContent = '▶';
                    }, 2000);
                }
            });
        }
        
        if (item.classList.contains('media__photo')) {
            item.addEventListener('click', function() {
                // Create lightbox effect
                createLightbox(item);
            });
        }
    });
}

// Lightbox functionality for images
function createLightbox(mediaItem) {
    const img = mediaItem.querySelector('img');
    if (!img) return;
    
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox__content">
            <img src="${img.src}" alt="${img.alt}">
            <button class="lightbox__close">&times;</button>
        </div>
    `;
    
    // Add styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const content = lightbox.querySelector('.lightbox__content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
    `;
    
    const lightboxImg = lightbox.querySelector('img');
    lightboxImg.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 8px;
    `;
    
    const closeBtn = lightbox.querySelector('.lightbox__close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -10px;
        right: -10px;
        background: #00b4d8;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
    `;
    
    // Add event listeners
    const closeLightbox = () => {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
    
    // Add to DOM and show
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Trigger animation
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Performance optimization for scroll events
let ticking = false;

function updateScrollEffects() {
    // Add any scroll-based effects here
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});