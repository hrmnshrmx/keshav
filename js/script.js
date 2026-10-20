// Keshav Sharma Portfolio - Vanilla JavaScript
// Mobile Menu Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav__link');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Toggle hamburger animation
        const bars = navToggle.querySelectorAll('.nav__toggle-bar');
        if (!isExpanded) {
            bars[0].style.transform = 'rotate(-45deg) translate(-7px, 7px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-7px, -7px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            const bars = navToggle.querySelectorAll('.nav__toggle-bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            const bars = navToggle.querySelectorAll('.nav__toggle-bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
}

// Theme Toggle (Optional but implemented)
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.theme-toggle__icon--sun');
const moonIcon = document.querySelector('.theme-toggle__icon--moon');

if (themeToggle) {
    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (currentTheme === 'light') {
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
    } else {
        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'light') {
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        } else {
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        }
    });
}

// Smooth scroll for anchor links (additional to CSS scroll-behavior)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Reveal Animation using IntersectionObserver
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Observe elements for scroll reveal
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll-reveal class to elements
    const elementsToReveal = document.querySelectorAll('.creation-card, .about__highlight, .process__step, .contact__method, .section-header');
    elementsToReveal.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formSubmit = document.getElementById('formSubmit');
const formSubmitText = document.getElementById('formSubmitText');
const formSubmitLoading = document.getElementById('formSubmitLoading');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const projectType = document.getElementById('projectType').value;
        const message = document.getElementById('message').value.trim();
        
        // Clear previous errors
        document.getElementById('nameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('messageError').textContent = '';
        if (formStatus) {
            formStatus.className = 'form__status';
            formStatus.textContent = '';
        }
        
        let hasError = false;
        
        // Validation
        if (!name) {
            document.getElementById('nameError').textContent = 'Name is required';
            hasError = true;
        }
        
        if (!email) {
            document.getElementById('emailError').textContent = 'Email is required';
            hasError = true;
        } else {
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if (!emailRegex.test(email)) {
                document.getElementById('emailError').textContent = 'Please enter a valid email';
                hasError = true;
            }
        }
        
        if (!message) {
            document.getElementById('messageError').textContent = 'Message is required';
            hasError = true;
        }
        
        if (hasError) {
            return;
        }
        
        // Show loading state
        if (formSubmit) formSubmit.disabled = true;
        if (formSubmitText) formSubmitText.style.display = 'none';
        if (formSubmitLoading) formSubmitLoading.style.display = 'inline';
        
        // Form submission configuration
        // Replace with your form endpoint (Formspree, Netlify Forms, etc.)
        const formEndpoint = ''; // e.g., 'https://formspree.io/f/yourformid'
        
        try {
            if (formEndpoint) {
                // Actual form submission
                const formData = new FormData(contactForm);
                const response = await fetch(formEndpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    if (formStatus) {
                        formStatus.className = 'form__status form__status--success';
                        formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                    }
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } else {
                // No endpoint configured - show configuration message
                if (formStatus) {
                    formStatus.className = 'form__status form__status--error';
                    formStatus.textContent = 'Form endpoint not configured. Please set up a form service (Formspree, Netlify Forms, etc.) in js/script.js';
                }
            }
        } catch (error) {
            if (formStatus) {
                formStatus.className = 'form__status form__status--error';
                formStatus.textContent = 'Error sending message. Please try again later.';
            }
        } finally {
            // Reset button state
            if (formSubmit) formSubmit.disabled = false;
            if (formSubmitText) formSubmitText.style.display = 'inline';
            if (formSubmitLoading) formSubmitLoading.style.display = 'none';
        }
    });
}

// Add smooth scroll padding for mobile
function updateScrollPadding() {
    const header = document.querySelector('.header');
    if (header) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.scrollPaddingTop = headerHeight + 'px';
    }
}

// Update on load and resize
window.addEventListener('load', updateScrollPadding);
window.addEventListener('resize', updateScrollPadding);

// Performance: Lazy load images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});

// Add keyboard navigation for mobile menu
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                const bars = navToggle.querySelectorAll('.nav__toggle-bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        }
    }
});
