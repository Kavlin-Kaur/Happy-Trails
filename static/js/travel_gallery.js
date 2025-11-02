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

/* ============================================
   📤 PHASE 2: USER PHOTO UPLOAD SYSTEM
   Magical Upload Experience
   ============================================ */

// Global upload variables
let selectedFiles = [];
let uploadQueue = [];

// ============================================
// TAB NAVIGATION
// ============================================

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.gallery-tab');
    const tabContents = document.querySelectorAll('.gallery-tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            showGalleryToast(`Switched to: ${this.textContent.trim()} ✨`);
        });
    });
    
    console.log('📑 Tab navigation initialized');
}

// ============================================
// UPLOAD FUNCTIONALITY
// ============================================

function initializeUpload() {
    const dropzone = document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const uploadForm = document.getElementById('uploadForm');
    
    if (!dropzone || !fileInput) return;
    
    // Browse button click
    if (browseBtn) {
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });
    }
    
    // Dropzone click
    dropzone.addEventListener('click', (e) => {
        if (e.target === dropzone || e.target.closest('.dropzone-icon, .dropzone-text')) {
            fileInput.click();
        }
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    // Drag and drop events
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
    });
    
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-over');
    });
    
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
    
    // Form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUploadSubmit);
    }
    
    // Icon selection
    setupIconSelection();
    
    console.log('📤 Upload functionality initialized');
}

function handleFiles(files) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;
    
    // Filter valid files
    const newFiles = Array.from(files).filter(file => {
        if (!validTypes.includes(file.type)) {
            showGalleryToast(`❌ ${file.name}: Invalid file type. Use JPG, PNG, or HEIC.`, 4000);
            return false;
        }
        
        if (file.size > maxSize) {
            showGalleryToast(`❌ ${file.name}: File too large. Max 10MB.`, 4000);
            return false;
        }
        
        return true;
    });
    
    // Check total files
    if (selectedFiles.length + newFiles.length > maxFiles) {
        showGalleryToast(`⚠️ Maximum ${maxFiles} photos at once!`, 4000);
        return;
    }
    
    // Add files
    newFiles.forEach(file => {
        selectedFiles.push(file);
        createPreviewCard(file);
    });
    
    // Show form if files selected
    if (selectedFiles.length > 0) {
        document.getElementById('uploadFormSection').style.display = 'block';
    }
    
    showGalleryToast(`✨ ${newFiles.length} photo${newFiles.length !== 1 ? 's' : ''} added!`, 2000);
}

function createPreviewCard(file) {
    const previewGrid = document.getElementById('previewGrid');
    
    const card = document.createElement('div');
    card.className = 'preview-card';
    card.dataset.filename = file.name;
    
    // Read file for preview
    const reader = new FileReader();
    reader.onload = (e) => {
        card.innerHTML = `
            <div class="preview-image-wrapper">
                <img src="${e.target.result}" alt="${file.name}" class="preview-image">
                <button class="remove-preview" onclick="removePreview('${file.name}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="preview-filename">${file.name}</div>
        `;
    };
    reader.readAsDataURL(file);
    
    previewGrid.appendChild(card);
}

function removePreview(filename) {
    // Remove from selectedFiles array
    selectedFiles = selectedFiles.filter(file => file.name !== filename);
    
    // Remove card
    const card = document.querySelector(`.preview-card[data-filename="${filename}"]`);
    if (card) {
        card.style.animation = 'cardSlideOut 0.3s ease-out';
        setTimeout(() => card.remove(), 300);
    }
    
    // Hide form if no files
    if (selectedFiles.length === 0) {
        document.getElementById('uploadFormSection').style.display = 'none';
        document.getElementById('previewGrid').innerHTML = '';
    }
    
    showGalleryToast(`🗑️ Removed ${filename}`, 2000);
}

