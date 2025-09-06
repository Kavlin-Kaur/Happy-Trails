// Happy Trails - Enhanced JavaScript with Kavlin's Magic Touch ✨
// Crafted with love, code, and poetry by Kavlin 💖

document.addEventListener("DOMContentLoaded", function() {
    console.log("🌟 Happy Trails is loading with Kavlin's magic! ✨");
    
    // Initialize all components
    initializeAnimations();
    initializeFormHandlers();
    initializeDateInputs();
    initializeTooltips();
    initializeScrollEffects();
    initializeKavlinMagic();
    
    console.log("💖 All systems ready! Welcome to Happy Trails! 🚌");
});

// ========================================
// 🎨 Beautiful Animations & Effects
// ========================================

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInFromLeft 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    document.querySelectorAll('.feature-card, .tribute-card, .quick-search').forEach(el => {
        observer.observe(el);
    });
    
    // Floating animation for hero elements
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        heroImage.style.animation = 'float 3s ease-in-out infinite';
    }
    
    // Sparkle effect for feature icons
    document.querySelectorAll('.feature-icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.animation = 'sparkle 0.6s ease-in-out';
        });
        
        icon.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
}

// ========================================
// 📝 Enhanced Form Handling
// ========================================

function initializeFormHandlers() {
    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Enhanced password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        const strengthBar = document.querySelector('.password-strength .progress-bar');
        const strengthText = document.createElement('small');
        strengthText.className = 'strength-text mt-1 d-block';
        
        if (strengthBar && strengthBar.parentNode) {
            strengthBar.parentNode.parentNode.appendChild(strengthText);
        }
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            if (strengthBar) {
                strengthBar.style.width = strength.percentage + '%';
                strengthBar.className = `progress-bar ${strength.colorClass}`;
                strengthText.textContent = strength.text;
                strengthText.className = `strength-text mt-1 d-block ${strength.textClass}`;
            }
        });
    }
    
    // Form validation with beautiful feedback
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showFormError('Please fill in all required fields correctly! 💫');
            }
        });
    });
    
    // Real-time form validation
    const inputs = document.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 8) score += 20;
    else feedback.push('at least 8 characters');
    
    // Lowercase check
    if (/[a-z]/.test(password)) score += 20;
    else feedback.push('lowercase letters');
    
    // Uppercase check
    if (/[A-Z]/.test(password)) score += 20;
    else feedback.push('uppercase letters');
    
    // Number check
    if (/[0-9]/.test(password)) score += 20;
    else feedback.push('numbers');
    
    // Special character check
    if (/[^a-zA-Z0-9]/.test(password)) score += 20;
    else feedback.push('special characters');
    
    // Return strength object
    if (score < 40) {
        return {
            percentage: score,
            colorClass: 'bg-danger',
            textClass: 'text-danger',
            text: '😟 Weak - Add ' + feedback.slice(0, 2).join(', ')
        };
    } else if (score < 60) {
        return {
            percentage: score,
            colorClass: 'bg-warning',
            textClass: 'text-warning',
            text: '😐 Fair - Add ' + feedback.slice(0, 1).join(', ')
        };
    } else if (score < 80) {
        return {
            percentage: score,
            colorClass: 'bg-info',
            textClass: 'text-info',
            text: '😊 Good - Almost there!'
        };
    } else {
        return {
            percentage: score,
            colorClass: 'bg-success',
            textClass: 'text-success',
            text: '🎉 Excellent - Your password is strong!'
        };
    }
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    // Required field check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }
    }
    
    // Update field appearance
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        removeFieldError(field);
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        showFieldError(field, message);
    }
    
    return isValid;
}

function validateForm(form) {
    const fields = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Password confirmation check
    const password = form.querySelector('#password');
    const confirmPassword = form.querySelector('#confirmPassword');
    
    if (password && confirmPassword) {
        if (password.value !== confirmPassword.value) {
            showFieldError(confirmPassword, 'Passwords do not match');
            confirmPassword.classList.add('is-invalid');
            isValid = false;
        }
    }
    
    return isValid;
}

function showFieldError(field, message) {
    removeFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

function showFormError(message) {
    // Create a beautiful toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification error';
    toast.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        ${message}
        <button type="button" class="btn-close ms-auto" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// ========================================
// 📅 Date Input Enhancements
// ========================================

function initializeDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        // Set minimum date to today
        input.min = today;
        
        // Add custom styling and validation
        input.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const todayDate = new Date(today);
            
            if (selectedDate < todayDate) {
                this.value = today;
                showToast('Please select a date from today onwards! 📅', 'warning');
            }
        });
    });
}

// ========================================
// 🎯 Beautiful Tooltips
// ========================================

function initializeTooltips() {
    // Initialize Bootstrap tooltips if available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Custom tooltips for feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.03)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ========================================
// 📜 Scroll Effects
// ========================================

function initializeScrollEffects() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar show/hide on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
        
        // Parallax effect for hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroSection.style.transform = `translateY(${parallax}px)`;
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// ✨ Kavlin's Special Magic
// ========================================

function initializeKavlinMagic() {
    // Easter egg: Konami code for special message
    let konamiCode = [];
    const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up, Up, Down, Down, Left, Right, Left, Right, B, A
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join('') === konami.join('')) {
            showKavlinEasterEgg();
        }
    });
    
    // Sparkle cursor effect on special elements
    document.querySelectorAll('.kavlin-tribute, .script-font').forEach(element => {
        element.addEventListener('mousemove', createSparkle);
    });
    
    // Heartbeat effect for Kavlin signature
    const signature = document.querySelector('.kavlin-signature');
    if (signature) {
        setInterval(() => {
            signature.style.animation = 'heartbeat 1s ease-in-out';
            setTimeout(() => {
                signature.style.animation = 'heartbeat 3s ease-in-out infinite';
            }, 1000);
        }, 10000);
    }
    
    // Random poetry quotes that appear occasionally
    setTimeout(showRandomPoetryQuote, Math.random() * 30000 + 30000); // Show after 30-60 seconds
}

