// JavaScript for École Excellence Website
document.addEventListener('DOMContentLoaded', function() {
    console.log('Site web de l\'École Excellence chargé');

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation and AJAX submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = this.elements['name'].value.trim();
            const email = this.elements['email'].value.trim();
            const message = this.elements['message'].value.trim();
            const submitButton = this.querySelector('button[type="submit"]');

            // Validation côté client
            if (!name || !email || !message) {
                showNotification('Veuillez remplir tous les champs du formulaire.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
                return;
            }

            // Désactiver le bouton pendant l'envoi
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';

            try {
                const formData = new FormData(this);
                
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.success) {
                    showNotification(data.message, 'success');
                    this.reset(); // Réinitialiser le formulaire
                } else {
                    showNotification(data.message, 'error');
                }

            } catch (error) {
                showNotification('Erreur de connexion. Veuillez réessayer.', 'error');
                console.error('Erreur:', error);
            } finally {
                // Réactiver le bouton
                submitButton.disabled = false;
                submitButton.textContent = 'Envoyer';
            }
        });
    }

    // Image gallery lightbox functionality
    const galleryImages = document.querySelectorAll('.gallery-grid img');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            createLightbox(this.src, this.alt);
        });
    });

    function createLightbox(src, alt) {
        // Create lightbox overlay
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="${alt}">
                <div class="lightbox-caption">${alt}</div>
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#lightbox-styles')) {
            const styles = document.createElement('style');
            styles.id = 'lightbox-styles';
            styles.textContent = `
                .lightbox {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    opacity: 0;
                    animation: fadeIn 0.3s ease forwards;
                }
                
                .lightbox-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }
                
                .lightbox-content img {
                    max-width: 100%;
                    max-height: 80vh;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }
                
                .lightbox-caption {
                    color: white;
                    text-align: center;
                    margin-top: 15px;
                    font-size: 1.2rem;
                }
                
                .lightbox-close {
                    position: absolute;
                    top: -40px;
                    right: -40px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 3rem;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .lightbox-close:hover {
                    color: #f39c12;
                }
                
                @keyframes fadeIn {
                    to { opacity: 1; }
                }
                
                @keyframes fadeOut {
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add to page
        document.body.appendChild(lightbox);
        
        // Close functionality
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', () => {
            lightbox.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                if (lightbox.parentElement) {
                    lightbox.remove();
                }
            }, 300);
        });
        
        // Close on overlay click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    if (lightbox.parentElement) {
                        lightbox.remove();
                    }
                }, 300);
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function handleEsc(e) {
            if (e.key === 'Escape') {
                lightbox.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    if (lightbox.parentElement) {
                        lightbox.remove();
                    }
                }, 300);
                document.removeEventListener('keydown', handleEsc);
            }
        });
    }

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Additional functionality for testimonials carousel
function initTestimonialsCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }

    // Auto-rotate testimonials every 5 seconds
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);

    // Show first testimonial initially
    showTestimonial(0);
}

// Initialize carousel when page loads
window.addEventListener('load', initTestimonialsCarousel);

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                z-index: 10000;
                max-width: 300px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                animation: slideIn 0.3s ease;
            }
            .notification-success { background: #27ae60; }
            .notification-error { background: #e74c3c; }
            .notification-info { background: #3498db; }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                margin-left: 10px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
