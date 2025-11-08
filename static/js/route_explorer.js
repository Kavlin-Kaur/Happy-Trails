/* ============================================
   🗺️ ROUTE EXPLORER - PHASE 1
   Interactive Map & Route Filtering
   Designed with love by Kavlin 💖
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🗺️ Route Explorer initializing...');
    initializeRouteExplorer();
});

// ============================================
// GLOBAL VARIABLES
// ============================================

let map = null;
let routeLayers = [];
let markerLayers = [];
let allRoutes = [];
let filteredRoutes = [];
let activeRouteId = null;

// Map center (approximate center of Himachal Pradesh region)
const MAP_CENTER = [30.9010, 77.1734]; // Near Solan
const MAP_ZOOM = 11;

// ============================================
// INITIALIZATION
// ============================================

function initializeRouteExplorer() {
    // Initialize map
    initializeMap();
    
    // Load routes
    loadRoutes();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('✅ Route Explorer initialized successfully!');
}

// ============================================
// MAP INITIALIZATION
// ============================================

function initializeMap() {
    // Create map instance
    map = L.map('routeMap', {
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        zoomControl: true,
        scrollWheelZoom: true
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Add scale control
    L.control.scale({
        position: 'bottomleft',
        imperial: false
    }).addTo(map);

    // Add fullscreen control (custom)
    addFullscreenControl();

    console.log('🗺️ Map initialized');
}

function addFullscreenControl() {
    const fullscreenBtn = L.control({position: 'topright'});
    
    fullscreenBtn.onAdd = function() {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `
            <a href="#" class="leaflet-control-fullscreen" 
               title="Toggle Fullscreen"
               style="width: 30px; height: 30px; line-height: 30px; text-align: center; 
                      text-decoration: none; color: #333; font-size: 18px;">
                <i class="fas fa-expand"></i>
            </a>
        `;
        
        div.onclick = function(e) {
            e.preventDefault();
            toggleFullscreen();
        };
        
        return div;
    };
    
    fullscreenBtn.addTo(map);
}

function toggleFullscreen() {
    const mapContainer = document.getElementById('routeMap');
    
    if (!document.fullscreenElement) {
        mapContainer.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// ============================================
// ROUTE DATA LOADING
// ============================================

function loadRoutes() {
    // Get routes from Flask-passed data
    allRoutes = ROUTES_DATA || [];
    filteredRoutes = [...allRoutes];
    
    // Render routes on map
    renderRoutesOnMap();
    
    // Render route cards
    renderRouteCards();
    
    // Update stats
    updateStats();
    
    console.log(`📍 Loaded ${allRoutes.length} routes`);
}

// ============================================
// MAP RENDERING
// ============================================

function renderRoutesOnMap() {
    // Clear existing layers
    clearMapLayers();
    
    filteredRoutes.forEach(route => {
        // Draw route polyline
        const polyline = L.polyline(route.coordinates, {
            color: route.color,
            weight: 5,
            opacity: 0.7,
            smoothFactor: 1
        }).addTo(map);
        
        // Add popup to polyline
        polyline.bindPopup(`
            <div class="marker-popup">
                <div class="marker-popup-title">${route.name}</div>
                <div class="marker-popup-details">
                    <strong>${route.busNumber}</strong> • ${route.type}<br>
                    ${route.distance} • ${route.duration}<br>
                    ${route.stops} stops
                </div>
            </div>
        `);
        
        // Highlight on hover
        polyline.on('mouseover', function() {
            this.setStyle({
                weight: 7,
                opacity: 1
            });
        });
        
        polyline.on('mouseout', function() {
            if (activeRouteId !== route.id) {
                this.setStyle({
                    weight: 5,
                    opacity: 0.7
                });
            }
        });
        
        // Click to select
        polyline.on('click', function() {
            selectRoute(route.id);
        });
        
        routeLayers.push({
            id: route.id,
            layer: polyline
        });
        
        // Add markers for stops
        route.stops_data.forEach((stop, index) => {
            const isStart = index === 0;
            const isEnd = index === route.stops_data.length - 1;
            
            let iconHtml = '';
            let iconColor = route.color;
            
            if (isStart) {
                iconHtml = '<i class="fas fa-circle" style="color: #32CD32;"></i>';
            } else if (isEnd) {
                iconHtml = '<i class="fas fa-flag-checkered" style="color: #FF6347;"></i>';
            } else {
                iconHtml = '<i class="fas fa-map-pin" style="color: ' + iconColor + ';"></i>';
            }
            
            const marker = L.marker(stop.coordinates, {
                icon: L.divIcon({
                    html: iconHtml,
                    className: 'custom-marker',
                    iconSize: [30, 30],
                    iconAnchor: [15, 30]
                })
            }).addTo(map);
            
            marker.bindPopup(`
                <div class="marker-popup">
                    <div class="marker-popup-title">
                        ${isStart ? '🚀 ' : isEnd ? '🏁 ' : ''}
                        ${stop.name}
                    </div>
                    <div class="marker-popup-details">
                        ${stop.location}<br>
                        <small>Stop ${index + 1} of ${route.stops_data.length}</small>
                    </div>
                </div>
            `);
            
            markerLayers.push(marker);
        });
    });
    
    // Fit map to show all routes
    if (filteredRoutes.length > 0 && routeLayers.length > 0) {
        const group = L.featureGroup(routeLayers.map(r => r.layer));
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

function clearMapLayers() {
    routeLayers.forEach(routeLayer => {
        map.removeLayer(routeLayer.layer);
    });
    
    markerLayers.forEach(marker => {
        map.removeLayer(marker);
    });
    
    routeLayers = [];
    markerLayers = [];
}

// ============================================
// ROUTE CARDS RENDERING
// ============================================

function renderRouteCards() {
    const container = document.getElementById('routeCardsContainer');
    
    if (filteredRoutes.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #6C757D;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5; display: block;"></i>
                <p style="font-size: 1.1rem; margin-bottom: 5px;">No routes found</p>
                <p style="font-size: 0.9rem;">Try adjusting your filters</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredRoutes.map(route => `
        <div class="route-card ${activeRouteId === route.id ? 'active' : ''}" 
             data-route-id="${route.id}"
             onclick="selectRoute(${route.id})"
             style="--route-color: ${route.color}">
            <div class="route-card-header">
                <div class="route-name">${route.name}</div>
                <span class="route-type-badge ${route.type.toLowerCase()}">${route.type}</span>
            </div>
            <div class="route-path">
                <i class="fas fa-map-marker-alt"></i>
                <span>${route.from}</span>
                <i class="fas fa-arrow-right"></i>
                <span>${route.to}</span>
            </div>
            <div class="route-stats">
                <div class="route-stat">
                    <i class="fas fa-bus"></i>
                    <span>${route.busNumber}</span>
                </div>
                <div class="route-stat">
                    <i class="fas fa-road"></i>
                    <span>${route.distance}</span>
                </div>
                <div class="route-stat">
                    <i class="fas fa-clock"></i>
                    <span>${route.duration}</span>
                </div>
                <div class="route-stat">
                    <i class="fas fa-map-pin"></i>
                    <span>${route.stops} stops</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// ROUTE SELECTION
// ============================================

function selectRoute(routeId) {
    activeRouteId = routeId;
    
    // Update card UI
    document.querySelectorAll('.route-card').forEach(card => {
        card.classList.remove('active');
        if (parseInt(card.getAttribute('data-route-id')) === routeId) {
            card.classList.add('active');
        }
    });
    
    // Highlight route on map
    routeLayers.forEach(routeLayer => {
        if (routeLayer.id === routeId) {
            routeLayer.layer.setStyle({
                weight: 7,
                opacity: 1
            });
            
            // Zoom to route
            map.fitBounds(routeLayer.layer.getBounds().pad(0.2));
            
            // Open popup
            routeLayer.layer.openPopup();
        } else {
            routeLayer.layer.setStyle({
                weight: 5,
                opacity: 0.7
            });
        }
    });
    
    showToast(`Selected: ${allRoutes.find(r => r.id === routeId).name} 🗺️`, 2000);
}

// ============================================
// FILTERING & SEARCH
// ============================================

function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('routeSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // From/To filters
    const filterFrom = document.getElementById('filterFrom');
    const filterTo = document.getElementById('filterTo');
    
    if (filterFrom) filterFrom.addEventListener('change', applyFilters);
    if (filterTo) filterTo.addEventListener('change', applyFilters);
    
    // Bus type pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', function() {
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });
    
    // Reset filters button
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    
    if (query === '') {
        applyFilters();
        return;
    }
    
    filteredRoutes = allRoutes.filter(route => {
        return route.name.toLowerCase().includes(query) ||
               route.from.toLowerCase().includes(query) ||
               route.to.toLowerCase().includes(query) ||
               route.busNumber.toLowerCase().includes(query);
    });
    
    renderRoutesOnMap();
    renderRouteCards();
    updateStats();
}

function applyFilters() {
    const fromFilter = document.getElementById('filterFrom')?.value;
    const toFilter = document.getElementById('filterTo')?.value;
    const typeFilter = document.querySelector('.filter-pill.active')?.getAttribute('data-type');
    
    filteredRoutes = allRoutes.filter(route => {
        const matchFrom = !fromFilter || route.from === fromFilter;
        const matchTo = !toFilter || route.to === toFilter;
        const matchType = !typeFilter || typeFilter === 'all' || route.type === typeFilter;
        
        return matchFrom && matchTo && matchType;
    });
    
    renderRoutesOnMap();
    renderRouteCards();
    updateStats();
    
    showToast(`Found ${filteredRoutes.length} route${filteredRoutes.length !== 1 ? 's' : ''} 🔍`, 2000);
}

function resetFilters() {
    // Reset search
    const searchInput = document.getElementById('routeSearchInput');
    if (searchInput) searchInput.value = '';
    
    // Reset dropdowns
    const filterFrom = document.getElementById('filterFrom');
    const filterTo = document.getElementById('filterTo');
    
    if (filterFrom) filterFrom.value = '';
    if (filterTo) filterTo.value = '';
    
    // Reset pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.classList.remove('active');
        if (pill.getAttribute('data-type') === 'all') {
            pill.classList.add('active');
        }
    });
    
    // Reset active route
    activeRouteId = null;
    
    // Re-apply (will show all)
    applyFilters();
    
    showToast('Filters reset! 🔄', 2000);
}

// ============================================
// STATS UPDATE
// ============================================

function updateStats() {
    const totalRoutesEl = document.getElementById('totalRoutesCount');
    const totalStopsEl = document.getElementById('totalStopsCount');
    
    if (totalRoutesEl) {
        totalRoutesEl.textContent = filteredRoutes.length;
    }
    
    if (totalStopsEl) {
        const totalStops = filteredRoutes.reduce((sum, route) => sum + route.stops, 0);
        totalStopsEl.textContent = totalStops;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

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

function showToast(message, duration = 3000) {
    const existingToast = document.querySelector('.explorer-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'explorer-toast';
    toast.innerHTML = `<i class="fas fa-check-circle me-2"></i><span>${message}</span>`;
    
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

// Make selectRoute globally accessible
window.selectRoute = selectRoute;

console.log('🗺️ Route Explorer JS loaded successfully! 💖');