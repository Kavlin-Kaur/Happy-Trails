/* ============================================
   ✨ KAVLIN'S ENCHANTED 3D MEMORY GALLERY
   Interactive Particle System & 3D Effects
   Designed with love by Kavlin 💖
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('✨ Kavlin\'s Enchanted Gallery loading...');
    initializeEnchantedGallery();
});

// ============================================
// GLOBAL VARIABLES
// ============================================

let currentLightboxIndex = 0;
let visiblePhotos = [];
let allPhotos = [];
let particleCanvas, particleCtx;
let particles = [];
let mouseX = 0, mouseY = 0;

// ============================================
// INITIALIZATION
// ============================================

function initializeEnchantedGallery() {
    setupCurtainReveal();
    setupParticleSystem();
    setupParallaxEffect();
    setupFilters();
    setupSearch();
    setupSort();
    setupLightbox();
    setupPhotoActions();
    initializeBackToTop();
    addConstellationLines();
    
    // Store all photos for filtering
    allPhotos = Array.from(document.querySelectorAll('.photo-card'));
    visiblePhotos = [...allPhotos];
    
    console.log('💖 Enchanted Gallery initialized successfully!');
}

// ============================================
// CURTAIN REVEAL ANIMATION
// ============================================

function setupCurtainReveal() {
    setTimeout(() => {
        const curtainContainer = document.querySelector('.curtain-container');
        if (curtainContainer) {
            curtainContainer.classList.add('curtains-open');
            
            // Remove curtain after animation
            setTimeout(() => {
                curtainContainer.style.display = 'none';
            }, 1200);
        }
    }, 500);
}

// ============================================
// GOLDEN PARTICLE SYSTEM
// ============================================

function setupParticleSystem() {
    // Create canvas
    particleCanvas = document.createElement('canvas');
    particleCanvas.id = 'particleCanvas';
    document.querySelector('.gallery-wrapper').prepend(particleCanvas);
    
    particleCtx = particleCanvas.getContext('2d');
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = document.documentElement.scrollHeight;
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.3
        });
    }
    
    // Track mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY + window.scrollY;
    });
    
    // Animate particles
    animateParticles();
    
    // Resize handler
    window.addEventListener('resize', () => {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = document.documentElement.scrollHeight;
    });
    
    // Update canvas height on scroll
    window.addEventListener('scroll', () => {
        if (particleCanvas.height < document.documentElement.scrollHeight) {
            particleCanvas.height = document.documentElement.scrollHeight;
        }
    });
}

function animateParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    particles.forEach(particle => {
        // Draw particle
        particleCtx.beginPath();
        particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        particleCtx.fillStyle = `rgba(255, 215, 0, ${particle.opacity})`;
        particleCtx.fill();
        
        // Add glow effect
        particleCtx.shadowBlur = 10;
        particleCtx.shadowColor = 'rgba(255, 215, 0, 0.5)';
        
        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Mouse interaction
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            particle.x -= dx * 0.02;
            particle.y -= dy * 0.02;
        }
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > particleCanvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > particleCanvas.height) particle.speedY *= -1;
        
        // Keep in bounds
        particle.x = Math.max(0, Math.min(particleCanvas.width, particle.x));
        particle.y = Math.max(0, Math.min(particleCanvas.height, particle.y));
    });
    
    particleCtx.shadowBlur = 0;
    requestAnimationFrame(animateParticles);
}

// ============================================
// 3D PARALLAX EFFECT
// ============================================

function setupParallaxEffect() {
    const cards = document.querySelectorAll('.photo-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                translateY(-15px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(1.03)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ============================================
// CONSTELLATION LINES
// ============================================

function addConstellationLines() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    const cards = Array.from(document.querySelectorAll('.photo-card'));
    
    // Group cards by destination
    const destinations = {};
    cards.forEach(card => {
        const dest = card.getAttribute('data-destination');
        if (!destinations[dest]) destinations[dest] = [];
        destinations[dest].push(card);
    });
    
    // Draw lines between cards of same destination
    Object.values(destinations).forEach(group => {
        if (group.length < 2) return;
        
        for (let i = 0; i < group.length - 1; i++) {
            const card1 = group[i];
            const card2 = group[i + 1];
            
            const rect1 = card1.getBoundingClientRect();
            const rect2 = card2.getBoundingClientRect();
            
            const x1 = rect1.left + rect1.width / 2;
            const y1 = rect1.top + rect1.height / 2 + window.scrollY;
            const x2 = rect2.left + rect2.width / 2;
            const y2 = rect2.top + rect2.height / 2 + window.scrollY;
            
            const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
            
            const line = document.createElement('div');
            line.className = 'constellation-line';
            line.style.width = `${distance}px`;
            line.style.left = `${x1}px`;
            line.style.top = `${y1}px`;
            line.style.transform = `rotate(${angle}deg)`;
            
            galleryGrid.appendChild(line);
        }
    });
}

// ============================================
// FILTER SYSTEM
// ============================================

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter-type');
            const filterValue = this.getAttribute('data-filter');
            
            // Update active state
            const sameTypeButtons = document.querySelectorAll(`[data-filter-type="${filterType}"]`);
            sameTypeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filters
            applyFilters();
            
            showGalleryToast(`Filtering: ${this.textContent.trim()} ✨`);
        });
    });
}

function applyFilters() {
    const destinationFilter = document.querySelector('[data-filter-type="destination"].active').getAttribute('data-filter');
    const typeFilter = document.querySelector('[data-filter-type="type"].active').getAttribute('data-filter');
    const seasonFilter = document.querySelector('[data-filter-type="season"].active').getAttribute('data-filter');
    
    visiblePhotos = allPhotos.filter(photo => {
        const photoDestination = photo.getAttribute('data-destination');
        const photoType = photo.getAttribute('data-type');
        const photoSeason = photo.getAttribute('data-season');
        
        const matchDestination = destinationFilter === 'all' || photoDestination === destinationFilter;
        const matchType = typeFilter === 'all' || photoType === typeFilter;
        const matchSeason = seasonFilter === 'all' || photoSeason === seasonFilter;
        
        return matchDestination && matchType && matchSeason;
    });
    
    // Update display with animation
    allPhotos.forEach(photo => {
        photo.style.opacity = '0';
        photo.style.transform = 'scale(0.8)';
        setTimeout(() => {
            photo.classList.add('hidden');
        }, 300);
    });
    
    setTimeout(() => {
        visiblePhotos.forEach((photo, index) => {
            photo.classList.remove('hidden');
            setTimeout(() => {
                photo.style.opacity = '1';
                photo.style.transform = '';
            }, index * 50);
        });
    }, 350);
    
    // Redraw constellation lines
    setTimeout(() => {
        document.querySelectorAll('.constellation-line').forEach(line => line.remove());
        addConstellationLines();
    }, 400);
    
    updateResultsCount();
}

function updateResultsCount() {
    const count = visiblePhotos.length;
    const total = allPhotos.length;
    
    if (count === 0) {
        showGalleryToast('No photos found. Try different filters! 🔍', 3000);
    } else if (count < total) {
        showGalleryToast(`Showing ${count} of ${total} photos 📸`, 2000);
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function setupSearch() {
    const searchForm = document.getElementById('gallerySearchForm');
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = this.querySelector('.search-input').value.trim();
        
        if (searchTerm) {
            searchPhotos(searchTerm);
        } else {
            showGalleryToast('Please enter a search term 🔍', 3000);
        }
    });
}

function searchPhotos(searchTerm) {
    showGalleryToast(`Searching for: "${searchTerm}"... 🔍`);
    
    const searchLower = searchTerm.toLowerCase();
    let foundCount = 0;
    
    allPhotos.forEach(photo => {
        const location = photo.querySelector('.photo-location')?.textContent.toLowerCase() || '';
        const photographer = photo.querySelector('.photo-photographer')?.textContent.toLowerCase() || '';
        const destination = photo.getAttribute('data-destination').toLowerCase();
        const type = photo.getAttribute('data-type').toLowerCase();
        
        if (location.includes(searchLower) || 
            photographer.includes(searchLower) || 
            destination.includes(searchLower) || 
            type.includes(searchLower)) {
            photo.classList.remove('hidden');
            photo.style.opacity = '1';
            photo.style.transform = '';
            foundCount++;
        } else {
            photo.style.opacity = '0';
            photo.style.transform = 'scale(0.8)';
            setTimeout(() => {
                photo.classList.add('hidden');
            }, 300);
        }
    });
    
    visiblePhotos = Array.from(document.querySelectorAll('.photo-card:not(.hidden)'));
    
    setTimeout(() => {
        if (foundCount > 0) {
            showGalleryToast(`Found ${foundCount} photo${foundCount !== 1 ? 's' : ''} 📸`, 3000);
        } else {
            showGalleryToast('No photos found. Try a different search! 🤔', 3000);
        }
        
        // Redraw constellation lines
        document.querySelectorAll('.constellation-line').forEach(line => line.remove());
        addConstellationLines();
    }, 500);
}

// ============================================
// SORT FUNCTIONALITY
// ============================================

function setupSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        sortPhotos(sortValue);
    });
}

function sortPhotos(sortBy) {
    const galleryGrid = document.querySelector('.gallery-grid');
    let sortedPhotos = [...visiblePhotos];
    
    switch(sortBy) {
        case 'latest':
            sortedPhotos.sort((a, b) => {
                const dateA = new Date(a.getAttribute('data-date'));
                const dateB = new Date(b.getAttribute('data-date'));
                return dateB - dateA;
            });
            showGalleryToast('Sorted by: Latest First 📅');
            break;
            
        case 'popular':
            sortedPhotos.sort((a, b) => {
                const likesA = parseInt(a.getAttribute('data-likes'));
                const likesB = parseInt(b.getAttribute('data-likes'));
                return likesB - likesA;
            });
            showGalleryToast('Sorted by: Most Popular ❤️');
            break;
            
        case 'views':
            sortedPhotos.sort((a, b) => {
                const viewsA = parseInt(a.getAttribute('data-views'));
                const viewsB = parseInt(b.getAttribute('data-views'));
                return viewsB - viewsA;
            });
            showGalleryToast('Sorted by: Most Viewed 👁️');
            break;
    }
    
    // Re-append sorted photos with animation
    sortedPhotos.forEach((photo, index) => {
        photo.style.opacity = '0';
        photo.style.transform = 'scale(0.8)';
    });
    
    setTimeout(() => {
        sortedPhotos.forEach(photo => {
            galleryGrid.appendChild(photo);
        });
        
        setTimeout(() => {
            sortedPhotos.forEach((photo, index) => {
                setTimeout(() => {
                    photo.style.opacity = '1';
                    photo.style.transform = '';
                }, index * 50);
            });
            
            // Redraw constellation lines
            document.querySelectorAll('.constellation-line').forEach(line => line.remove());
            addConstellationLines();
        }, 100);
    }, 300);
}

// ============================================
// LIGHTBOX FUNCTIONALITY
// ============================================

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    // Open lightbox on photo click
    document.addEventListener('click', function(e) {
        const photoCard = e.target.closest('.photo-card');
        if (photoCard && !e.target.closest('.photo-action-btn')) {
            const photoIndex = visiblePhotos.indexOf(photoCard);
            if (photoIndex !== -1) {
                openLightbox(photoIndex);
            }
        }
    });
    
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPreviousPhoto);
    if (nextBtn) nextBtn.addEventListener('click', showNextPhoto);
    
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) closeLightbox();
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPreviousPhoto();
            if (e.key === 'ArrowRight') showNextPhoto();
        }
    });
}

function openLightbox(index) {
    currentLightboxIndex = index;
    const photo = visiblePhotos[index];
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxLocation = document.querySelector('.lightbox-location');
    const lightboxPhotographer = document.querySelector('.lightbox-photographer');
    
    const imgSrc = photo.querySelector('.photo-image').src;
    const location = photo.querySelector('.photo-location').textContent;
    const photographer = photo.querySelector('.photo-photographer').textContent;
    
    lightboxImage.src = imgSrc;
    lightboxLocation.textContent = location;
    lightboxPhotographer.textContent = photographer;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showPreviousPhoto() {
    currentLightboxIndex = (currentLightboxIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
    updateLightboxPhoto();
}

function showNextPhoto() {
    currentLightboxIndex = (currentLightboxIndex + 1) % visiblePhotos.length;
    updateLightboxPhoto();
}

function updateLightboxPhoto() {
    const photo = visiblePhotos[currentLightboxIndex];
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxLocation = document.querySelector('.lightbox-location');
    const lightboxPhotographer = document.querySelector('.lightbox-photographer');
    
    lightboxImage.style.opacity = '0';
    lightboxImage.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        lightboxImage.src = photo.querySelector('.photo-image').src;
        lightboxLocation.textContent = photo.querySelector('.photo-location').textContent;
        lightboxPhotographer.textContent = photo.querySelector('.photo-photographer').textContent;
        
        lightboxImage.style.opacity = '1';
        lightboxImage.style.transform = 'scale(1)';
    }, 200);
}

// ============================================
// PHOTO ACTIONS
// ============================================

function setupPhotoActions() {
    // Event delegation handled via onclick in HTML
}

function likePhoto(button, photoId) {
    const icon = button.querySelector('i');
    const likeCountSpan = button.closest('.photo-card').querySelector('.stat.likes span');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.classList.add('liked');
        
        const currentCount = parseInt(likeCountSpan.textContent);
        likeCountSpan.textContent = currentCount + 1;
        
        const photoCard = button.closest('.photo-card');
        photoCard.setAttribute('data-likes', currentCount + 1);
        
        // Shake animation
        photoCard.style.animation = 'none';
        setTimeout(() => {
            photoCard.style.animation = 'heartPop 0.5s ease-out';
        }, 10);
        
        showGalleryToast('Photo liked! ❤️', 2000);
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.classList.remove('liked');
        
        const currentCount = parseInt(likeCountSpan.textContent);
        likeCountSpan.textContent = currentCount - 1;
        
        const photoCard = button.closest('.photo-card');
        photoCard.setAttribute('data-likes', currentCount - 1);
        
        showGalleryToast('Like removed', 2000);
    }
}

function sharePhoto(photoId, location) {
    const text = `Check out this beautiful photo of ${location} from Happy Trails! 📸💖`;
    const url = `${window.location.origin}/travel-gallery?photo=${photoId}`;
    
    if (navigator.share) {
        navigator.share({
            title: `${location} - Happy Trails`,
            text: text,
            url: url
        }).then(() => {
            showGalleryToast('Photo shared! 🎉');
        }).catch(() => {
            copyToClipboard(url);
        });
    } else {
        copyToClipboard(url);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showGalleryToast('Link copied to clipboard! 📋');
    }).catch(() => {
        showGalleryToast('Unable to copy. Please try again.', 3000);
    });
}

function viewOnMap(location) {
    showGalleryToast(`Loading map for ${location}... 🗺️`);
    setTimeout(() => {
        showGalleryToast('Map view coming soon! 🚧', 3000);
    }, 1000);
}

// ============================================
// LOAD MORE
// ============================================

function loadMorePhotos() {
    showGalleryToast('Loading more enchanted memories... ✨');
    setTimeout(() => {
        showGalleryToast('More photos coming soon! Stay tuned 🎉', 3000);
    }, 1500);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showGalleryToast(message, duration = 3000) {
    const existingToast = document.querySelector('.gallery-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'gallery-toast';
    toast.innerHTML = `<i class="fas fa-sparkles me-2"></i><span>${message}</span>`;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #FFD700, #FF8C00);
        color: white;
        padding: 14px 24px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        border: 2px solid rgba(255, 255, 255, 0.5);
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

console.log('✨ Kavlin\'s Enchanted Gallery loaded successfully! 💖');