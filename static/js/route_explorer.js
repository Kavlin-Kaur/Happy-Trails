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

/* ============================================
   📊 PHASE 2: ROUTE COMPARISON & DETAILS
   Comparison Tool & Route Details
   ============================================ */

// Global comparison variables
let selectedRoutes = [];
let comparisonCharts = {};

// ============================================
// TAB NAVIGATION
// ============================================

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.explorer-tab');
    const tabContents = document.querySelectorAll('.explorer-tab-content');
    
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
            
            // Load tab-specific content
            if (tabId === 'compare-routes') {
                loadCompareTab();
            } else if (tabId === 'route-details') {
                loadDetailsTab();
            }
            
            showToast(`Switched to: ${this.textContent.trim()} ✨`, 2000);
        });
    });
    
    console.log('📑 Tabs initialized');
}

// ============================================
// COMPARE TAB INITIALIZATION
// ============================================

function loadCompareTab() {
    renderSelectionGrid();
}

function renderSelectionGrid() {
    const grid = document.getElementById('selectionGrid');
    if (!grid) return;
    
    grid.innerHTML = allRoutes.map(route => `
        <div class="selection-card" data-route-id="${route.id}" onclick="toggleRouteSelection(${route.id})">
            <div class="selection-checkbox">
                <i class="fas fa-check" style="display: none;"></i>
            </div>
            <div class="selection-card-header">
                <div class="selection-route-name">${route.name}</div>
                <div class="selection-route-path">
                    <i class="fas fa-map-marker-alt"></i>
                    ${route.from}
                    <i class="fas fa-arrow-right"></i>
                    ${route.to}
                </div>
            </div>
            <div class="selection-route-info">
                <div class="selection-info-item">
                    <i class="fas fa-bus"></i>
                    <span>${route.busNumber}</span>
                </div>
                <div class="selection-info-item">
                    <i class="fas fa-tag"></i>
                    <span>${route.type}</span>
                </div>
                <div class="selection-info-item">
                    <i class="fas fa-road"></i>
                    <span>${route.distance}</span>
                </div>
                <div class="selection-info-item">
                    <i class="fas fa-clock"></i>
                    <span>${route.duration}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function toggleRouteSelection(routeId) {
    const card = document.querySelector(`.selection-card[data-route-id="${routeId}"]`);
    const checkbox = card.querySelector('.selection-checkbox i');
    
    if (selectedRoutes.includes(routeId)) {
        // Remove selection
        selectedRoutes = selectedRoutes.filter(id => id !== routeId);
        card.classList.remove('selected');
        checkbox.style.display = 'none';
    } else {
        // Add selection
        if (selectedRoutes.length >= 3) {
            showToast('⚠️ You can compare up to 3 routes only!', 3000);
            return;
        }
        selectedRoutes.push(routeId);
        card.classList.add('selected');
        checkbox.style.display = 'block';
    }
    
    // Update compare button state
    const compareBtn = document.getElementById('compareSelectedBtn');
    if (compareBtn) {
        compareBtn.disabled = selectedRoutes.length < 2;
    }
    
    updateCompareButtonText();
}

function updateCompareButtonText() {
    const compareBtn = document.getElementById('compareSelectedBtn');
    if (!compareBtn) return;
    
    const count = selectedRoutes.length;
    if (count === 0) {
        compareBtn.innerHTML = '<i class="fas fa-chart-bar me-2"></i>Select Routes to Compare';
    } else if (count === 1) {
        compareBtn.innerHTML = '<i class="fas fa-chart-bar me-2"></i>Select at least 2 routes';
    } else {
        compareBtn.innerHTML = `<i class="fas fa-chart-bar me-2"></i>Compare ${count} Routes`;
    }
}

// ============================================
// ROUTE COMPARISON
// ============================================

function initializeComparison() {
    const compareBtn = document.getElementById('compareSelectedBtn');
    if (compareBtn) {
        compareBtn.addEventListener('click', performComparison);
    }
}

function performComparison() {
    if (selectedRoutes.length < 2) {
        showToast('⚠️ Please select at least 2 routes!', 3000);
        return;
    }
    
    const comparisonResult = document.getElementById('comparisonResult');
    if (!comparisonResult) return;
    
    // Get selected route data
    const routesToCompare = selectedRoutes.map(id => 
        allRoutes.find(route => route.id === id)
    );
    
    // Show result section
    comparisonResult.style.display = 'block';
    
    // Render optimal suggestion
    renderOptimalSuggestion(routesToCompare);
    
    // Render comparison table
    renderComparisonTable(routesToCompare);
    
    // Render charts
    renderComparisonCharts(routesToCompare);
    
    // Scroll to results
    comparisonResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    showToast('Comparison generated! 📊', 2000);
}

function renderOptimalSuggestion(routes) {
    const container = document.getElementById('optimalSuggestion');
    if (!container) return;
    
    // Calculate scores for each route
    const scoredRoutes = routes.map(route => {
        let score = 0;
        const reasons = [];
        
        // Distance score (shorter is better)
        const distanceKm = parseFloat(route.distance);
        if (distanceKm <= 20) {
            score += 3;
            reasons.push('Shortest distance');
        } else if (distanceKm <= 25) {
            score += 2;
        } else {
            score += 1;
        }
        
        // Duration score (faster is better)
        const durationMin = parseDuration(route.duration);
        if (durationMin <= 50) {
            score += 3;
            reasons.push('Fastest route');
        } else if (durationMin <= 70) {
            score += 2;
        } else {
            score += 1;
        }
        
        // Price score (cheaper is better)
        const price = route.price || 150;
        if (price <= 120) {
            score += 3;
            reasons.push('Most affordable');
        } else if (price <= 150) {
            score += 2;
        } else {
            score += 1;
        }
        
        // Type score
        if (route.type === 'Premium') {
            score += 3;
            reasons.push('Premium comfort');
        } else if (route.type === 'Deluxe') {
            score += 2;
        } else {
            score += 1;
        }
        
        // Stops score (fewer stops better for express)
        if (route.stops <= 6) {
            score += 2;
            reasons.push('Fewer stops');
        } else if (route.stops <= 8) {
            score += 1;
        }
        
        return { route, score, reasons };
    });
    
    // Find best route
    const optimal = scoredRoutes.reduce((best, current) => 
        current.score > best.score ? current : best
    );
    
    container.innerHTML = `
        <div class="optimal-title">
            <i class="fas fa-trophy"></i>
            Recommended Route
        </div>
        <div class="optimal-route-name">${optimal.route.name}</div>
        <div style="color: #6C757D; margin-bottom: 15px;">
            ${optimal.route.busNumber} • ${optimal.route.type} • ${optimal.route.distance} • ${optimal.route.duration}
        </div>
        <div class="optimal-reasons">
            ${optimal.reasons.map(reason => `
                <span class="reason-badge">
                    <i class="fas fa-check-circle me-1"></i>
                    ${reason}
                </span>
            `).join('')}
        </div>
    `;
}

function renderComparisonTable(routes) {
    const container = document.getElementById('comparisonTable');
    if (!container) return;
    
    // Prepare comparison data
    const metrics = [
        { label: 'Bus Number', key: 'busNumber', icon: 'fas fa-bus' },
        { label: 'Type', key: 'type', icon: 'fas fa-tag' },
        { label: 'Distance', key: 'distance', icon: 'fas fa-road', compare: 'lower' },
        { label: 'Duration', key: 'duration', icon: 'fas fa-clock', compare: 'lower' },
        { label: 'Price', key: 'price', icon: 'fas fa-rupee-sign', compare: 'lower' },
        { label: 'Stops', key: 'stops', icon: 'fas fa-map-pin', compare: 'lower' },
        { label: 'Departure', key: 'departure_time', icon: 'fas fa-calendar-alt' },
        { label: 'Arrival', key: 'arrival_time', icon: 'fas fa-flag-checkered' },
        { label: 'Comfort', key: 'type', icon: 'fas fa-couch', compare: 'higher' }
    ];
    
    // Build table
    let html = `
        <div class="comparison-row header">
            <div class="comparison-cell label">Metric</div>
            ${routes.map(route => `
                <div class="comparison-cell">${route.name}</div>
            `).join('')}
        </div>
    `;
    
    metrics.forEach(metric => {
        // Determine winners for this metric
        let winners = [];
        if (metric.compare) {
            const values = routes.map(r => getMetricValue(r, metric));
            const bestValue = metric.compare === 'lower' 
                ? Math.min(...values) 
                : Math.max(...values);
            
            winners = routes.map((r, i) => values[i] === bestValue ? i : -1)
                            .filter(i => i !== -1);
        }
        
        html += `
            <div class="comparison-row">
                <div class="comparison-cell label">
                    <i class="${metric.icon} me-2"></i>
                    ${metric.label}
                </div>
                ${routes.map((route, index) => {
                    const value = getDisplayValue(route, metric);
                    const isWinner = winners.includes(index);
                    return `
                        <div class="comparison-cell ${isWinner ? 'winner' : ''}">
                            ${value}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function getMetricValue(route, metric) {
    switch(metric.key) {
        case 'distance':
            return parseFloat(route.distance);
        case 'duration':
            return parseDuration(route.duration);
        case 'price':
            return route.price || 150;
        case 'stops':
            return route.stops;
        case 'type':
            const typeValues = { 'Standard': 1, 'Deluxe': 2, 'Premium': 3 };
            return typeValues[route.type] || 1;
        default:
            return 0;
    }
}

function getDisplayValue(route, metric) {
    switch(metric.key) {
        case 'price':
            return `₹${route.price || 150}`;
        case 'departure_time':
            return route.departure_time || '08:00 AM';
        case 'arrival_time':
            return route.arrival_time || '09:15 AM';
        default:
            return route[metric.key] || 'N/A';
    }
}

function parseDuration(duration) {
    // Parse duration like "1h 15m" to minutes
    const match = duration.match(/(\d+)h?\s*(\d+)?m?/);
    if (match) {
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        return hours * 60 + minutes;
    }
    return 60; // Default
}

// ============================================
// COMPARISON CHARTS
// ============================================

function renderComparisonCharts(routes) {
    // Destroy existing charts
    Object.values(comparisonCharts).forEach(chart => {
        if (chart) chart.destroy();
    });
    comparisonCharts = {};
    
    // Distance chart
    renderDistanceChart(routes);
    
    // Duration chart
    renderDurationChart(routes);
    
    // Price chart
    renderPriceChart(routes);
    
    // Rating chart
    renderRatingChart(routes);
}

function renderDistanceChart(routes) {
    const canvas = document.getElementById('distanceChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    comparisonCharts.distance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: routes.map(r => r.busNumber),
            datasets: [{
                label: 'Distance (km)',
                data: routes.map(r => parseFloat(r.distance)),
                backgroundColor: routes.map(r => r.color + '80'),
                borderColor: routes.map(r => r.color),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Kilometers'
                    }
                }
            }
        }
    });
}

function renderDurationChart(routes) {
    const canvas = document.getElementById('durationChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    comparisonCharts.duration = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: routes.map(r => r.busNumber),
            datasets: [{
                label: 'Duration (minutes)',
                data: routes.map(r => parseDuration(r.duration)),
                backgroundColor: routes.map(r => r.color + '80'),
                borderColor: routes.map(r => r.color),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    }
                }
            }
        }
    });
}

function renderPriceChart(routes) {
    const canvas = document.getElementById('priceChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    comparisonCharts.price = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: routes.map(r => r.busNumber),
            datasets: [{
                label: 'Price (₹)',
                data: routes.map(r => r.price || 150),
                backgroundColor: routes.map(r => r.color + '80'),
                borderColor: routes.map(r => r.color),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Rupees (₹)'
                    }
                }
            }
        }
    });
}

function renderRatingChart(routes) {
    const canvas = document.getElementById('ratingChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Generate ratings based on type
    const ratings = routes.map(r => {
        const baseRating = { 'Standard': 4.0, 'Deluxe': 4.3, 'Premium': 4.7 };
        return baseRating[r.type] || 4.0;
    });
    
    comparisonCharts.rating = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Comfort', 'Punctuality', 'Service', 'Value', 'Cleanliness'],
            datasets: routes.map((route, index) => ({
                label: route.busNumber,
                data: [
                    ratings[index],
                    4.5,
                    ratings[index] + 0.2,
                    5 - (route.price || 150) / 50,
                    ratings[index] + 0.1
                ],
                backgroundColor: route.color + '40',
                borderColor: route.color,
                borderWidth: 2
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });
}

// ============================================
// COMPARISON ACTIONS
// ============================================

function exportComparison() {
    showToast('Exporting comparison... 📥', 2000);
    
    setTimeout(() => {
        showToast('Export feature coming soon! 🚧', 3000);
    }, 1000);
}

function saveComparison() {
    const comparisonData = {
        routes: selectedRoutes,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('happytrails_saved_comparison', JSON.stringify(comparisonData));
    
    showToast('Comparison saved! 💾', 2000);
}

function resetComparison() {
    selectedRoutes = [];
    
    // Clear selections
    document.querySelectorAll('.selection-card').forEach(card => {
        card.classList.remove('selected');
        card.querySelector('.selection-checkbox i').style.display = 'none';
    });
    
    // Hide results
    const comparisonResult = document.getElementById('comparisonResult');
    if (comparisonResult) {
        comparisonResult.style.display = 'none';
    }
    
    // Update button
    updateCompareButtonText();
    const compareBtn = document.getElementById('compareSelectedBtn');
    if (compareBtn) {
        compareBtn.disabled = true;
    }
    
    showToast('Comparison reset! 🔄', 2000);
}

// ============================================
// ROUTE DETAILS TAB
// ============================================

function loadDetailsTab() {
    populateDetailsSelector();
}

function populateDetailsSelector() {
    const selector = document.getElementById('detailsRouteSelector');
    if (!selector) return;
    
    selector.innerHTML = '<option value="">Choose a route...</option>' + 
        allRoutes.map(route => `
            <option value="${route.id}">${route.name} (${route.busNumber})</option>
        `).join('');
    
    selector.addEventListener('change', function() {
        const routeId = parseInt(this.value);
        if (routeId) {
            showRouteDetails(routeId);
        } else {
            document.getElementById('routeDetailsContent').style.display = 'none';
        }
    });
}

function showRouteDetails(routeId) {
    const route = allRoutes.find(r => r.id === routeId);
    if (!route) return;
    
    const container = document.getElementById('routeDetailsContent');
    if (!container) return;
    
    // Generate amenities based on type
    const amenities = {
        'Standard': ['Air Conditioning', 'Comfortable Seats', 'Water Bottle', 'Reading Light'],
        'Deluxe': ['Air Conditioning', 'Reclining Seats', 'WiFi', 'Snacks', 'USB Charging', 'Entertainment'],
        'Premium': ['Air Conditioning', 'Luxury Seats', 'WiFi', 'Entertainment', 'Meals', 'Blankets', 'Premium Service']
    };
    
    const routeAmenities = amenities[route.type] || amenities['Standard'];
    
    container.innerHTML = `
        <div class="details-route-header">
            <div class="details-route-name">${route.name}</div>
            <div class="details-route-path">
                <i class="fas fa-map-marker-alt"></i>
                ${route.from}
                <i class="fas fa-arrow-right"></i>
                ${route.to}
            </div>
            <div style="margin-top: 15px;">
                <span class="route-type-badge ${route.type.toLowerCase()}">${route.type}</span>
            </div>
        </div>
        
        <div class="details-grid">
            <div class="detail-card">
                <div class="detail-card-title">
                    <i class="fas fa-bus"></i>
                    Bus Number
                </div>
                <div class="detail-card-value">${route.busNumber}</div>
            </div>
            
            <div class="detail-card">
                <div class="detail-card-title">
                    <i class="fas fa-road"></i>
                    Distance
                </div>
                <div class="detail-card-value">${route.distance}</div>
            </div>
            
            <div class="detail-card">
                <div class="detail-card-title">
                    <i class="fas fa-clock"></i>
                    Duration
                </div>
                <div class="detail-card-value">${route.duration}</div>
            </div>
            
            <div class="detail-card">
                <div class="detail-card-title">
                    <i class="fas fa-rupee-sign"></i>
                    Price
                </div>
                <div class="detail-card-value">₹${route.price || 150}</div>
            </div>
            
            <div class="detail-card">
                <div class="detail-card-title">
                    <i class="fas fa-map-pin"></i>
                    Stops
                </div>
                <div class="detail-card-value">${route.stops}</div>
                <div class="detail-card-label">Bus stops along route</div>
            </div>
            
            <div class="detail-card">
                <div class="detail-card-title">
                    <i class="fas fa-calendar-check"></i>
                    Departure
                </div>
                <div class="detail-card-value">${route.departure_time || '08:00 AM'}</div>
            </div>
            
            <div class="detail-card">
                <div class="detail-card-title">
                    <i class="fas fa-flag-checkered"></i>
                    Arrival
                </div>
                <div class="detail-card-value">${route.arrival_time || '09:15 AM'}</div>
            </div>
            
            <div class="detail-card">
                <div class="detail-card-title">
                    <i class="fas fa-star"></i>
                    Rating
                </div>
                <div class="detail-card-value">⭐ 4.5</div>
                <div class="detail-card-label">Based on 234 reviews</div>
            </div>
        </div>
        
        <div style="margin-top: 30px;">
            <h3 style="font-family: 'Caveat', cursive; font-size: 1.8rem; color: #F57F17; margin-bottom: 15px;">
                <i class="fas fa-star me-2"></i>
                Amenities & Features
            </h3>
            <div class="amenities-list">
                ${routeAmenities.map(amenity => `
                    <span class="amenity-badge">
                        <i class="fas fa-check-circle"></i>
                        ${amenity}
                    </span>
                `).join('')}
            </div>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: rgba(255, 249, 230, 0.5); border-radius: 15px; border: 2px dashed rgba(255, 215, 0, 0.3);">
            <h4 style="color: #2C3E50; margin-bottom: 10px;">
                <i class="fas fa-route me-2"></i>
                Route Information
            </h4>
            <p style="color: #6C757D; line-height: 1.7;">
                This ${route.type.toLowerCase()} bus service operates between ${route.from} and ${route.to}, 
                covering a distance of ${route.distance} in approximately ${route.duration}. 
                The route includes ${route.stops} convenient stops along the way, ensuring comfortable access 
                for all passengers. Departure is at ${route.departure_time || '08:00 AM'} with an expected 
                arrival at ${route.arrival_time || '09:15 AM'}.
            </p>
        </div>
        
        <button class="book-route-btn" onclick="bookRoute(${route.id})">
            <i class="fas fa-ticket-alt me-2"></i>
            Book This Route Now
        </button>
    `;
    
    container.style.display = 'block';
    
    // Scroll to content
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function bookRoute(routeId) {
    const route = allRoutes.find(r => r.id === routeId);
    if (!route) return;
    
    // Store route data for booking
    sessionStorage.setItem('selected_route', JSON.stringify(route));
    
    // Redirect to booking page (or show booking modal)
    showToast(`Redirecting to booking for ${route.busNumber}... 🎫`, 2000);
    
    setTimeout(() => {
        window.location.href = '/';
    }, 2000);
}

// ============================================
// UPDATE INITIALIZATION
// ============================================

// Update the main initialization
const originalInitRouteExplorer = initializeRouteExplorer;
initializeRouteExplorer = function() {
    originalInitRouteExplorer();
    initializeTabs();
    initializeComparison();
};

// Make functions globally accessible
window.toggleRouteSelection = toggleRouteSelection;
window.exportComparison = exportComparison;
window.saveComparison = saveComparison;
window.resetComparison = resetComparison;
window.bookRoute = bookRoute;

console.log('📊 Phase 2: Comparison & Details loaded successfully! 💖');

/* ============================================
   🌤️ PHASE 3: WEATHER INTEGRATION
   Weather Data & Real-Time Updates
   ============================================ */

// Global weather variables
let weatherData = {};
let weatherUpdateInterval = null;

// Weather icon mapping
const weatherIcons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '🌨️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️',
    'Smoke': '💨',
    'Dust': '💨',
    'Sand': '💨'
};

// ============================================
// WEATHER TAB INITIALIZATION
// ============================================

function initializeWeather() {
    const weatherTab = document.querySelector('[data-tab="weather-conditions"]');
    if (weatherTab) {
        weatherTab.addEventListener('click', loadWeatherTab);
    }
    
    console.log('🌤️ Weather system initialized');
}

function loadWeatherTab() {
    // Check if weather data is already loaded
    if (Object.keys(weatherData).length === 0) {
        fetchWeatherData();
    }
    
    // Setup auto-refresh (every 30 minutes)
    if (weatherUpdateInterval) {
        clearInterval(weatherUpdateInterval);
    }
    
    weatherUpdateInterval = setInterval(() => {
        fetchWeatherData(true);
    }, 1800000); // 30 minutes
}

// ============================================
// FETCH WEATHER DATA
// ============================================

async function fetchWeatherData(isRefresh = false) {
    if (!isRefresh) {
        showWeatherLoading();
    }
    
    const destinations = ['Dharampur', 'Solan', 'Barog', 'Dagshai'];
    const promises = [];
    
    // Fetch weather for each destination
    for (const destination of destinations) {
        promises.push(fetchCityWeather(destination));
    }
    
    try {
        const results = await Promise.all(promises);
        
        results.forEach((data, index) => {
            if (data) {
                weatherData[destinations[index]] = data;
            }
        });
        
        // Render weather UI
        renderWeatherCards();
        renderTravelRecommendations();
        renderForecast();
        checkWeatherAlerts();
        
        // Update timestamp
        updateWeatherTimestamp();
        
        // Hide loading
        hideWeatherLoading();
        
        if (isRefresh) {
            showToast('Weather data refreshed! 🌤️', 2000);
        }
        
    } catch (error) {
        console.error('Weather fetch error:', error);
        showWeatherError();
    }
}

async function fetchCityWeather(city) {
    // Use approximate coordinates for Himachal Pradesh cities
    const cityCoords = {
        'Dharampur': { lat: 30.8750, lon: 77.0500 },
        'Solan': { lat: 30.9100, lon: 77.1734 },
        'Barog': { lat: 30.9600, lon: 77.0700 },
        'Dagshai': { lat: 30.9900, lon: 76.9800 }
    };
    
    const coords = cityCoords[city];
    if (!coords) return null;
    
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            city: city,
            temp: Math.round(data.main.temp),
            feels_like: Math.round(data.main.feels_like),
            condition: data.weather[0].main,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            wind_speed: data.wind.speed,
            pressure: data.main.pressure,
            visibility: data.visibility / 1000, // Convert to km
            sunrise: new Date(data.sys.sunrise * 1000),
            sunset: new Date(data.sys.sunset * 1000),
            icon: weatherIcons[data.weather[0].main] || '🌤️'
        };
        
    } catch (error) {
        console.error(`Error fetching weather for ${city}:`, error);
        return null;
    }
}

// ============================================
// RENDER WEATHER UI
// ============================================

function renderWeatherCards() {
    const container = document.getElementById('weatherCardsGrid');
    if (!container) return;
    
    const cities = Object.keys(weatherData);
    
    if (cities.length === 0) {
        return;
    }
    
    container.innerHTML = cities.map((city, index) => {
        const weather = weatherData[city];
        const conditionClass = weather.condition.toLowerCase();
        const isBestTime = weather.temp >= 15 && weather.temp <= 25 && 
                          !['Rain', 'Thunderstorm', 'Snow'].includes(weather.condition);
        
        return `
            <div class="weather-card ${conditionClass}" style="animation-delay: ${index * 0.1}s">
                ${isBestTime ? `
                    <div class="best-time-badge">
                        <i class="fas fa-star"></i>
                        Best Time to Travel
                    </div>
                ` : ''}
                
                <div class="weather-card-header">
                    <div class="weather-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${city}
                    </div>
                    <div class="weather-icon-large ${conditionClass}">
                        ${weather.icon}
                    </div>
                </div>
                
                <div class="weather-temp">
                    ${weather.temp}
                    <span class="weather-temp-unit">°C</span>
                </div>
                
                <div class="weather-condition">
                    ${weather.description}
                </div>
                
                <div class="weather-details">
                    <div class="weather-detail-item">
                        <i class="fas fa-temperature-low"></i>
                        <div>
                            <div class="weather-detail-label">Feels Like</div>
                            <div class="weather-detail-value">${weather.feels_like}°C</div>
                        </div>
                    </div>
                    
                    <div class="weather-detail-item">
                        <i class="fas fa-tint"></i>
                        <div>
                            <div class="weather-detail-label">Humidity</div>
                            <div class="weather-detail-value">${weather.humidity}%</div>
                        </div>
                    </div>
                    
                    <div class="weather-detail-item">
                        <i class="fas fa-wind"></i>
                        <div>
                            <div class="weather-detail-label">Wind Speed</div>
                            <div class="weather-detail-value">${weather.wind_speed} m/s</div>
                        </div>
                    </div>
                    
                    <div class="weather-detail-item">
                        <i class="fas fa-eye"></i>
                        <div>
                            <div class="weather-detail-label">Visibility</div>
                            <div class="weather-detail-value">${weather.visibility} km</div>
                        </div>
                    </div>
                    
                    <div class="weather-detail-item">
                        <i class="fas fa-sun"></i>
                        <div>
                            <div class="weather-detail-label">Sunrise</div>
                            <div class="weather-detail-value">${formatTime(weather.sunrise)}</div>
                        </div>
                    </div>
                    
                    <div class="weather-detail-item">
                        <i class="fas fa-moon"></i>
                        <div>
                            <div class="weather-detail-label">Sunset</div>
                            <div class="weather-detail-value">${formatTime(weather.sunset)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.style.display = 'grid';
}

function renderTravelRecommendations() {
    const container = document.getElementById('recommendationsGrid');
    if (!container) return;
    
    const recommendations = generateRecommendations();
    
    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card">
            <div class="recommendation-icon">${rec.icon}</div>
            <div class="recommendation-title">${rec.title}</div>
            <div class="recommendation-text">${rec.text}</div>
            <span class="recommendation-badge ${rec.type}">${rec.badge}</span>
        </div>
    `).join('');
    
    document.getElementById('travelRecommendations').style.display = 'block';
}

function generateRecommendations() {
    const recommendations = [];
    const cities = Object.keys(weatherData);
    
    // Find best weather
    const bestWeather = cities.reduce((best, city) => {
        const weather = weatherData[city];
        const score = calculateWeatherScore(weather);
        return score > (best.score || 0) ? { city, score, weather } : best;
    }, {});
    
    if (bestWeather.city) {
        recommendations.push({
            icon: '⭐',
            title: `Best Conditions: ${bestWeather.city}`,
            text: `Perfect weather with ${bestWeather.weather.temp}°C and ${bestWeather.weather.description}. Ideal for travel!`,
            type: 'good',
            badge: 'Recommended'
        });
    }
    
    // Check for rain
    const rainyRoutes = cities.filter(city => 
        ['Rain', 'Drizzle', 'Thunderstorm'].includes(weatherData[city].condition)
    );
    
    if (rainyRoutes.length > 0) {
        recommendations.push({
            icon: '🌧️',
            title: 'Rain Expected',
            text: `${rainyRoutes.join(', ')} experiencing rain. Carry umbrellas and allow extra travel time.`,
            type: 'warning',
            badge: 'Caution'
        });
    }
    
    // Temperature advice
    const coldRoutes = cities.filter(city => weatherData[city].temp < 10);
    if (coldRoutes.length > 0) {
        recommendations.push({
            icon: '🧥',
            title: 'Cold Weather Alert',
            text: `${coldRoutes.join(', ')} are quite cold. Wear warm clothes and carry jackets.`,
            type: 'warning',
            badge: 'Advisory'
        });
    }
    
    // Visibility check
    const lowVisibility = cities.filter(city => weatherData[city].visibility < 5);
    if (lowVisibility.length > 0) {
        recommendations.push({
            icon: '🌫️',
            title: 'Low Visibility',
            text: `Reduced visibility in ${lowVisibility.join(', ')}. Drivers should exercise extra caution.`,
            type: 'alert',
            badge: 'Alert'
        });
    }
    
    // Add general tip if no special conditions
    if (recommendations.length === 1) {
        recommendations.push({
            icon: '💡',
            title: 'Travel Tip',
            text: 'Weather conditions are generally favorable. Perfect day for your journey!',
            type: 'good',
            badge: 'Good to Go'
        });
    }
    
    return recommendations;
}

function calculateWeatherScore(weather) {
    let score = 0;
    
    // Temperature score (15-25°C is ideal)
    if (weather.temp >= 15 && weather.temp <= 25) score += 40;
    else if (weather.temp >= 10 && weather.temp <= 30) score += 20;
    
    // Condition score
    if (weather.condition === 'Clear') score += 30;
    else if (weather.condition === 'Clouds') score += 20;
    else if (['Rain', 'Thunderstorm', 'Snow'].includes(weather.condition)) score -= 20;
    
    // Visibility score
    if (weather.visibility >= 10) score += 20;
    else if (weather.visibility >= 5) score += 10;
    
    // Wind score
    if (weather.wind_speed <= 5) score += 10;
    
    return score;
}

function renderForecast() {
    const container = document.getElementById('forecastCarousel');
    if (!container) return;
    
    // Generate mock 7-day forecast
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    
    const forecast = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        // Simulate forecast data
        const conditions = ['Clear', 'Clouds', 'Rain', 'Drizzle'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        return {
            day: days[date.getDay()],
            date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            icon: weatherIcons[condition] || '🌤️',
            high: Math.round(20 + Math.random() * 10),
            low: Math.round(10 + Math.random() * 10),
            condition: condition
        };
    });
    
    container.innerHTML = forecast.map((day, index) => `
        <div class="forecast-day-card" style="animation-delay: ${index * 0.1}s">
            <div class="forecast-day-name">${day.day}</div>
            <div class="forecast-day-date">${day.date}</div>
            <div class="forecast-icon">${day.icon}</div>
            <div class="forecast-temp-range">
                <span class="forecast-temp-high">${day.high}°</span>
                <span class="forecast-temp-low">${day.low}°</span>
            </div>
            <div class="forecast-condition">${day.condition}</div>
        </div>
    `).join('');
    
    document.getElementById('forecastSection').style.display = 'block';
}

function checkWeatherAlerts() {
    const container = document.getElementById('weatherAlerts');
    if (!container) return;
    
    const alerts = [];
    const cities = Object.keys(weatherData);
    
    // Check for severe weather
    cities.forEach(city => {
        const weather = weatherData[city];
        
        if (weather.condition === 'Thunderstorm') {
            alerts.push({
                title: `⚠️ Thunderstorm Warning - ${city}`,
                text: 'Severe thunderstorm expected. Avoid travel if possible. If traveling, stay updated with weather conditions.'
            });
        }
        
        if (weather.wind_speed > 15) {
            alerts.push({
                title: `💨 High Wind Alert - ${city}`,
                text: `Strong winds (${weather.wind_speed} m/s) expected. Drive carefully and secure loose items.`
            });
        }
        
        if (weather.temp < 5) {
            alerts.push({
                title: `❄️ Cold Wave - ${city}`,
                text: 'Extremely cold conditions. Wear multiple layers and carry warm beverages.'
            });
        }
    });
    
    if (alerts.length > 0) {
        container.innerHTML = `
            <div class="alert-header">
                <div class="alert-icon">⚠️</div>
                <h3 class="alert-title">Weather Alerts</h3>
            </div>
            <div class="alert-content">
                ${alerts.map(alert => `
                    <div class="alert-item">
                        <div class="alert-item-title">${alert.title}</div>
                        <div class="alert-item-text">${alert.text}</div>
                    </div>
                `).join('')}
            </div>
        `;
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showWeatherLoading() {
    const loading = document.getElementById('weatherLoading');
    const cardsGrid = document.getElementById('weatherCardsGrid');
    
    if (loading) loading.style.display = 'block';
    if (cardsGrid) cardsGrid.style.display = 'none';
}

function hideWeatherLoading() {
    const loading = document.getElementById('weatherLoading');
    if (loading) loading.style.display = 'none';
}

function showWeatherError() {
    const loading = document.getElementById('weatherLoading');
    const cardsGrid = document.getElementById('weatherCardsGrid');
    
    if (loading) {
        loading.innerHTML = `
            <div class="weather-error">
                <div class="weather-error-icon">⚠️</div>
                <div class="weather-error-title">Unable to Load Weather Data</div>
                <div class="weather-error-text">
                    There was an error fetching weather information. 
                    Please check your internet connection and try again.
                </div>
                <button class="refresh-weather-btn" onclick="fetchWeatherData()" style="margin-top: 20px;">
                    <i class="fas fa-sync-alt me-2"></i>
                    Retry
                </button>
            </div>
        `;
    }
    
    if (cardsGrid) cardsGrid.style.display = 'none';
}

function updateWeatherTimestamp() {
    const element = document.getElementById('weatherLastUpdate');
    if (element) {
        const now = new Date();
        element.textContent = now.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function refreshWeatherData() {
    fetchWeatherData(true);
}

// ============================================
// UPDATE INITIALIZATION
// ============================================

// Update the main initialization
const originalInitRouteExplorer2 = initializeRouteExplorer;
initializeRouteExplorer = function() {
    originalInitRouteExplorer2();
    initializeWeather();
};

// Make functions globally accessible
window.refreshWeatherData = refreshWeatherData;

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (weatherUpdateInterval) {
        clearInterval(weatherUpdateInterval);
    }
});

console.log('🌤️ Phase 3: Weather Integration loaded successfully! 💖');