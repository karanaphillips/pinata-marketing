// Scroll to top on page load (ensures all pages start at the top on refresh)
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

// Coming Soon Modal System (enabled only for blog and investor links)
function initComingSoonModal() {
    // Create modal HTML if it doesn't exist
    if (!document.getElementById('coming-soon-modal')) {
        const modalHTML = `
            <div id="coming-soon-modal" class="coming-soon-modal" role="dialog" aria-modal="true" aria-labelledby="coming-soon-title" aria-describedby="coming-soon-desc" tabindex="-1">
                <div class="coming-soon-overlay"></div>
                <div class="coming-soon-content">
                    <div class="coming-soon-icon" aria-hidden="true">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <h3 id="coming-soon-title">Coming Soon!</h3>
                    <p id="coming-soon-desc">We're working hard to bring you this feature. Stay tuned for updates!</p>
                    <button class="btn btn-primary close-modal" aria-label="Close modal">Got it!</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Get modal elements
    const modal = document.getElementById('coming-soon-modal');
    const overlay = document.querySelector('.coming-soon-overlay');
    const closeBtn = document.querySelector('.close-modal');


    // Focus management for accessibility
    let lastFocusedElement = null;

    // Trap focus inside modal
    function trapFocus(e) {
        if (!modal.classList.contains('active')) return;
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }

    // Function to show modal
    function showComingSoonModal(e) {
        e.preventDefault();
        lastFocusedElement = document.activeElement;
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        setTimeout(() => {
            // Focus the close button for accessibility
            const closeBtn = modal.querySelector('.close-modal');
            if (closeBtn) closeBtn.focus();
        }, 10);
        document.addEventListener('keydown', trapFocus);
    }

    // Function to hide modal
    function hideComingSoonModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', trapFocus);
        if (lastFocusedElement) lastFocusedElement.focus();
    }

    // Event listeners
    if (closeBtn) closeBtn.addEventListener('click', hideComingSoonModal);
    if (overlay) overlay.addEventListener('click', hideComingSoonModal);
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            hideComingSoonModal();
        }
    });

    // Only enable for blog and investor links
    const comingSoonLinks = document.querySelectorAll('a[href="investors.html"], a[href="blog.html"]');
    comingSoonLinks.forEach(link => {
        link.addEventListener('click', showComingSoonModal);
        link.classList.add('coming-soon-trigger');
    });
}

// Initialize coming soon modal for blog and investor links only
document.addEventListener('DOMContentLoaded', () => {
    initComingSoonModal();
});
// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');

// Mobile Navigation Toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

hamburger.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Navbar scroll effect
function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// Smooth scrolling for navigation links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const navbarHeight = navbar.offsetHeight || 80; // Get actual navbar height
        const offsetTop = element.offsetTop - navbarHeight - 20; // Add extra spacing
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Add smooth scrolling to all nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const target = link.getAttribute('href');
        
        // Only handle internal anchor links (starting with #)
        // Allow external page links (like ai-agents.html#pricing) to work normally
        if (target.startsWith('#') && !target.includes('.html')) {
            e.preventDefault();
            smoothScroll(target);
        }
        // For external links and page-with-anchor links, let the default behavior work
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements that should fade in
function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.feature-card, .pricing-card, .ecosystem-card, .stat-card, .app-card, .opportunity-card');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.innerText;
        const isPercentage = target.includes('%');
        const isDollar = target.includes('$');
        const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
        
        let current = 0;
        const increment = numericValue / 50; // Adjust speed here
        
        const updateCounter = () => {
            if (current < numericValue) {
                current += increment;
                let displayValue = Math.floor(current);
                
                if (isDollar) {
                    counter.textContent = '$' + displayValue.toFixed(1) + 'T';
                } else if (isPercentage) {
                    counter.textContent = displayValue + '%';
                } else if (target.includes('.')) {
                    counter.textContent = displayValue + '.9%';
                } else {
                    counter.textContent = displayValue + '%';
                }
                
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target; // Set final value
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Floating animation for hero cards
function initFloatingAnimation() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add mouse interaction
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-30px) scale(1.05)';
            card.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.4)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
        
        // Add random floating motion
        setInterval(() => {
            if (!card.matches(':hover')) {
                const randomY = Math.random() * 10 - 5;
                const randomX = Math.random() * 5 - 2.5;
                card.style.transform += ` translate(${randomX}px, ${randomY}px)`;
                
                setTimeout(() => {
                    if (!card.matches(':hover')) {
                        card.style.transform = card.style.transform.replace(/translate\([^)]*\)/, '');
                    }
                }, 2000);
            }
        }, 3000 + index * 1000);
    });
}

// Form handling
function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Add loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                
            } catch (error) {
                showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        zIndex: '10000',
        maxWidth: '300px',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
    });
    
    // Set background color based on type
    const colors = {
        success: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
        error: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
        info: 'linear-gradient(135deg, #7c3aed, #00d4ff)'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Parallax effect for background elements
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Apply parallax to hero background elements
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Typing animation for hero title
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing animation after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Enhanced card hover effects
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .pricing-card, .ecosystem-card, .app-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 212, 255, 0.1);
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: 100px;
                height: 100px;
                left: ${e.offsetX - 50}px;
                top: ${e.offsetY - 50}px;
            `;
            
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
}

// Add ripple animation CSS
function addRippleAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Wallet balance animation
function animateWalletBalance() {
    const balanceElements = document.querySelectorAll('.balance-info span');
    
    balanceElements.forEach(element => {
        const finalText = element.textContent;
        const isCredits = finalText.includes('Credits');
        const isCoupons = finalText.includes('Coupons');
        
        if (isCredits || isCoupons) {
            const number = parseInt(finalText.match(/\d+/)[0]);
            let current = 0;
            const increment = number / 30;
            
            const updateBalance = () => {
                if (current < number) {
                    current += increment;
                    if (isCredits) {
                        element.textContent = `Credits: ${Math.floor(current)}`;
                    } else {
                        element.textContent = `Coupons: $${Math.floor(current)}`;
                    }
                    requestAnimationFrame(updateBalance);
                } else {
                    element.textContent = finalText;
                }
            };
            
            updateBalance();
        }
    });
}

// Glitch effect for special elements
function addGlitchEffect() {
    const glitchElements = document.querySelectorAll('.nav-logo h2, .hero-title');
    
    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.animation = 'glitch 0.3s';
            setTimeout(() => {
                element.style.animation = '';
            }, 300);
        });
    });
    
    // Add glitch animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
    `;
    document.head.appendChild(style);
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00d4ff, #7c3aed);
        z-index: 10001;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Particle system for background
function initParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.3;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }
        
        draw() {
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = '#00d4ff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Enhanced pricing card interactions
function initPricingInteractions() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        const btn = card.querySelector('.btn');
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create selection effect
            card.style.border = '2px solid #00d4ff';
            card.style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                showNotification('Plan selected! Please fill out the contact form below.', 'success');
                smoothScroll('#contact');
                
                // Pre-fill form based on plan
                const planName = card.querySelector('h3').textContent;
                const interestSelect = document.getElementById('interest');
                if (interestSelect) {
                    if (planName.includes('Core')) {
                        interestSelect.value = 'core-plan';
                    } else if (planName.includes('Pro')) {
                        interestSelect.value = 'pro-plan';
                    }
                }
            }, 500);
            
            setTimeout(() => {
                card.style.border = '';
                card.style.transform = '';
            }, 2000);
        });
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    initFadeInAnimations();
    initFormHandling();
    initFloatingAnimation();
    initCardHoverEffects();
    initPricingInteractions();
    initROICalculator();
    
    // New enhanced functionality
    initAgentShowcase();
    initQNDMBSDemo();
    initVendorDashboard();
    initFAQAccordion();
    initCategoryFilters();
    initBlogInteractions();
    
    // Visual effects
    addRippleAnimation();
    addGlitchEffect();
    initScrollProgress();
    
    // Initialize particle system only on desktop for performance
    if (window.innerWidth > 768) {
        initParticleSystem();
    }
    
    // Observe stats section for counter animation
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Animate wallet balance when portal section is visible
    const portalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateWalletBalance();
                portalObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const portalSection = document.querySelector('.portal');
    if (portalSection) {
        portalObserver.observe(portalSection);
    }
});

// Agent Showcase Functionality
function initAgentShowcase() {
    const categoryButtons = document.querySelectorAll('.agents-showcase .category-btn');
    const agentCards = document.querySelectorAll('.agent-card');
    
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter agent cards
            agentCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Agent details buttons
    const detailButtons = document.querySelectorAll('.agent-details-btn');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const agentCard = e.target.closest('.agent-card');
            const agentName = agentCard.querySelector('h3').textContent;
            
            showNotification(`${agentName} details will be available in the full dashboard.`, 'info');
        });
    });
}

// QNDMBS Demo Animation
function initQNDMBSDemo() {
    const progressBar = document.querySelector('.progress-fill');
    const dataPoints = document.querySelectorAll('.data-point');
    
    if (progressBar) {
        // Animate progress bar when section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateQNDMBSDemo();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(progressBar.closest('.tech-demo'));
    }
    
    function animateQNDMBSDemo() {
        // Reset progress
        progressBar.style.width = '0%';
        dataPoints.forEach(point => point.classList.remove('active'));
        
        // Animate progress bar
        setTimeout(() => {
            progressBar.style.width = '85%';
        }, 500);
        
        // Animate data points appearing
        dataPoints.forEach((point, index) => {
            setTimeout(() => {
                point.style.opacity = '1';
                point.style.transform = 'translateY(0)';
                
                if (index === dataPoints.length - 1) {
                    setTimeout(() => {
                        point.classList.add('active');
                    }, 500);
                }
            }, 1000 + (index * 300));
        });
    }
}

// Vendor Dashboard Animation
function initVendorDashboard() {
    const chartBars = document.querySelectorAll('.chart-bar');
    const dashboardStats = document.querySelectorAll('.dashboard-stat .stat-number');
    
    if (chartBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateVendorDashboard();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(chartBars[0].closest('.vendor-dashboard'));
    }
    
    function animateVendorDashboard() {
        // Animate chart bars
        chartBars.forEach((bar, index) => {
            setTimeout(() => {
                const height = bar.style.height;
                bar.style.height = '0%';
                setTimeout(() => {
                    bar.style.height = height;
                }, 100);
            }, index * 200);
        });
        
        // Animate dashboard stats
        dashboardStats.forEach((stat, index) => {
            const finalValue = stat.textContent;
            const isNumber = /^\d+$/.test(finalValue);
            const isPercentage = finalValue.includes('%');
            const isDollar = finalValue.includes('$');
            
            if (isNumber || isPercentage || isDollar) {
                let targetValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
                let currentValue = 0;
                const increment = targetValue / 50;
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= targetValue) {
                        stat.textContent = finalValue;
                        clearInterval(counter);
                    } else {
                        if (isDollar) {
                            stat.textContent = '$' + Math.floor(currentValue).toLocaleString();
                        } else if (isPercentage) {
                            stat.textContent = Math.floor(currentValue) + '%';
                        } else {
                            stat.textContent = Math.floor(currentValue).toLocaleString();
                        }
                    }
                }, 50);
            }
        });
    }
}

// FAQ Accordion Functionality
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    const categoryButtons = document.querySelectorAll('.support .category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');
    
    // FAQ question toggles
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items in the same category
            const category = question.closest('.faq-category');
            category.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    
    // Category switching
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding category
            faqCategories.forEach(cat => {
                cat.classList.remove('active');
                if (cat.getAttribute('data-category') === category) {
                    cat.classList.add('active');
                }
            });
        });
    });
}

// Generic Category Filter System
function initCategoryFilters() {
    const filterSystems = document.querySelectorAll('[data-filter-system]');
    
    filterSystems.forEach(system => {
        const buttons = system.querySelectorAll('[data-category]');
        const items = system.querySelectorAll('[data-filter-item]');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                
                // Update active button
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter items
                items.forEach(item => {
                    const itemCategory = item.getAttribute('data-filter-item');
                    if (category === 'all' || itemCategory === category) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    });
}

// Blog Interactions
function initBlogInteractions() {
    const blogPosts = document.querySelectorAll('.blog-post');
    const readMoreLinks = document.querySelectorAll('.read-more');
    
    blogPosts.forEach(post => {
        post.addEventListener('click', () => {
            const title = post.querySelector('h4').textContent;
            showNotification(`"${title}" - Full article coming soon!`, 'info');
        });
    });
    
    readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showNotification('Full articles and case studies will be available in the complete platform.', 'info');
        });
    });
}

// Enhanced testimonial interactions
function initTestimonialEffects() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle glow effect
            card.style.boxShadow = '0 20px 60px rgba(0, 212, 255, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });
}

// Advanced navigation dropdown behavior
function initAdvancedNavigation() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    let activeDropdown = null;
    
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        
        dropdown.addEventListener('mouseenter', () => {
            if (activeDropdown && activeDropdown !== dropdown) {
                activeDropdown.querySelector('.dropdown-menu').style.opacity = '0';
                activeDropdown.querySelector('.dropdown-menu').style.visibility = 'hidden';
            }
            activeDropdown = dropdown;
        });
        
        dropdown.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (activeDropdown === dropdown) {
                    activeDropdown = null;
                }
            }, 100);
        });
    });
    
    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown') && activeDropdown) {
            activeDropdown.querySelector('.dropdown-menu').style.opacity = '0';
            activeDropdown.querySelector('.dropdown-menu').style.visibility = 'hidden';
            activeDropdown = null;
        }
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');
        
        if (heroContent) heroContent.style.opacity = '1';
        if (heroVisual) heroVisual.style.opacity = '1';
    }, 500);
});

// Prevent form spam
let formSubmissionCount = 0;
const maxSubmissions = 3;
const resetTime = 60000; // 1 minute

function checkFormSpam() {
    if (formSubmissionCount >= maxSubmissions) {
        showNotification('Too many submissions. Please wait before submitting again.', 'error');
        return false;
    }
    
    formSubmissionCount++;
    setTimeout(() => {
        formSubmissionCount = Math.max(0, formSubmissionCount - 1);
    }, resetTime);
    
    return true;
}

// Add to form submission handler
const originalFormHandler = initFormHandling;
initFormHandling = function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!checkFormSpam()) {
                return;
            }
            
            // Rest of the original form handling code...
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                
            } catch (error) {
                showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
};

// ROI Calculator Functionality
function initROICalculator() {
    const employeesInput = document.getElementById('employees');
    const salaryInput = document.getElementById('salary');
    const overheadInput = document.getElementById('overhead');
    
    const totalSalariesSpan = document.getElementById('totalSalaries');
    const totalOverheadSpan = document.getElementById('totalOverhead');
    const totalCurrentSpan = document.getElementById('totalCurrent');
    const aiCostSpan = document.getElementById('aiCost');
    const monthlySavingsSpan = document.getElementById('monthlySavings');
    const annualSavingsSpan = document.getElementById('annualSavings');
    
    if (!employeesInput || !salaryInput || !overheadInput) return;
    
    function calculateROI() {
        const employees = parseInt(employeesInput.value) || 0;
        const salary = parseInt(salaryInput.value) || 0;
        const overhead = parseInt(overheadInput.value) || 0;
        
        // Calculate current costs
        const totalSalaries = employees * salary;
        const totalOverheadCost = employees * overhead;
        const totalCurrent = totalSalaries + totalOverheadCost;
        
        // AI costs (fixed)
        const aiCost = 499;
        
        // Calculate savings
        const monthlySavings = totalCurrent - aiCost;
        const annualSavings = monthlySavings * 12;
        
        // Update display
        if (totalSalariesSpan) totalSalariesSpan.textContent = `$${totalSalaries.toLocaleString()}`;
        if (totalOverheadSpan) totalOverheadSpan.textContent = `$${totalOverheadCost.toLocaleString()}`;
        if (totalCurrentSpan) totalCurrentSpan.textContent = `$${totalCurrent.toLocaleString()}`;
        if (aiCostSpan) aiCostSpan.textContent = `$${aiCost.toLocaleString()}`;
        if (monthlySavingsSpan) monthlySavingsSpan.textContent = `$${monthlySavings.toLocaleString()}`;
        if (annualSavingsSpan) annualSavingsSpan.textContent = `$${annualSavings.toLocaleString()}`;
        
        // Add visual feedback for significant savings
        if (monthlySavings > 50000) {
            if (monthlySavingsSpan) monthlySavingsSpan.style.color = '#10b981';
            if (annualSavingsSpan) annualSavingsSpan.style.color = '#10b981';
        } else {
            if (monthlySavingsSpan) monthlySavingsSpan.style.color = '';
            if (annualSavingsSpan) annualSavingsSpan.style.color = '';
        }
    }
    
    // Add event listeners to all inputs
    [employeesInput, salaryInput, overheadInput].forEach(input => {
        input.addEventListener('input', calculateROI);
        input.addEventListener('change', calculateROI);
    });
    
    // Calculate initial values
    calculateROI();
}



// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        smoothScroll,
        showNotification,
        initFadeInAnimations,
        initFormHandling,
        initROICalculator,
        initComingSoonModal
    };
}