function setupIconSelection() {
    // Destination icons
    const destIcons = document.querySelectorAll('.icon-option[data-type="destination"]');
    destIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            destIcons.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Type icons
    const typeIcons = document.querySelectorAll('.icon-option[data-type="photo-type"]');
    typeIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            typeIcons.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Season icons
    const seasonIcons = document.querySelectorAll('.icon-option[data-type="season"]');
    seasonIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            seasonIcons.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

function handleUploadSubmit(e) {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
        showGalleryToast('⚠️ Please select at least one photo!', 3000);
        return;
    }
    
    // Get form data
    const destination = document.querySelector('.icon-option[data-type="destination"].selected')?.dataset.value;
    const photoType = document.querySelector('.icon-option[data-type="photo-type"].selected')?.dataset.value;
    const season = document.querySelector('.icon-option[data-type="season"].selected')?.dataset.value;
    const caption = document.getElementById('photoCaption')?.value.trim();
    const location = document.getElementById('photoLocation')?.value.trim();
    
    // Validation
    if (!destination || !photoType || !season) {
        showGalleryToast('⚠️ Please select destination, type, and season!', 3000);
        return;
    }
    
    if (!caption) {
        showGalleryToast('⚠️ Please add a caption!', 3000);
        return;
    }
    
    // Show progress
    const progressSection = document.getElementById('uploadProgress');
    progressSection.classList.add('active');
    progressSection.innerHTML = '';
    
    // Disable submit button
    const submitBtn = document.getElementById('submitUploadBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Uploading...';
    
    // Upload each file
    selectedFiles.forEach((file, index) => {
        uploadFile(file, {
            destination,
            photoType,
            season,
            caption,
            location
        }, index);
    });
}

function uploadFile(file, metadata, index) {
    const progressSection = document.getElementById('uploadProgress');
    
    // Create progress item
    const progressItem = document.createElement('div');
    progressItem.className = 'progress-item';
    progressItem.id = `progress-${index}`;
    progressItem.innerHTML = `
        <div class="progress-header">
            <span class="progress-filename">${file.name}</span>
            <span class="progress-percentage">0%</span>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
    `;
    progressSection.appendChild(progressItem);
    
    // Simulate upload with FormData
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('destination', metadata.destination);
    formData.append('photoType', metadata.photoType);
    formData.append('season', metadata.season);
    formData.append('caption', metadata.caption);
    formData.append('location', metadata.location);
    
    // Simulate progress (in real app, use xhr.upload.onprogress)
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Mark as complete
            setTimeout(() => {
                progressItem.style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
                progressItem.querySelector('.progress-percentage').innerHTML = '✓ Done';
                
                // Check if all done
                checkAllUploadsComplete();
            }, 500);
        }
        
        const progressBar = progressItem.querySelector('.progress-bar');
        const progressPercentage = progressItem.querySelector('.progress-percentage');
        
        progressBar.style.width = `${progress}%`;
        progressPercentage.textContent = `${Math.floor(progress)}%`;
    }, 200);
    
    // In production, use actual fetch/axios:
    /*
    fetch('/travel-gallery/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Handle success
        }
    })
    .catch(error => {
        console.error('Upload error:', error);
        showGalleryToast('❌ Upload failed. Please try again.', 4000);
    });
    */
}

function checkAllUploadsComplete() {
    const allProgressItems = document.querySelectorAll('.progress-item');
    const completedItems = Array.from(allProgressItems).filter(item => 
        item.querySelector('.progress-percentage').textContent.includes('Done')
    );
    
    if (completedItems.length === allProgressItems.length) {
        setTimeout(() => {
            showUploadSuccess();
        }, 1000);
    }
}

function showUploadSuccess() {
    // Create confetti
    createUploadConfetti();
    
    // Show success modal
    const modal = document.createElement('div');
    modal.className = 'upload-success-modal active';
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3 class="success-title">Photos Uploaded! 🎉</h3>
            <p class="success-message">
                Thank you for sharing your beautiful memories with the Happy Trails community!
                Your photos will be reviewed and published soon.
            </p>
            <button class="success-btn" onclick="closeUploadSuccess()">
                <i class="fas fa-heart me-2"></i>View Gallery
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Reset form
    setTimeout(() => {
        resetUploadForm();
    }, 500);
}

function closeUploadSuccess() {
    const modal = document.querySelector('.upload-success-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
    
    // Switch to gallery tab
    const galleryTab = document.querySelector('[data-tab="gallery-view"]');
    if (galleryTab) {
        galleryTab.click();
    }
}

function resetUploadForm() {
    selectedFiles = [];
    document.getElementById('previewGrid').innerHTML = '';
    document.getElementById('uploadFormSection').style.display = 'none';
    document.getElementById('uploadForm').reset();
    document.getElementById('uploadProgress').classList.remove('active');
    document.getElementById('uploadProgress').innerHTML = '';
    
    // Reset submit button
    const submitBtn = document.getElementById('submitUploadBtn');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-cloud-upload me-2"></i>Upload Photos';
    
    // Reset icon selections
    document.querySelectorAll('.icon-option.selected').forEach(icon => {
        icon.classList.remove('selected');
    });
}

function createUploadConfetti() {
    const colors = ['#FFD700', '#FF8C00', '#FF6347', '#FFE4B5', '#FFC0CB'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                top: -10px;
                left: ${Math.random() * 100}vw;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
                z-index: 10001;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                transform: rotate(${Math.random() * 360}deg);
            `;
            
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }, i * 15);
    }
}

// Add confetti animation CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// ============================================
// EMOJI PICKER
// ============================================

function toggleEmojiPicker() {
    const emojis = ['😊', '🌄', '🚌', '❤️', '✨', '🌟', '🎉', '📸', '🗺️', '🌈', '☀️', '🌙', '⭐', '💫', '🌸', '🌺'];
    
    const picker = document.createElement('div');
    picker.className = 'emoji-picker-popup';
    picker.style.cssText = `
        position: absolute;
        top: 50px;
        right: 0;
        background: white;
        border: 2px solid #FFD700;
        border-radius: 15px;
        padding: 15px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 100;
    `;
    
    emojis.forEach(emoji => {
        const btn = document.createElement('button');
        btn.textContent = emoji;
        btn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 5px;
            transition: transform 0.2s;
        `;
        btn.onmouseover = () => btn.style.transform = 'scale(1.3)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';
        btn.onclick = () => {
            const textarea = document.getElementById('photoCaption');
            textarea.value += emoji;
            picker.remove();
        };
        picker.appendChild(btn);
    });
    
    // Remove existing picker
    document.querySelectorAll('.emoji-picker-popup').forEach(p => p.remove());
    
    // Add new picker
    document.querySelector('.caption-group').appendChild(picker);
    
    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', function closeEmojiPicker(e) {
            if (!e.target.closest('.emoji-picker-popup') && !e.target.closest('.emoji-picker-btn')) {
                picker.remove();
                document.removeEventListener('click', closeEmojiPicker);
            }
        });
    }, 100);
}

