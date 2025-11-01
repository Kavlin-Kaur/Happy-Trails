/* ============================================
   🎨 POETRY CORNER - COMPLETE JAVASCRIPT
   Designed with love by Kavlin 💖
   All 4 Phases + Tab Navigation
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('✨ Poetry Corner loading with Kavlin\'s magic...');
    initializeAllPhases();
});

// ============================================
// GLOBAL INITIALIZATION
// ============================================

function initializeAllPhases() {
    initializeTabs();
    initializePhase1();
    initializePhase2();
    initializePhase3();
    initializePhase4();
    initializeBackToTop();
    console.log('💖 All Poetry Corner phases initialized successfully!');
}

// ============================================
// TAB NAVIGATION SYSTEM
// ============================================

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Scroll to tab content smoothly
            setTimeout(() => {
                document.getElementById(tabId).scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
            
            // Show toast
            const tabName = this.querySelector('.tab-btn-label').textContent;
            showPoetryToast(`Switched to: ${tabName} ✨`);
        });
    });
    
    console.log('📑 Tab navigation initialized');
}

// ============================================
// PHASE 1: TRAVEL POETRY FUNCTIONS
// ============================================

function initializePhase1() {
    setupFilterButtons();
    setupScrollAnimations();
    addPoetryMagic();
    console.log('📖 Phase 1: Travel Poetry initialized');
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const poemCards = document.querySelectorAll('.poem-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            poemCards.forEach(card => {
                const theme = card.getAttribute('data-theme');
                const authorType = card.getAttribute('data-author-type');
                
                let shouldShow = false;
                
                if (filter === 'all') {
                    shouldShow = true;
                } else if (filter === 'kavlin' && authorType === 'kavlin') {
                    shouldShow = true;
                } else if (filter === 'classic' && authorType === 'classic') {
                    shouldShow = true;
                } else if (theme === filter) {
                    shouldShow = true;
                }

                if (shouldShow) {
                    card.style.display = 'block';
                    card.style.animation = 'tabFadeIn 0.6s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });

            showPoetryToast(`Filtering by: ${this.textContent.trim()} ✨`);
        });
    });
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-header, .poetry-filters').forEach(el => {
        observer.observe(el);
    });
}

function sharePoem(title, author) {
    const text = `"${title}" by ${author} - From Happy Trails Poetry Corner 💖`;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: window.location.href
        }).then(() => {
            showPoetryToast('Poem shared successfully! 🎉');
        }).catch(err => {
            console.log('Share cancelled');
        });
    } else {
        navigator.clipboard.writeText(text + '\n' + window.location.href).then(() => {
            showPoetryToast('Poem link copied to clipboard! 📋');
        });
    }
}

function savePoem(button) {
    const icon = button.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.style.color = '#FF6347';
        showPoetryToast('Poem saved to your collection! 💖');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.style.color = '';
        showPoetryToast('Poem removed from collection');
    }
}

function loadMorePoems() {
    showPoetryToast('Loading more beautiful poetry... ✨');
    setTimeout(() => {
        showPoetryToast('More poems coming soon! Stay tuned 📖', 3000);
    }, 1000);
}

function addPoetryMagic() {
    const poemCards = document.querySelectorAll('.poem-card');
    
    poemCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        });
    });

    setInterval(createSparkle, 3000);
}

function createSparkle() {
    const sparkleEmojis = ['✨', '💫', '⭐', '🌟'];
    const randomEmoji = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-effect';
    sparkle.textContent = randomEmoji;
    sparkle.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
        font-size: 1.5rem;
        pointer-events: none;
        animation: sparkleFloat 2s ease-out forwards;
        z-index: 9999;
    `;
    
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 2000);
}

// ============================================
// PHASE 2: QUOTE OF THE DAY FUNCTIONS
// ============================================

function initializePhase2() {
    setupQuoteCarousel();
    addQuoteAnimations();
    console.log('💬 Phase 2: Quote of the Day initialized');
}

function shareQuote(quote, author) {
    const text = `"${quote}" — ${author}\n\nFrom Happy Trails Poetry Corner 💖`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Quote of the Day',
            text: text,
            url: window.location.href
        }).then(() => {
            showPoetryToast('Quote shared successfully! 🎉');
        }).catch(() => {
            copyQuoteToClipboard(text);
        });
    } else {
        copyQuoteToClipboard(text);
    }
}

function copyQuoteToClipboard(text) {
    navigator.clipboard.writeText(text + '\n' + window.location.href).then(() => {
        showPoetryToast('Quote copied to clipboard! 📋');
    }).catch(() => {
        showPoetryToast('Unable to copy. Please try again.', 3000);
    });
}

function saveQuoteOfDay(button) {
    const icon = button.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.style.background = 'linear-gradient(135deg, #FFD700, #FF8C00)';
        button.style.color = 'white';
        showPoetryToast('Quote saved to your collection! 💖');
        animateStatNumber();
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.style.background = '';
        button.style.color = '';
        showPoetryToast('Quote removed from collection');
    }
}

function animateStatNumber() {
    const savesStat = document.querySelector('.stat-item:last-child .stat-number');
    if (savesStat) {
        const currentValue = parseInt(savesStat.textContent.replace(/,/g, ''));
        const newValue = currentValue + 1;
        
        savesStat.style.transform = 'scale(1.3)';
        savesStat.style.color = '#FFD700';
        
        setTimeout(() => {
            savesStat.textContent = newValue.toLocaleString();
            setTimeout(() => {
                savesStat.style.transform = 'scale(1)';
                savesStat.style.color = '';
            }, 300);
        }, 200);
    }
}

function downloadQuoteImage() {
    showPoetryToast('Preparing your beautiful quote image... 🎨');
    setTimeout(() => {
        showPoetryToast('Quote image download will be available soon! 📥', 3000);
    }, 1500);
}

function scrollQuotesCarousel(direction) {
    const carousel = document.getElementById('quotesCarousel');
    const scrollAmount = 325;
    
    if (direction === 'left') {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

function setupQuoteCarousel() {
    const carousel = document.getElementById('quotesCarousel');
    if (!carousel) return;
    
    carousel.addEventListener('mouseenter', () => {
        // Pause auto-scroll if implemented
    });
    
    carousel.addEventListener('mouseleave', () => {
        // Resume auto-scroll if implemented
    });
}

function viewFullQuote(index) {
    showPoetryToast('Loading full quote... ✨');
    
    const mainQuote = document.querySelector('.quote-main-card');
    if (mainQuote) {
        mainQuote.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    setTimeout(() => {
        showPoetryToast('This quote was featured on a previous day! 💫', 3000);
    }, 800);
}

function subscribeToQuotes(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('.subscribe-input');
    const email = emailInput.value.trim();
    
    if (!email) {
        showPoetryToast('Please enter your email address 📧', 3000);
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showPoetryToast('Please enter a valid email address ✉️', 3000);
        return;
    }
    
    const submitBtn = event.target.querySelector('.subscribe-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Subscribing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showPoetryToast('🎉 Welcome to the Poetry Family! Check your inbox 💌', 5000);
        emailInput.value = '';
        submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Subscribed!';
        submitBtn.style.background = '#28a745';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    }, 2000);
}

function addQuoteAnimations() {
    const quoteText = document.querySelector('.quote-text-main');
    if (quoteText) {
        quoteText.style.opacity = '0';
        quoteText.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            quoteText.style.transition = 'all 1s ease-out';
            quoteText.style.opacity = '1';
            quoteText.style.transform = 'translateY(0)';
        }, 500);
    }
    
    const statsBar = document.querySelector('.quote-stats-bar');
    if (statsBar) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsBar);
    }
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((stat) => {
        const finalValue = parseInt(stat.textContent.replace(/,/g, ''));
        let currentValue = 0;
        const increment = Math.ceil(finalValue / 50);
        
        const counter = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= finalValue) {
                stat.textContent = finalValue.toLocaleString();
                clearInterval(counter);
            } else {
                stat.textContent = currentValue.toLocaleString();
            }
        }, 30);
    });
}

// ============================================
// PHASE 3: USER SUBMISSION FUNCTIONS
// ============================================

function initializePhase3() {
    setupFormSteps();
    setupCharacterCounter();
    setupFormPreview();
    setupPoemSubmission();
    console.log('✍️ Phase 3: User-Submitted Poems initialized');
}

let currentStep = 1;
const totalSteps = 3;

function setupFormSteps() {
    showFormStep(1);
}

function showFormStep(stepNumber) {
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    const currentStepIndicator = document.querySelector(`.step[data-step="${stepNumber}"]`);
    
    if (currentStepElement) currentStepElement.classList.add('active');
    if (currentStepIndicator) currentStepIndicator.classList.add('active');
    
    currentStep = stepNumber;
}

function nextFormStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            showFormStep(currentStep + 1);
            
            if (currentStep === 3) {
                updatePreview();
            }
        }
    }
}

function prevFormStep() {
    if (currentStep > 1) {
        showFormStep(currentStep - 1);
    }
}

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const requiredInputs = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (input.type === 'checkbox') {
            if (!input.checked) {
                isValid = false;
                showPoetryToast('Please check the required checkbox ✓', 3000);
            }
        } else if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
            showPoetryToast('Please fill in all required fields 📝', 3000);
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    if (currentStep === 2) {
        const poemText = document.getElementById('poemText').value.trim();
        if (poemText.length < 50) {
            isValid = false;
            showPoetryToast('Your poem must be at least 50 characters ✍️', 3000);
        }
    }
    
    return isValid;
}

function setupCharacterCounter() {
    const textarea = document.getElementById('poemText');
    const charCount = document.getElementById('charCount');
    const charStatus = document.getElementById('charStatus');
    
    if (!textarea) return;
    
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;
        
        if (length < 50) {
            charStatus.textContent = `${50 - length} more characters needed`;
            charStatus.classList.remove('valid');
            charStatus.classList.add('invalid');
        } else {
            charStatus.textContent = 'Perfect length! ✨';
            charStatus.classList.remove('invalid');
            charStatus.classList.add('valid');
        }
    });
}

function setupFormPreview() {
    const titleInput = document.getElementById('poemTitle');
    const themeInput = document.getElementById('poemTheme');
    const locationInput = document.getElementById('poemLocation');
    const poemTextInput = document.getElementById('poemText');
    
    if (titleInput) titleInput.addEventListener('input', updatePreview);
    if (themeInput) themeInput.addEventListener('change', updatePreview);
    if (locationInput) locationInput.addEventListener('input', updatePreview);
    if (poemTextInput) poemTextInput.addEventListener('input', updatePreview);
}

function updatePreview() {
    const title = document.getElementById('poemTitle')?.value || 'Your Title';
    const theme = document.getElementById('poemTheme')?.value || 'Theme';
    const location = document.getElementById('poemLocation')?.value || 'Location';
    const poemText = document.getElementById('poemText')?.value || 'Your poem will appear here...';
    
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewTheme').textContent = theme;
    document.getElementById('previewLocation').textContent = location;
    document.getElementById('previewText').textContent = poemText;
}

function setupPoemSubmission() {
    const form = document.getElementById('poemSubmissionForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
            return;
        }
        
        const submitBtn = form.querySelector('.btn-form-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
        submitBtn.disabled = true;
        
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/poetry-corner/submit', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSubmissionSuccess();
                
                setTimeout(() => {
                    form.reset();
                    showFormStep(1);
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                showPoetryToast(result.message || 'Submission failed. Please try again.', 4000);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Submission error:', error);
            showPoetryToast('An error occurred. Please try again later. 😔', 4000);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function showSubmissionSuccess() {
    const modal = document.createElement('div');
    modal.className = 'submission-success-modal';
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3 class="success-title">Poem Submitted! 🎉</h3>
            <p class="success-message">
                Thank you for sharing your beautiful verse with the Happy Trails community!
                Your poem will be reviewed and published soon.
            </p>
            <p class="success-quote">
                "Every poem is a gift to the world" - Kavlin 💖
            </p>
            <button class="success-btn" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-heart me-2"></i>Continue Exploring
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
    setTimeout(() => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }, 8000);
    
    createConfetti();
}

function createConfetti() {
    const colors = ['#FFD700', '#FF8C00', '#FF6347', '#FFE4B5', '#FFC0CB'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                top: -10px;
                left: ${Math.random() * 100}vw;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
                animation-delay: ${Math.random() * 0.5}s;
                z-index: 9999;
            `;
            
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }, i * 30);
    }
}

function likePoem(button) {
    const poemId = button.dataset.poemId;
    const icon = button.querySelector('i');
    const likeCount = button.querySelector('.like-count');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.classList.add('liked');
        
        const currentCount = parseInt(likeCount.textContent);
        likeCount.textContent = currentCount + 1;
        
        button.style.animation = 'heartbeat 0.6s ease-in-out';
        setTimeout(() => button.style.animation = '', 600);
        
        showPoetryToast('Poem liked! 💖', 2000);
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.classList.remove('liked');
        
        const currentCount = parseInt(likeCount.textContent);
        likeCount.textContent = currentCount - 1;
        
        showPoetryToast('Like removed', 2000);
    }
}

function loadMoreCommunityPoems() {
    showPoetryToast('Loading more beautiful poems... ✨');
    setTimeout(() => {
        showPoetryToast('More community poems coming soon! Stay tuned 📖', 3000);
    }, 1500);
}

// ============================================
// PHASE 4: VERSES ALONG THE WAY FUNCTIONS
// ============================================

let routeMap = null;

function initializePhase4() {
    setupRouteFilters();
    initializeRouteMap();
    console.log('🗺️ Phase 4: Verses Along the Way initialized');
}

function setupRouteFilters() {
    const filterButtons = document.querySelectorAll('.route-filter-btn');
    const routeCards = document.querySelectorAll('.route-poem-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            routeCards.forEach(card => {
                const routeType = card.getAttribute('data-route-type');
                const origin = card.getAttribute('data-origin');
                const destination = card.getAttribute('data-destination');
                
                let shouldShow = false;
                
                if (filter === 'all') {
                    shouldShow = true;
                } else if (filter === 'kavlin' && card.classList.contains('kavlin-favorite')) {
                    shouldShow = true;
                } else if (origin === filter || destination === filter) {
                    shouldShow = true;
                }

                if (shouldShow) {
                    card.style.display = 'block';
                    card.style.animation = 'tabFadeIn 0.6s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });

            showPoetryToast(`Filtering routes: ${this.textContent.trim()} ✨`);
        });
    });
}

function initializeRouteMap() {
    const mapElement = document.getElementById('routeMap');
    if (!mapElement) return;
    
    // Initialize Leaflet map
    routeMap = L.map('routeMap').setView([30.9010, 77.1734], 10);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
    }).addTo(routeMap);
    
    // Add route markers (sample data)
    const routePoints = [
        { lat: 30.7333, lng: 77.1894, name: 'Dharampur', poem: 'Where Pine Forests Whisper' },
        { lat: 30.8542, lng: 77.1026, name: 'Solan', poem: 'Market Town Melodies' },
        { lat: 30.9010, lng: 77.1734, name: 'Barog', poem: 'Through the Tunnel of Time' },
        { lat: 30.8840, lng: 77.0540, name: 'Dagshai', poem: 'Cantonment Dreams' }
    ];
    
    routePoints.forEach(point => {
        const marker = L.marker([point.lat, point.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: '<i class="fas fa-map-marker-alt" style="color: #FFD700; font-size: 2rem;"></i>',
                iconSize: [30, 42],
                iconAnchor: [15, 42]
            })
        }).addTo(routeMap);
        
        marker.bindPopup(`
            <div style="text-align: center; padding: 10px;">
                <h4 style="color: #F57F17; font-family: 'Dancing Script', cursive; margin-bottom: 5px;">
                    ${point.name}
                </h4>
                <p style="font-style: italic; margin: 5px 0;">"${point.poem}"</p>
                <button onclick="viewRoutePoem('${point.name}')" style="
                    background: linear-gradient(135deg, #FFD700, #FF8C00);
                    border: none;
                    color: white;
                    padding: 8px 15px;
                    border-radius: 20px;
                    cursor: pointer;
                    margin-top: 10px;
                ">
                    Read Poem
                </button>
            </div>
        `);
    });
    
    // Draw route lines
    const routeLine = L.polyline(
        routePoints.map(p => [p.lat, p.lng]), 
        { color: '#FFD700', weight: 4, opacity: 0.7 }
    ).addTo(routeMap);
    
    console.log('🗺️ Route map initialized with poetry markers');
}

function viewRoutePoem(location) {
    showPoetryToast(`Loading poem for ${location}... ✨`);
    
    // Find the corresponding route card
    const routeCards = document.querySelectorAll('.route-poem-card');
    routeCards.forEach(card => {
        const routeName = card.querySelector('.route-name').textContent;
        if (routeName.includes(location)) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.animation = 'heartbeat 1s ease-in-out';
            setTimeout(() => card.style.animation = '', 1000);
        }
    });
}

function shareRoutePoem(routeName, poemTitle) {
    const text = `"${poemTitle}" - A poetic journey on the ${routeName} route with Happy Trails 🚌💖`;
    
    if (navigator.share) {
        navigator.share({
            title: poemTitle,
            text: text,
            url: window.location.href
        }).then(() => {
            showPoetryToast('Route poem shared! 🎉');
        }).catch(() => {
            navigator.clipboard.writeText(text + '\n' + window.location.href).then(() => {
                showPoetryToast('Route poem link copied! 📋');
            });
        });
    } else {
        navigator.clipboard.writeText(text + '\n' + window.location.href).then(() => {
            showPoetryToast('Route poem link copied! 📋');
        });
    }
}

function bookRoute(routeFrom, routeTo) {
    showPoetryToast(`Redirecting to book ${routeFrom} → ${routeTo}... 🎫`);
    
    setTimeout(() => {
        // In production, redirect to booking page with pre-filled data
        window.location.href = `/?from=${encodeURIComponent(routeFrom)}&to=${encodeURIComponent(routeTo)}`;
    }, 1500);
}

function loadMoreRoutePoems() {
    showPoetryToast('Loading more route poems... ✨');
    setTimeout(() => {
        showPoetryToast('More route poetry coming soon! 🗺️', 3000);
    }, 1500);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showPoetryToast(message, duration = 3000) {
    const existingToast = document.querySelector('.poetry-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'poetry-toast';
    toast.innerHTML = `
        <i class="fas fa-feather-alt me-2"></i>
        <span>${message}</span>
    `;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #FFD700, #FF8C00);
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function initializeBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
}

// Add necessary style animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes sparkleFloat {
        0% { opacity: 1; transform: translateY(0) scale(0); }
        50% { opacity: 1; transform: translateY(-30px) scale(1); }
        100% { opacity: 0; transform: translateY(-60px) scale(0.5); }
    }
    
    @keyframes confetti-fall {
        to { transform: translateY(100vh) rotate(360deg); }
    }
    
    .form-control-custom.is-invalid {
        border-color: #dc3545;
        animation: shake 0.5s;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .submission-success-modal {
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
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .submission-success-modal.show {
        opacity: 1;
    }
    
    .success-modal-content {
        background: white;
        border-radius: 30px;
        padding: 50px 40px;
        text-align: center;
        max-width: 500px;
        margin: 20px;
        box-shadow: 0 20px 60px rgba(255, 215, 0, 0.4);
        border: 3px solid #FFD700;
        animation: bounceIn 0.6s ease-out;
    }
    
    @keyframes bounceIn {
        0% { opacity: 0; transform: scale(0.3); }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    .success-icon {
        font-size: 5rem;
        color: #28a745;
        margin-bottom: 20px;
        animation: heartbeat 1s ease-in-out infinite;
    }
    
    .success-title {
        font-family: 'Dancing Script', cursive;
        font-size: 2.5rem;
        color: #F57F17;
        margin-bottom: 20px;
    }
    
    .success-message {
        font-size: 1.1rem;
        color: #6C757D;
        line-height: 1.7;
        margin-bottom: 25px;
    }
    
    .success-quote {
        font-family: 'Dancing Script', cursive;
        font-size: 1.2rem;
        color: #FFD700;
        margin-bottom: 30px;
        font-weight: 600;
    }
    
    .success-btn {
        background: linear-gradient(135deg, #FFD700, #FF8C00);
        border: none;
        color: white;
        padding: 15px 40px;
        border-radius: 30px;
        font-weight: 600;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
    }
    
    .success-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(255, 215, 0, 0.4);
    }
`;
document.head.appendChild(styleSheet);

console.log('💖 Poetry Corner by Kavlin - All phases loaded successfully!');