function createSparkle(e) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-effect';
    sparkle.style.left = e.pageX + 'px';
    sparkle.style.top = e.pageY + 'px';
    sparkle.innerHTML = '✨';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

function showKavlinEasterEgg() {
    const modal = document.createElement('div');
    modal.className = 'kavlin-modal';
    modal.innerHTML = `
        <div class="kavlin-modal-content">
            <h3 class="script-font text-warning">🎉 You found Kavlin's secret! 🎉</h3>
            <div class="poetry-quote">
                <p class="script-font">"In every line of code I write,<br>
                A piece of poetry takes flight.<br>
                For those who seek beyond the screen,<br>
                Will find the magic in between."</p>
                <small>- Kavlin's Secret Message ✨</small>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="btn btn-primary">
                Thank you, Kavlin! 💖
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 10000);
}

function showRandomPoetryQuote() {
    const quotes = [
        "\"Code is poetry in motion\" - Kavlin ✨",
        "\"Every bug is just a poem waiting to be fixed\" - Kavlin 🐛💖",
        "\"In the realm of ones and zeros, beauty blooms\" - Kavlin 🌸",
        "\"Functions and verses, both tell stories\" - Kavlin 📖",
        "\"Where logic meets imagination, magic happens\" - Kavlin 🎭"
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    showToast(randomQuote, 'poetry', 8000);
    
    // Schedule next quote
    setTimeout(showRandomPoetryQuote, Math.random() * 60000 + 120000); // Next in 2-3 minutes
}

// ========================================
// 🎪 Bus-specific Functionality
// ========================================

// Bus results page interactions
if (window.location.pathname.includes('bus_results')) {
    initializeBusResults();
}

function initializeBusResults() {
    // Hide all bus details initially
    document.querySelectorAll('.bus-details-row').forEach(row => {
        row.style.display = 'none';
    });
    
    // Add click handlers for bus rows
    document.querySelectorAll('.bus-row').forEach(row => {
        row.addEventListener('click', function() {
            const busId = this.getAttribute('data-bus-id');
            const detailsRow = document.getElementById('bus-details-' + busId);
            
            if (detailsRow) {
                // Hide other details first
                document.querySelectorAll('.bus-details-row').forEach(r => {
                    if (r !== detailsRow) r.style.display = 'none';
                });
                
                // Toggle current details
                if (detailsRow.style.display === 'none') {
                    detailsRow.style.display = 'table-row';
                    this.classList.add('selected');
                } else {
                    detailsRow.style.display = 'none';
                    this.classList.remove('selected');
                }
            }
        });
    });
}

// ========================================
// 🍞 Toast Notifications
// ========================================

function showToast(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        poetry: 'fa-feather-alt'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info} me-2"></i>
        ${message}
        <button type="button" class="btn-close ms-auto" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container or create one
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

// ========================================
// 🎨 Additional CSS for JS effects
// ========================================

// Add dynamic styles
const style = document.createElement('style');
style.textContent = `
    .sparkle-effect {
        position: absolute;
        pointer-events: none;
        font-size: 1rem;
        animation: sparkleFloat 1s ease-out forwards;
        z-index: 9999;
    }
    
    @keyframes sparkleFloat {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
    
    .kavlin-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    }
    
    .kavlin-modal-content {
        background: white;
        padding: 2rem;
        border-radius: 20px;
        text-align: center;
        max-width: 500px;
        margin: 1rem;
        box-shadow: 0 20px 40px rgba(255, 215, 0, 0.3);
        animation: slideInFromTop 0.5s ease-out;
    }
    
    @keyframes slideInFromTop {
        0% { opacity: 0; transform: translateY(-50px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    
    .toast-container {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        max-width: 350px;
    }
    
    .toast-notification {
        background: white;
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        border-left: 4px solid var(--primary-yellow);
        display: flex;
        align-items: center;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease-out;
    }
    
    .toast-notification.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .toast-notification.success { border-left-color: #28a745; }
    .toast-notification.error { border-left-color: #dc3545; }
    .toast-notification.warning { border-left-color: #ffc107; }
    .toast-notification.poetry { 
        border-left-color: #e91e63;
        background: linear-gradient(135deg, #fff, #fce4ec);
    }
    
    .btn-close {
        background: none;
        border: none;
        font-size: 0.8rem;
        opacity: 0.7;
        cursor: pointer;
    }
    
    .btn-close:hover { opacity: 1; }
    
    .bus-row.selected {
        background-color: #fff9e6 !important;
        border-left: 4px solid var(--primary-yellow);
    }
    
    @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
`;

document.head.appendChild(style);

// ========================================
// 💖 Final Touch - Welcome Message
// ========================================

// Show welcome message after everything loads
window.addEventListener('load', function() {
    setTimeout(() => {
        showToast('Welcome to Happy Trails! Crafted with 💖 by Kavlin ✨', 'poetry', 6000);
    }, 2000);
});

console.log("✨ Happy Trails JavaScript loaded successfully! Made with love by Kavlin 💖");