// ============================================
// MY UPLOADS FUNCTIONALITY
// ============================================

function loadMyUploads() {
    // In production, fetch from backend
    // For now, show sample data
    
    const sampleUploads = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            location: 'Mountain Sunrise',
            status: 'approved',
            uploadDate: '2024-01-20',
            likes: 45,
            views: 234
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400',
            location: 'Valley Views',
            status: 'pending',
            uploadDate: '2024-01-22',
            likes: 0,
            views: 0
        }
    ];
    
    const grid = document.getElementById('myUploadsGrid');
    if (!grid) return;
    
    grid.innerHTML = sampleUploads.map(upload => `
        <div class="upload-card">
            <span class="upload-status ${upload.status}">${upload.status}</span>
            <div class="photo-image-wrapper">
                <img src="${upload.image}" alt="${upload.location}" class="photo-image">
            </div>
            <div class="photo-info">
                <div class="photo-location">${upload.location}</div>
                <div class="photo-date">
                    <i class="fas fa-calendar me-1"></i>${upload.uploadDate}
                </div>
                ${upload.status === 'approved' ? `
                    <div class="photo-stats">
                        <span><i class="fas fa-heart"></i> ${upload.likes}</span>
                        <span><i class="fas fa-eye"></i> ${upload.views}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// ============================================
// UPDATE INITIALIZATION
// ============================================

// Update the main initialization function
const originalInit = initializeEnchantedGallery;
initializeEnchantedGallery = function() {
    originalInit();
    initializeTabs();
    initializeUpload();
    
    // Load my uploads if on that tab
    const myUploadsTab = document.querySelector('[data-tab="my-uploads"]');
    if (myUploadsTab) {
        myUploadsTab.addEventListener('click', loadMyUploads);
    }
};

console.log('📤 Phase 2: Upload System loaded successfully! 💖');

/* ============================================
   📖 PHASE 3: TRAVEL DIARY & STORY MODE
   Interactive Storytelling Experience
   ============================================ */

// Global diary variables
let currentDiaryStep = 1;
let diaryData = {
    template: '',
    title: '',
    description: '',
    photos: [],
    chapters: [],
    moods: [],
    route: { start: '', end: '' }
};

// ============================================
// DIARY INITIALIZATION
// ============================================

function initializeDiaries() {
    const diariesTab = document.querySelector('[data-tab="my-diaries"]');
    if (diariesTab) {
        diariesTab.addEventListener('click', loadDiaries);
    }
    
    // Create Diary button
    const createDiaryBtn = document.getElementById('createDiaryBtn');
    if (createDiaryBtn) {
        createDiaryBtn.addEventListener('click', openDiaryModal);
    }
    
    console.log('📖 Diary system initialized');
}

function loadDiaries() {
    // Sample diaries for demonstration
    const sampleDiaries = [
        {
            id: 1,
            title: 'Mountain Adventures 2024',
            description: 'A breathtaking journey through the Himalayan peaks, filled with unforgettable moments and stunning vistas.',
            coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            author: 'Kavlin',
            chapters: 5,
            photos: 24,
            views: 1234,
            likes: 89,
            date: '2024-03-15',
            featured: true
        },
        {
            id: 2,
            title: 'Monsoon Magic in Barog',
            description: 'Experiencing the enchanting rains and misty landscapes of Barog tunnel area.',
            coverImage: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800',
            author: 'Priya Sharma',
            chapters: 3,
            photos: 18,
            views: 856,
            likes: 67,
            date: '2024-07-20',
            featured: false
        },
        {
            id: 3,
            title: 'Heritage Trail: Dagshai Cantonment',
            description: 'Walking through history in the colonial cantonment town of Dagshai.',
            coverImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
            author: 'Raj Kumar',
            chapters: 4,
            photos: 21,
            views: 678,
            likes: 54,
            date: '2024-10-05',
            featured: false
        }
    ];
    
    const diaryGrid = document.getElementById('diaryGrid');
    if (!diaryGrid) return;
    
    diaryGrid.innerHTML = sampleDiaries.map(diary => `
        <div class="diary-card" onclick="openDiaryStory(${diary.id})">
            ${diary.featured ? '<span class="diary-badge">Featured</span>' : ''}
            <div class="diary-cover">
                <img src="${diary.coverImage}" alt="${diary.title}" class="diary-cover-image">
            </div>
            <div class="diary-content">
                <h3 class="diary-title">${diary.title}</h3>
                <div class="diary-meta">
                    <span class="diary-meta-item">
                        <i class="fas fa-user"></i>
                        ${diary.author}
                    </span>
                    <span class="diary-meta-item">
                        <i class="fas fa-calendar"></i>
                        ${diary.date}
                    </span>
                </div>
                <p class="diary-description">${diary.description}</p>
                <div class="diary-stats">
                    <div class="diary-stat">
                        <span class="diary-stat-number">${diary.chapters}</span>
                        <span class="diary-stat-label">Chapters</span>
                    </div>
                    <div class="diary-stat">
                        <span class="diary-stat-number">${diary.photos}</span>
                        <span class="diary-stat-label">Photos</span>
                    </div>
                    <div class="diary-stat">
                        <span class="diary-stat-number">${diary.views}</span>
                        <span class="diary-stat-label">Views</span>
                    </div>
                    <div class="diary-stat">
                        <span class="diary-stat-number">${diary.likes}</span>
                        <span class="diary-stat-label">Likes</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// DIARY CREATION MODAL
// ============================================

function openDiaryModal() {
    const modal = document.getElementById('diaryModal');
    if (modal) {
        modal.classList.add('active');
        currentDiaryStep = 1;
        updateDiaryStep();
        resetDiaryData();
    }
}

function closeDiaryModal() {
    const modal = document.getElementById('diaryModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function resetDiaryData() {
    diaryData = {
        template: '',
        title: '',
        description: '',
        photos: [],
        chapters: [],
        moods: [],
        route: { start: '', end: '' }
    };
}

function updateDiaryStep() {
    // Update step indicators
    document.querySelectorAll('.diary-step').forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < currentDiaryStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === currentDiaryStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Show/hide step content
    document.querySelectorAll('.diary-step-content').forEach((content, index) => {
        if (index + 1 === currentDiaryStep) {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });
    
    // Update navigation buttons
    const backBtn = document.getElementById('diaryBackBtn');
    const nextBtn = document.getElementById('diaryNextBtn');
    
    if (backBtn) {
        backBtn.style.display = currentDiaryStep === 1 ? 'none' : 'block';
    }
    
    if (nextBtn) {
        if (currentDiaryStep === 4) {
            nextBtn.innerHTML = '<i class="fas fa-check me-2"></i>Publish Diary';
        } else {
            nextBtn.innerHTML = '<i class="fas fa-arrow-right me-2"></i>Next Step';
        }
    }
}

function nextDiaryStep() {
    // Validate current step
    if (!validateDiaryStep(currentDiaryStep)) {
        return;
    }
    
    if (currentDiaryStep < 4) {
        currentDiaryStep++;
        updateDiaryStep();
        showGalleryToast('Step completed! ✨', 2000);
    } else {
        publishDiary();
    }
}

function previousDiaryStep() {
    if (currentDiaryStep > 1) {
        currentDiaryStep--;
        updateDiaryStep();
    }
}

function validateDiaryStep(step) {
    switch(step) {
        case 1: // Template
            if (!diaryData.template) {
                showGalleryToast('⚠️ Please select a template!', 3000);
                return false;
            }
            break;
        case 2: // Basic Info
            const title = document.getElementById('diaryTitle')?.value.trim();
            const description = document.getElementById('diaryDescription')?.value.trim();
            if (!title || !description) {
                showGalleryToast('⚠️ Please fill in title and description!', 3000);
                return false;
            }
            diaryData.title = title;
            diaryData.description = description;
            break;
        case 3: // Photos & Chapters
            if (diaryData.photos.length === 0) {
                showGalleryToast('⚠️ Please select at least one photo!', 3000);
                return false;
            }
            if (diaryData.chapters.length === 0) {
                showGalleryToast('⚠️ Please create at least one chapter!', 3000);
                return false;
            }
            break;
        case 4: // Finalize
            if (diaryData.moods.length === 0) {
                showGalleryToast('⚠️ Please select at least one mood!', 3000);
                return false;
            }
            break;
    }
    return true;
}

// ============================================
// TEMPLATE SELECTION
// ============================================

function selectTemplate(template) {
    diaryData.template = template;
    
    // Update UI
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    showGalleryToast(`${template} template selected! 🎨`, 2000);
}

// ============================================
// PHOTO SELECTION
// ============================================

function togglePhotoSelection(photoId) {
    const index = diaryData.photos.indexOf(photoId);
    
    if (index > -1) {
        diaryData.photos.splice(index, 1);
    } else {
        if (diaryData.photos.length >= 20) {
            showGalleryToast('⚠️ Maximum 20 photos per diary!', 3000);
            return;
        }
        diaryData.photos.push(photoId);
    }
    
    // Update UI
    const photoElement = event.currentTarget;
    if (index > -1) {
        photoElement.classList.remove('selected');
        photoElement.querySelector('.selection-badge')?.remove();
    } else {
        photoElement.classList.add('selected');
        const badge = document.createElement('div');
        badge.className = 'selection-badge';
        badge.textContent = diaryData.photos.length;
        photoElement.appendChild(badge);
    }
    
    updatePhotoCount();
}

function updatePhotoCount() {
    const countElement = document.getElementById('selectedPhotoCount');
    if (countElement) {
        countElement.textContent = diaryData.photos.length;
    }
}

// ============================================
// CHAPTER MANAGEMENT
// ============================================

function addChapter() {
    if (diaryData.chapters.length >= 10) {
        showGalleryToast('⚠️ Maximum 10 chapters per diary!', 3000);
        return;
    }
    
    const chapterNumber = diaryData.chapters.length + 1;
    const chapter = {
        id: Date.now(),
        number: chapterNumber,
        title: `Chapter ${chapterNumber}`,
        text: ''
    };
    
    diaryData.chapters.push(chapter);
    renderChapters();
    showGalleryToast('Chapter added! 📖', 2000);
}

function removeChapter(chapterId) {
    diaryData.chapters = diaryData.chapters.filter(ch => ch.id !== chapterId);
    
    // Renumber chapters
    diaryData.chapters.forEach((ch, index) => {
        ch.number = index + 1;
        ch.title = ch.title.replace(/Chapter \d+/, `Chapter ${index + 1}`);
    });
    
    renderChapters();
    showGalleryToast('Chapter removed! 🗑️', 2000);
}

function renderChapters() {
    const container = document.getElementById('chapterList');
    if (!container) return;
    
    container.innerHTML = diaryData.chapters.map(chapter => `
        <div class="chapter-item" data-chapter-id="${chapter.id}">
            <div class="chapter-header">
                <input type="text" 
                       class="chapter-title-input" 
                       value="${chapter.title}"
                       onchange="updateChapterTitle(${chapter.id}, this.value)"
                       placeholder="Chapter Title">
                <button class="remove-chapter-btn" onclick="removeChapter(${chapter.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <textarea class="form-textarea" 
                      placeholder="Write your chapter story here..."
                      onchange="updateChapterText(${chapter.id}, this.value)">${chapter.text}</textarea>
        </div>
    `).join('');
}

function updateChapterTitle(chapterId, title) {
    const chapter = diaryData.chapters.find(ch => ch.id === chapterId);
    if (chapter) {
        chapter.title = title;
    }
}

function updateChapterText(chapterId, text) {
    const chapter = diaryData.chapters.find(ch => ch.id === chapterId);
    if (chapter) {
        chapter.text = text;
    }
}

// ============================================
// MOOD SELECTION
// ============================================

function toggleMood(mood) {
    const index = diaryData.moods.indexOf(mood);
    
    if (index > -1) {
        diaryData.moods.splice(index, 1);
    } else {
        if (diaryData.moods.length >= 5) {
            showGalleryToast('⚠️ Maximum 5 moods per diary!', 3000);
            return;
        }
        diaryData.moods.push(mood);
    }
    
    // Update UI
    event.currentTarget.classList.toggle('selected');
}

// ============================================
// DIARY PUBLISHING
// ============================================

function publishDiary() {
    showGalleryToast('Publishing your diary... ✨');
    
    // Simulate publishing with animation
    setTimeout(() => {
        closeDiaryModal();
        
        // Show success animation
        createPublishConfetti();
        
        const successModal = document.createElement('div');
        successModal.className = 'upload-success-modal active';
        successModal.innerHTML = `
            <div class="success-modal-content">
                <div class="success-icon">
                    <i class="fas fa-book-open"></i>
                </div>
                <h3 class="success-title">Diary Published! 📖</h3>
                <p class="success-message">
                    Your travel diary "${diaryData.title}" has been published successfully!
                    Share your journey with the Happy Trails community.
                </p>
                <button class="success-btn" onclick="closeDiarySuccess()">
                    <i class="fas fa-eye me-2"></i>View Diary
                </button>
            </div>
        `;
        
        document.body.appendChild(successModal);
        
        // Reset diary data
        resetDiaryData();
        
    }, 2000);
}

function closeDiarySuccess() {
    const modal = document.querySelector('.upload-success-modal');
    if (modal) {
        modal.remove();
    }
    
    // Switch to diaries tab
    const diariesTab = document.querySelector('[data-tab="my-diaries"]');
    if (diariesTab) {
        diariesTab.click();
    }
}

function createPublishConfetti() {
    const colors = ['#FFD700', '#FF8C00', '#FF6347', '#32CD32', '#1E90FF'];
    const confettiCount = 150;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 15 + 5}px;
                height: ${Math.random() * 15 + 5}px;
                top: -20px;
                left: ${Math.random() * 100}vw;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation: confettiFall ${Math.random() * 4 + 3}s linear forwards;
                z-index: 10002;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                transform: rotate(${Math.random() * 360}deg);
                opacity: ${Math.random() * 0.5 + 0.5};
            `;
            
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 7000);
        }, i * 20);
    }
}

