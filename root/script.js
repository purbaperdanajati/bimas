setupCustomCursor();

// CSS animations for enhanced effects
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        pointer-events: none;
        animation: ripple-animation 0.6s linear;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .counting .stat-icon {
        animation: bounce 2s ease-in-out;
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(style);// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const backToTop = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-link');
const statCards = document.querySelectorAll('.stat-card');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    setupNavigation();
    setupScrollEffects();
    setupAnimations();
    setupTypingEffect();
    setupCounters();
    setupSmoothScrolling();
    setupImageEffects();
    setupBackgroundAnimations();
}

// Navigation functionality
function setupNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Scroll effects
function setupScrollEffects() {
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar background change
    if (scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        const particles = document.querySelector('.hero-particles');
        if (particles && scrollY < hero.offsetHeight) {
            particles.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
    }

    // Animate elements on scroll
    animateOnScroll();
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Animate elements when they come into view
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Trigger counter animation for stat cards
                if (entry.target.classList.contains('stat-card')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.about-card, .stat-card, .org-card, .contact-card, .visi-card, .misi-card, .misi-item');
    elementsToAnimate.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animated');
            
            if (element.classList.contains('stat-card')) {
                animateCounter(element);
            }
        }
    });
}

// Typing effect for hero title
function setupTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const text = typingText.textContent;
    typingText.textContent = '';
    typingText.style.borderRight = '3px solid white';
    
    let i = 0;
    const typeSpeed = 100;
    
    function typeWriter() {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                typingText.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
}

// Counter animation for statistics
function setupCounters() {
    statCards.forEach(card => {
        const numberElement = card.querySelector('.stat-number');
        if (numberElement) {
            numberElement.textContent = '0';
        }
    });
}

function animateCounter(card) {
    if (card.dataset.animated) return;
    card.dataset.animated = 'true';
    
    const numberElement = card.querySelector('.stat-number');
    const targetNumber = parseInt(card.dataset.count);
    
    if (!numberElement || !targetNumber) return;
    
    const duration = 2000;
    const increment = targetNumber / (duration / 16);
    let currentNumber = 0;
    
    const counter = setInterval(() => {
        currentNumber += increment;
        
        if (currentNumber >= targetNumber) {
            numberElement.textContent = targetNumber.toLocaleString();
            clearInterval(counter);
        } else {
            numberElement.textContent = Math.floor(currentNumber).toLocaleString();
        }
    }, 16);
    
    // Add animation class for visual effect
    card.classList.add('counting');
    setTimeout(() => {
        card.classList.remove('counting');
    }, duration);
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top button
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hero buttons smooth scroll
    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Image effects and interactions
function setupImageEffects() {
    // Team photo hover effect
    const teamPhoto = document.querySelector('.team-photo');
    const imageContainer = document.querySelector('.image-container');
    
    if (teamPhoto && imageContainer) {
        imageContainer.addEventListener('mouseenter', function() {
            this.style.transform = 'perspective(1000px) rotateY(0deg) scale(1.05)';
        });
        
        imageContainer.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(-10deg) scale(1)';
        });
    }

    // Staff cards hover effects
    const staffCards = document.querySelectorAll('.org-card');
    staffCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // About cards stagger animation
    const aboutCards = document.querySelectorAll('.about-card');
    aboutCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
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

// Handle window resize
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    // Recalculate positions for animations
    updateActiveNavLink();
}, 250));

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    // Scroll to top with Home key
    if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// Handle visibility change (for performance)
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Resume animations when page becomes visible
        updateActiveNavLink();
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Initialize AOS (Animate On Scroll) alternative
    setTimeout(() => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((element, index) => {
            setTimeout(() => {
                if (isElementInViewport(element)) {
                    element.classList.add('animated');
                }
            }, index * 100);
        });
    }, 500);
});

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn(`Image failed to load: ${this.src}`);
        });
    });
});

// Performance optimization: Lazy loading for images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
}

// Call lazy loading setup
setupLazyLoading();

// Add custom cursor effect for interactive elements
function setupCustomCursor() {
    const interactiveElements = document.querySelectorAll('a, button, .org-card, .about-card, .stat-card, .visi-card, .misi-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            document.body.style.cursor = 'pointer';
        });
        
        element.addEventListener('mouseleave', function() {
            document.body.style.cursor = 'default';
        });
    });
}

// Setup background animations for all sections
function setupBackgroundAnimations() {
    // Visi Misi floating shapes animation
    const floatingShapes = document.querySelector('.floating-shapes');
    if (floatingShapes) {
        let animationId;
        const startAnimation = () => {
            let position = 0;
            const animate = () => {
                position += 0.5;
                floatingShapes.style.transform = `translateX(${Math.sin(position * 0.01) * 50}px) translateY(${Math.cos(position * 0.008) * 30}px) rotate(${position * 0.5}deg)`;
                animationId = requestAnimationFrame(animate);
            };
            animate();
        };
        
        // Start animation when section is visible
        const visiMisiSection = document.querySelector('.visi-misi');
        if (visiMisiSection) {
            const visiMisiObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startAnimation();
                    } else {
                        if (animationId) {
                            cancelAnimationFrame(animationId);
                        }
                    }
                });
            });
            visiMisiObserver.observe(visiMisiSection);
        }
    }
    
    // Add staggered animation to misi items
    const misiItems = document.querySelectorAll('.misi-item');
    misiItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        
        // Trigger animation when visible
        const itemObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = `fadeInLeft 0.6s ease forwards`;
                    entry.target.style.animationDelay = `${index * 0.2}s`;
                }
            });
        }, { threshold: 0.5 });
        
        itemObserver.observe(item);
    });
    
    // Enhanced card hover effects
    setupEnhancedHoverEffects();
}

function setupEnhancedHoverEffects() {
    // Visi Misi cards
    const visiMisiCards = document.querySelectorAll('.visi-card, .misi-card');
    visiMisiCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.5)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
        });
    });
    
    // About cards with wave effect
    const aboutCards = document.querySelectorAll('.about-card');
    aboutCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            // Add ripple effect
            aboutCards.forEach((otherCard, otherIndex) => {
                if (otherIndex !== index) {
                    otherCard.style.transform = `translateY(${Math.abs(otherIndex - index) * 2}px) scale(0.98)`;
                    otherCard.style.opacity = '0.8';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            aboutCards.forEach(otherCard => {
                otherCard.style.transform = 'translateY(0) scale(1)';
                otherCard.style.opacity = '1';
            });
        });
    });
    
    // Stats cards with pulse effect
    const statsCards = document.querySelectorAll('.stat-card');
    statsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.stat-icon');
            if (icon) {
                icon.style.animation = 'pulse 0.6s ease-in-out';
            }
        });
    });
}

// Add ripple effect to buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .back-to-top');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

addRippleEffect();

// Console welcome message
console.log(
    '%c🕌 Website Seksi Bimas Kemenag Indramayu %c\n' +
    'Developed with ❤️ for serving the community\n' +
    'Contact: bimas@kemenagindramayu.go.id',
    'color: #2E7D32; font-size: 16px; font-weight: bold;',
    'color: #666; font-size: 12px;'
);