// ============================================
// STORY VIEW MODE
// ============================================

function openDiaryStory(diaryId) {
    // Sample story data
    const storyData = {
        id: diaryId,
        title: 'Mountain Adventures 2024',
        author: 'Kavlin',
        date: 'March 2024',
        chapters: [
            {
                number: 1,
                title: 'The Journey Begins',
                photos: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
                    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600'
                ],
                text: 'Early morning mist greeted us as we embarked on what would become the most memorable journey of our lives. The mountains stood majestically before us, their peaks kissing the clouds, promising adventures yet to unfold. With backpacks loaded and hearts full of excitement, we took our first steps into the enchanted valleys of the Himalayas.'
            },
            {
                number: 2,
                title: 'Through Pine Forests',
                photos: [
                    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600',
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600'
                ],
                text: 'The scent of pine filled the air as we trekked through ancient forests. Sunlight filtered through the canopy, creating a magical play of light and shadow on the forest floor. Birds sang their morning songs, and the only other sound was the gentle crunch of our footsteps on the pine needle carpet.'
            },
            {
                number: 3,
                title: 'Summit Dreams',
                photos: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
                ],
                text: 'Standing at the summit, with the world spread out beneath us like a living map, we understood why people chase these moments. The wind whispered stories of countless travelers who had stood here before, each carrying their own dreams and aspirations. This was our moment of triumph, our connection to something greater than ourselves.'
            }
        ]
    };
    
    // Create and show story view
    const storyView = document.createElement('div');
    storyView.className = 'story-view active';
    storyView.id = 'storyView';
    
    storyView.innerHTML = `
        <button class="story-close" onclick="closeStoryView()">
            <i class="fas fa-times"></i>
        </button>
        <div class="story-container">
            <div class="story-header">
                <h1 class="story-title">${storyData.title}</h1>
                <div class="story-meta">
                    By ${storyData.author} • ${storyData.date}
                </div>
            </div>
            ${storyData.chapters.map(chapter => `
                <div class="story-chapter">
                    <div class="story-chapter-number">Chapter ${chapter.number}</div>
                    <h2 class="story-chapter-title">${chapter.title}</h2>
                    <div class="story-photos">
                        ${chapter.photos.map(photo => `
                            <div class="story-photo">
                                <img src="${photo}" alt="${chapter.title}">
                            </div>
                        `).join('')}
                    </div>
                    <p class="story-text">${chapter.text}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    document.body.appendChild(storyView);
    document.body.style.overflow = 'hidden';
    
    showGalleryToast('Entering story mode... 📖', 2000);
}

function closeStoryView() {
    const storyView = document.getElementById('storyView');
    if (storyView) {
        storyView.remove();
        document.body.style.overflow = '';
    }
}

// ============================================
// UPDATE INITIALIZATION
// ============================================

// Update the main initialization
const originalInit2 = initializeEnchantedGallery;
initializeEnchantedGallery = function() {
    originalInit2();
    initializeDiaries();
};

console.log('📖 Phase 3: Diary System loaded successfully! 💖');

/* ============================================
   📅 PHASE 4: MEMORY TIMELINE & COLLECTIONS
   Visual Journey Through Time
   ============================================ */

// Global timeline and collections variables
let timelineData = [];
let collectionsData = [];
let currentYear = new Date().getFullYear();
let selectedCollection = null;

// ============================================
// TIMELINE INITIALIZATION
// ============================================

function initializeTimeline() {
    const timelineTab = document.querySelector('[data-tab="timeline"]');
    if (timelineTab) {
        timelineTab.addEventListener('click', loadTimeline);
    }
    
    console.log('📅 Timeline system initialized');
}

function loadTimeline() {
    generateTimelineData();
    renderTimelineStats();
    renderYearNavigator();
    renderTimeline();
    renderHeatMap();
    renderMilestones();
    
    showGalleryToast('Loading your journey timeline... 🗓️', 2000);
}

function generateTimelineData() {
    // Generate sample timeline data based on existing photos
    timelineData = [
        {
            id: 1,
            date: '2024-03-15',
            title: 'Mountain Adventure Begins',
            description: 'Started our incredible journey through the Himalayan peaks with breathtaking views.',
            photos: [
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
                'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400'
            ],
            location: 'Dharampur',
            tags: ['Mountain', 'Adventure', 'Spring'],
            mood: '🏔️'
        },
        {
            id: 2,
            date: '2024-06-20',
            title: 'Summer Roads',
            description: 'Exploring the beautiful summer routes with perfect weather and stunning landscapes.',
            photos: [
                'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400'
            ],
            location: 'Solan',
            tags: ['Summer', 'Roads', 'Exploration'],
            mood: '☀️'
        },
        {
            id: 3,
            date: '2024-07-25',
            title: 'Monsoon Magic',
            description: 'Experiencing the enchanting rains and misty landscapes of Barog tunnel area.',
            photos: [
                'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
                'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
            ],
            location: 'Barog',
            tags: ['Monsoon', 'Rain', 'Heritage'],
            mood: '🌧️'
        },
        {
            id: 4,
            date: '2024-10-05',
            title: 'Autumn Colors',
            description: 'Walking through history in the colonial cantonment town with beautiful autumn foliage.',
            photos: [
                'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400',
                'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400'
            ],
            location: 'Dagshai',
            tags: ['Autumn', 'Heritage', 'History'],
            mood: '🍂'
        },
        {
            id: 5,
            date: '2023-12-10',
            title: 'Winter Wonderland',
            description: 'Snow-covered peaks and cozy mountain retreats made this winter unforgettable.',
            photos: [
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
            ],
            location: 'Dharampur',
            tags: ['Winter', 'Snow', 'Cozy'],
            mood: '❄️'
        },
        {
            id: 6,
            date: '2023-08-18',
            title: 'Valley Views',
            description: 'Discovered hidden valleys with panoramic views that took our breath away.',
            photos: [
                'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
                'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400'
            ],
            location: 'Solan',
            tags: ['Valley', 'Views', 'Nature'],
            mood: '🌄'
        }
    ];
}

function renderTimelineStats() {
    const statsContainer = document.getElementById('timelineStats');
    if (!statsContainer) return;
    
    const totalPhotos = timelineData.reduce((sum, item) => sum + item.photos.length, 0);
    const uniqueLocations = [...new Set(timelineData.map(item => item.location))].length;
    const totalDays = timelineData.length;
    const firstDate = new Date(timelineData[timelineData.length - 1].date);
    const lastDate = new Date(timelineData[0].date);
    const daysDiff = Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24));
    
    statsContainer.innerHTML = `
        <div class="timeline-stat-card">
            <span class="timeline-stat-icon">📸</span>
            <span class="timeline-stat-number">${totalPhotos}</span>
            <span class="timeline-stat-label">Total Photos</span>
        </div>
        <div class="timeline-stat-card">
            <span class="timeline-stat-icon">📍</span>
            <span class="timeline-stat-number">${uniqueLocations}</span>
            <span class="timeline-stat-label">Destinations</span>
        </div>
        <div class="timeline-stat-card">
            <span class="timeline-stat-icon">🗓️</span>
            <span class="timeline-stat-number">${totalDays}</span>
            <span class="timeline-stat-label">Travel Days</span>
        </div>
        <div class="timeline-stat-card">
            <span class="timeline-stat-icon">⏱️</span>
            <span class="timeline-stat-number">${daysDiff}</span>
            <span class="timeline-stat-label">Days Traveled</span>
        </div>
    `;
    
    // Animate numbers
    animateStatNumbers();
}

function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.timeline-stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 20);
    });
}

function renderYearNavigator() {
    const navigatorContainer = document.getElementById('yearNavigator');
    if (!navigatorContainer) return;
    
    const years = [...new Set(timelineData.map(item => new Date(item.date).getFullYear()))].sort((a, b) => b - a);
    
    navigatorContainer.innerHTML = years.map(year => `
        <button class="year-btn ${year === currentYear ? 'active' : ''}" onclick="filterByYear(${year})">
            ${year}
        </button>
    `).join('');
}

function filterByYear(year) {
    currentYear = year;
    
    // Update active button
    document.querySelectorAll('.year-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.textContent) === year) {
            btn.classList.add('active');
        }
    });
    
    renderTimeline();
    showGalleryToast(`Showing memories from ${year} 📅`, 2000);
}

function renderTimeline() {
    const timelineContainer = document.getElementById('timelineContainer');
    if (!timelineContainer) return;
    
    const filteredData = timelineData.filter(item => 
        new Date(item.date).getFullYear() === currentYear
    );
    
    if (filteredData.length === 0) {
        timelineContainer.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #6C757D;">
                <i class="fas fa-calendar-times" style="font-size: 3rem; margin-bottom: 20px; display: block;"></i>
                <p style="font-size: 1.2rem;">No memories from ${currentYear} yet.</p>
                <p>Start creating memories to see them here!</p>
            </div>
        `;
        return;
    }
    
    timelineContainer.innerHTML = `
        <div class="timeline-line"></div>
        ${filteredData.map((item, index) => {
            const date = new Date(item.date);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
            
            return `
                <div class="timeline-item" style="animation-delay: ${index * 0.1}s">
                    <div class="timeline-marker">${item.mood}</div>
                    <div class="timeline-content">
                        <div class="timeline-date">${formattedDate}</div>
                        <h3 class="timeline-title">${item.title}</h3>
                        <div class="timeline-photos">
                            ${item.photos.map(photo => `
                                <div class="timeline-photo" onclick="openLightboxFromTimeline('${photo}')">
                                    <img src="${photo}" alt="${item.title}">
                                </div>
                            `).join('')}
                        </div>
                        <p class="timeline-description">${item.description}</p>
                        <div class="timeline-tags">
                            <span class="timeline-tag">📍 ${item.location}</span>
                            ${item.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('')}
    `;
}

function openLightboxFromTimeline(photoUrl) {
    // Reuse existing lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    
    lightboxImage.src = photoUrl;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function renderHeatMap() {
    const heatmapGrid = document.getElementById('heatmapGrid');
    if (!heatmapGrid) return;
    
    // Generate 365 cells (one year)
    const cells = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Check if there are memories on this date
        const memoriesCount = timelineData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.toDateString() === date.toDateString();
        }).length;
        
        let level = 0;
        if (memoriesCount > 0) level = 1;
        if (memoriesCount > 2) level = 2;
        if (memoriesCount > 4) level = 3;
        if (memoriesCount > 6) level = 4;
        
        cells.push(`
            <div class="heatmap-cell ${level > 0 ? `level-${level}` : ''}" 
                 title="${date.toDateString()}: ${memoriesCount} memories"
                 data-count="${memoriesCount}">
            </div>
        `);
    }
    
    heatmapGrid.innerHTML = cells.join('');
}

function renderMilestones() {
    const milestonesGrid = document.getElementById('milestonesGrid');
    if (!milestonesGrid) return;
    
    const totalPhotos = timelineData.reduce((sum, item) => sum + item.photos.length, 0);
    const uniqueLocations = [...new Set(timelineData.map(item => item.location))].length;
    const totalDays = timelineData.length;
    
    const milestones = [
        { icon: '📸', name: 'First Photo', unlocked: totalPhotos >= 1 },
        { icon: '🎯', name: '10 Photos', unlocked: totalPhotos >= 10 },
        { icon: '🌟', name: '50 Photos', unlocked: totalPhotos >= 50 },
        { icon: '💎', name: '100 Photos', unlocked: totalPhotos >= 100 },
        { icon: '🗺️', name: 'Explorer', unlocked: uniqueLocations >= 3 },
        { icon: '🏆', name: 'Adventurer', unlocked: uniqueLocations >= 5 },
        { icon: '📅', name: 'Week Traveler', unlocked: totalDays >= 7 },
        { icon: '🎖️', name: 'Month Traveler', unlocked: totalDays >= 30 }
    ];
    
    milestonesGrid.innerHTML = milestones.map(milestone => `
        <div class="milestone-badge ${milestone.unlocked ? '' : 'locked'}">
            <span class="milestone-icon">${milestone.icon}</span>
            <div class="milestone-name">${milestone.name}</div>
        </div>
    `).join('');
}

// ============================================
// COLLECTIONS INITIALIZATION
// ============================================

function initializeCollections() {
    const collectionsTab = document.querySelector('[data-tab="collections"]');
    if (collectionsTab) {
        collectionsTab.addEventListener('click', loadCollections);
    }
    
    const createCollectionBtn = document.getElementById('createCollectionBtn');
    if (createCollectionBtn) {
        createCollectionBtn.addEventListener('click', openCollectionModal);
    }
    
    console.log('📦 Collections system initialized');
}

function loadCollections() {
    generateCollectionsData();
    renderAutoCollections();
    renderManualCollections();
    
    showGalleryToast('Loading your collections... 📦', 2000);
}

function generateCollectionsData() {
    // Auto-generated collections
    const destinations = [...new Set(timelineData.map(item => item.location))];
    const years = [...new Set(timelineData.map(item => new Date(item.date).getFullYear()))];
    
    collectionsData = {
        auto: [
            { id: 'all', name: 'All Photos', icon: '🌍', count: timelineData.reduce((sum, item) => sum + item.photos.length, 0) },
            { id: 'recent', name: 'Recent', icon: '⏰', count: 15 },
            { id: 'favorites', name: 'Favorites', icon: '❤️', count: 8 },
            ...destinations.map(dest => ({
                id: `dest-${dest}`,
                name: dest,
                icon: '📍',
                count: timelineData.filter(item => item.location === dest).reduce((sum, item) => sum + item.photos.length, 0)
            }))
        ],
        manual: [
            {
                id: 1,
                name: 'Best of 2024',
                description: 'My favorite moments from this year',
                photos: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
                    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400',
                    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
                    'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
                ],
                date: '2024-11-01',
                isPublic: true
            },
            {
                id: 2,
                name: 'Mountain Memories',
                description: 'All the peaks I conquered',
                photos: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
                    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400'
                ],
                date: '2024-10-15',
                isPublic: true
            },
            {
                id: 3,
                name: 'Rainy Days',
                description: 'Monsoon magic captured',
                photos: [
                    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400',
                    'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400'
                ],
                date: '2024-08-20',
                isPublic: false
            }
        ]
    };
}

function renderAutoCollections() {
    const autoGrid = document.getElementById('autoCollectionsGrid');
    if (!autoGrid) return;
    
    autoGrid.innerHTML = collectionsData.auto.map(collection => `
        <div class="auto-collection-card" onclick="viewAutoCollection('${collection.id}')">
            <span class="auto-collection-icon">${collection.icon}</span>
            <div class="auto-collection-name">${collection.name}</div>
            <div class="auto-collection-count">${collection.count} photos</div>
        </div>
    `).join('');
}

function renderManualCollections() {
    const manualGrid = document.getElementById('manualCollectionsGrid');
    if (!manualGrid) return;
    
    manualGrid.innerHTML = collectionsData.manual.map(collection => `
        <div class="collection-card" onclick="viewCollection(${collection.id})">
            <div class="collection-cover">
                <div class="collection-mosaic">
                    ${collection.photos.slice(0, 6).map(photo => `
                        <img src="${photo}" alt="${collection.name}">
                    `).join('')}
                </div>
            </div>
            <div class="collection-info">
                <h3 class="collection-name">${collection.name}</h3>
                <div class="collection-meta">
                    <span><i class="fas fa-images"></i> ${collection.photos.length} photos</span>
                    <span><i class="fas fa-${collection.isPublic ? 'globe' : 'lock'}"></i> ${collection.isPublic ? 'Public' : 'Private'}</span>
                </div>
                <p class="collection-description">${collection.description}</p>
            </div>
        </div>
    `).join('');
}

function viewAutoCollection(collectionId) {
    showGalleryToast(`Opening ${collectionId} collection... 📂`, 2000);
    // In production, filter and display photos from this collection
}

function viewCollection(collectionId) {
    const collection = collectionsData.manual.find(c => c.id === collectionId);
    if (!collection) return;
    
    selectedCollection = collection;
    
    // Create collection view modal
    const modal = document.createElement('div');
    modal.className = 'collection-modal active';
    modal.innerHTML = `
        <div class="collection-modal-content">
            <div class="collection-modal-header">
                <h2 class="collection-modal-title">${collection.name}</h2>
                <button class="diary-modal-close" onclick="closeCollectionView()" style="position: absolute; top: 20px; right: 20px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="collection-modal-body">
                <p style="color: #6C757D; font-size: 1.1rem; margin-bottom: 30px; text-align: center;">
                    ${collection.description}
                </p>
                <div class="gallery-grid">
                    ${collection.photos.map(photo => `
                        <div class="photo-card" style="animation: cardSlideIn 0.5s ease-out;">
                            <div class="photo-image-wrapper">
                                <img src="${photo}" alt="${collection.name}" class="photo-image">
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    showGalleryToast(`Viewing ${collection.name} 📸`, 2000);
}

function closeCollectionView() {
    const modal = document.querySelector('.collection-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function openCollectionModal() {
    showGalleryToast('Collection creator coming soon! 🎨', 3000);
    // In Phase 5, this will open a full collection creator
}

// ============================================
// UPDATE INITIALIZATION
// ============================================

// Update the main initialization
const originalInit3 = initializeEnchantedGallery;
initializeEnchantedGallery = function() {
    originalInit3();
    initializeTimeline();
    initializeCollections();
};

console.log('📅 Phase 4: Timeline & Collections loaded successfully! 💖');