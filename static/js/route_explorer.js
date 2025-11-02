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

/* ============================================
   🏔️ PHASE 4: SCENIC HIGHLIGHTS & POI
   Points of Interest System
   ============================================ */

// Global POI variables
let allPOIs = [];
let filteredPOIs = [];
let favoritePOIs = [];
let poiMap = null;
let poiMarkers = [];

// POI Data
const POI_DATA = [
    {
        id: 1,
        name: 'Dharampur Valley Viewpoint',
        category: 'viewpoints',
        location: 'Dharampur',
        coordinates: [30.8800, 77.0600],
        route: 'HT-101',
        distance: '2.5 km from route',
        rating: 4.8,
        reviews: 234,
        description: 'Breathtaking panoramic views of the entire valley with snow-capped peaks in the distance. Best visited during sunrise for golden hour photography.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        bestTime: 'Spring & Autumn',
        duration: '30-45 minutes',
        accessibility: 'Wheelchair accessible parking available',
        tips: [
            { title: 'Photography', text: 'Bring a wide-angle lens for panoramic shots' },
            { title: 'Timing', text: 'Visit between 6-8 AM for best light' },
            { title: 'Weather', text: 'Check weather forecast - clear days offer 50km visibility' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
            'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400'
        ],
        featured: true
    },
    {
        id: 2,
        name: 'Barog Heritage Tunnel',
        category: 'heritage',
        location: 'Barog',
        coordinates: [30.9600, 77.0700],
        route: 'HT-102',
        distance: '0.5 km from route',
        rating: 4.6,
        reviews: 189,
        description: 'Historic railway tunnel built in 1903 during British era. Engineering marvel with fascinating colonial history. The tunnel is still operational for trains.',
        image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800',
        bestTime: 'All Year',
        duration: '1-2 hours',
        accessibility: 'Steep pathways - not wheelchair accessible',
        tips: [
            { title: 'Safety', text: 'Watch for train schedules before entering tunnel area' },
            { title: 'History', text: 'Hire a local guide to learn fascinating stories' },
            { title: 'Photography', text: 'Afternoon light creates beautiful shadows inside' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400',
            'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400',
            'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400'
        ],
        featured: true
    },
    {
        id: 3,
        name: 'Solan Temple Complex',
        category: 'religious',
        location: 'Solan',
        coordinates: [30.9150, 77.1700],
        route: 'HT-101',
        distance: '1 km from route',
        rating: 4.7,
        reviews: 312,
        description: 'Ancient hilltop temple offering spiritual serenity and panoramic city views. Beautiful architecture with intricate carvings dating back centuries.',
        image: 'https://images.unsplash.com/photo-1696239108459-5f1356d00e5e?w=800',
        bestTime: 'Early Morning',
        duration: '1 hour',
        accessibility: 'Steps to temple - wheelchair accessible viewing area',
        tips: [
            { title: 'Dress Code', text: 'Modest clothing required - cover shoulders and knees' },
            { title: 'Timing', text: 'Visit during morning aarti (prayer) for authentic experience' },
            { title: 'Offerings', text: 'Flowers and prasad available at temple entrance' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1582632979892-6fda46d8d2ea?w=400',
            'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400',
            'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400'
        ],
        featured: false
    },
    {
        id: 4,
        name: 'Dagshai Cantonment Heritage Walk',
        category: 'heritage',
        location: 'Dagshai',
        coordinates: [30.9900, 76.9800],
        route: 'HT-103',
        distance: '0.3 km from route',
        rating: 4.5,
        reviews: 156,
        description: 'Walk through colonial-era military cantonment with preserved British architecture, old jail, and stunning valley views. Rich in history and stories.',
        image: 'https://images.unsplash.com/photo-1656253814254-7e697b0e5d50?w=800',
        bestTime: 'Winter',
        duration: '2-3 hours',
        accessibility: 'Mixed terrain - partially accessible',
        tips: [
            { title: 'Guide', text: 'Local guides available at cantonment entrance' },
            { title: 'Photography', text: 'Colonial buildings offer great photo opportunities' },
            { title: 'Walking', text: 'Wear comfortable shoes for 3km heritage trail' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1555881424-9c0c2b2a7f10?w=400',
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
            'https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=400'
        ],
        featured: true
    },
    {
        id: 5,
        name: 'Mountain Dhaba - Authentic Himachali',
        category: 'food',
        location: 'Solan',
        coordinates: [30.9120, 77.1650],
        route: 'HT-101',
        distance: '0.2 km from route',
        rating: 4.9,
        reviews: 445,
        description: 'Family-run roadside dhaba serving authentic Himachali cuisine. Famous for madra, siddu, and traditional thali. Warm hospitality and local flavors.',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
        bestTime: 'Lunch Hours',
        duration: '45 minutes',
        accessibility: 'Ground level seating available',
        tips: [
            { title: 'Must Try', text: 'Order the Himachali thali for complete experience' },
            { title: 'Timing', text: 'Busy during lunch (12-2 PM) - arrive early' },
            { title: 'Payment', text: 'Cash only - no cards accepted' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
            'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400',
            'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400'
        ],
        featured: false
    },
    {
        id: 6,
        name: 'Pine Forest Nature Trail',
        category: 'nature',
        location: 'Dharampur',
        coordinates: [30.9000, 77.1500],
        route: 'HT-101',
        distance: '1.5 km from route',
        rating: 4.6,
        reviews: 198,
        description: 'Peaceful 2km walking trail through dense pine forest. Perfect for nature lovers, birdwatching, and meditation. Fresh mountain air and serene atmosphere.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        bestTime: 'Spring & Monsoon',
        duration: '1-1.5 hours',
        accessibility: 'Natural trail - not wheelchair accessible',
        tips: [
            { title: 'Wildlife', text: 'Keep eyes open for Himalayan birds and small mammals' },
            { title: 'Safety', text: 'Stay on marked trails and inform someone of your route' },
            { title: 'Essentials', text: 'Carry water, wear sturdy shoes, bring insect repellent' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
            'https://images.unsplash.com/photo-1511497584788-876760111969?w=400',
            'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400'
        ],
        featured: false
    },
    {
        id: 7,
        name: 'Adventure Sports Center',
        category: 'adventure',
        location: 'Barog',
        coordinates: [30.9550, 77.0750],
        route: 'HT-102',
        distance: '3 km from route',
        rating: 4.7,
        reviews: 267,
        description: 'Thrilling adventure activities including paragliding, zip-lining, and rock climbing. Professional instructors and safety equipment provided.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        bestTime: 'Summer & Autumn',
        duration: '2-4 hours',
        accessibility: 'Adventure activities - fitness required',
        tips: [
            { title: 'Booking', text: 'Book paragliding sessions in advance during peak season' },
            { title: 'Weather', text: 'Activities cancelled in rain - check forecast' },
            { title: 'Age Limit', text: 'Minimum age 12 for most activities' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'
        ],
        featured: false
    },
    {
        id: 8,
        name: 'Sunset Point Photography Paradise',
        category: 'photography',
        location: 'Dharampur',
        coordinates: [30.8900, 77.0800],
        route: 'HT-101',
        distance: '2 km from route',
        rating: 4.9,
        reviews: 389,
        description: 'Instagram-worthy sunset views with valley backdrop. Popular spot for photographers and couples. Unobstructed 180° views of the mountains.',
        image: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=800',
        bestTime: 'Evening (5-7 PM)',
        duration: '1 hour',
        accessibility: 'Easy access - wheelchair friendly',
        tips: [
            { title: 'Photography', text: 'Arrive 30 minutes before sunset for best shots' },
            { title: 'Crowds', text: 'Popular spot - arrive early on weekends' },
            { title: 'Equipment', text: 'Tripod recommended for long exposure shots' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=400',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'
        ],
        featured: true
    }
];

// ============================================
// POI TAB INITIALIZATION
// ============================================

function initializePOI() {
    const poiTab = document.querySelector('[data-tab="scenic-highlights"]');
    if (poiTab) {
        poiTab.addEventListener('click', loadPOITab);
    }
    
    console.log('🏔️ POI system initialized');
}

function loadPOITab() {
    // Initialize POI data
    allPOIs = POI_DATA;
    filteredPOIs = [...allPOIs];
    
    // Load favorites from localStorage
    loadFavoritePOIs();
    
    // Setup event listeners
    setupPOIEventListeners();
    
    // Populate route filter
    populatePOIRouteFilter();
    
    // Render POIs
    renderPOICards();
    
    // Render featured highlights
    renderFeaturedHighlights();
    
    // Initialize POI map
    initializePOIMap();
    
    // Update statistics
    updatePOIStats();
}

function setupPOIEventListeners() {
    // Category filter pills
    document.querySelectorAll('.poi-category-pill').forEach(pill => {
        pill.addEventListener('click', function() {
            document.querySelectorAll('.poi-category-pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            filterPOIsByCategory(this.getAttribute('data-category'));
        });
    });
    
    // Route filter
    const routeFilter = document.getElementById('poiRouteFilter');
    if (routeFilter) {
        routeFilter.addEventListener('change', function() {
            filterPOIsByRoute(this.value);
        });
    }
}

function populatePOIRouteFilter() {
    const select = document.getElementById('poiRouteFilter');
    if (!select) return;
    
    const routes = [...new Set(POI_DATA.map(poi => poi.route))];
    
    select.innerHTML = '<option value="all">All Routes</option>' + 
        routes.map(route => {
            const routeData = allRoutes.find(r => r.busNumber === route);
            const routeName = routeData ? routeData.name : route;
            return `<option value="${route}">${routeName}</option>`;
        }).join('');
}

// ============================================
// POI FILTERING
// ============================================

function filterPOIsByCategory(category) {
    if (category === 'all') {
        filteredPOIs = [...allPOIs];
    } else {
        filteredPOIs = allPOIs.filter(poi => poi.category === category);
    }
    
    renderPOICards();
    updatePOIMarkers();
    updatePOIStats();
    
    showToast(`Showing ${filteredPOIs.length} ${category === 'all' ? 'attractions' : category} 🏔️`, 2000);
}

function filterPOIsByRoute(routeId) {
    if (routeId === 'all') {
        filteredPOIs = [...allPOIs];
    } else {
        filteredPOIs = allPOIs.filter(poi => poi.route === routeId);
    }
    
    renderPOICards();
    updatePOIMarkers();
    updatePOIStats();
}

// ============================================
// POI RENDERING
// ============================================

function renderPOICards() {
    const container = document.getElementById('poiCardsGrid');
    if (!container) return;
    
    if (filteredPOIs.length === 0) {
        container.innerHTML = `
            <div class="poi-empty-state">
                <div class="poi-empty-icon">🏔️</div>
                <div class="poi-empty-title">No attractions found</div>
                <div class="poi-empty-text">Try adjusting your filters to discover amazing places</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredPOIs.map(poi => {
        const isFavorite = favoritePOIs.includes(poi.id);
        const categoryIcons = {
            viewpoints: '🏔️',
            heritage: '🏛️',
            food: '🍽️',
            adventure: '🎿',
            nature: '🌲',
            photography: '📸',
            religious: '🕉️'
        };
        
        return `
            <div class="poi-card" onclick="showPOIDetails(${poi.id})">
                <div style="position: relative;">
                    <img src="${poi.image}" alt="${poi.name}" class="poi-card-image">
                    <div class="poi-category-badge">
                        ${categoryIcons[poi.category] || '📍'} ${poi.category}
                    </div>
                    <button class="poi-favorite-btn ${isFavorite ? 'favorited' : ''}" 
                            onclick="event.stopPropagation(); toggleFavoritePOI(${poi.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="poi-card-body">
                    <div class="poi-card-header">
                        <div class="poi-name">${poi.name}</div>
                        <div class="poi-rating">
                            <i class="fas fa-star"></i>
                            ${poi.rating}
                        </div>
                    </div>
                    <div class="poi-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${poi.location}
                    </div>
                    <div class="poi-description">
                        ${poi.description}
                    </div>
                    <div class="poi-meta">
                        <div class="poi-distance">
                            <i class="fas fa-route"></i>
                            ${poi.distance}
                        </div>
                        <div class="poi-actions">
                            <button class="poi-action-btn" title="View on Map" 
                                    onclick="event.stopPropagation(); showPOIOnMap(${poi.id})">
                                <i class="fas fa-map"></i>
                            </button>
                            <button class="poi-action-btn" title="Share" 
                                    onclick="event.stopPropagation(); sharePOI(${poi.id})">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderFeaturedHighlights() {
    const container = document.getElementById('featuredGrid');
    if (!container) return;
    
    const featured = allPOIs.filter(poi => poi.featured);
    
    container.innerHTML = featured.map(poi => `
        <div class="featured-card" onclick="showPOIDetails(${poi.id})">
            <img src="${poi.image}" alt="${poi.name}" style="width: 100%; height: 200px; object-fit: cover;">
            <div style="padding: 20px;">
                <h4 style="font-size: 1.2rem; color: #2C3E50; margin-bottom: 10px;">${poi.name}</h4>
                <p style="color: #6C757D; font-size: 0.9rem; line-height: 1.6;">
                    ${poi.description.substring(0, 100)}...
                </p>
                <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="color: #FFD700; font-weight: 600;">
                        <i class="fas fa-star"></i> ${poi.rating}
                    </div>
                    <div style="color: #F57F17; font-size: 0.85rem;">
                        ${poi.reviews} reviews
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// POI DETAILS MODAL
// ============================================

function showPOIDetails(poiId) {
    const poi = allPOIs.find(p => p.id === poiId);
    if (!poi) return;
    
    const modal = document.getElementById('poiModal');
    const modalBody = document.getElementById('poiModalBody');
    
    if (!modal || !modalBody) return;
    
    const isFavorite = favoritePOIs.includes(poi.id);
    
    modalBody.innerHTML = `
        <div class="poi-modal-hero">
            <img src="${poi.image}" alt="${poi.name}">
        </div>
        
        <div style="padding: 40px;">
            <h2 class="poi-modal-title">${poi.name}</h2>
            
            <div class="poi-modal-meta">
                <div class="poi-modal-meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${poi.location}</span>
                </div>
                <div class="poi-modal-meta-item">
                    <i class="fas fa-star"></i>
                    <span>${poi.rating} (${poi.reviews} reviews)</span>
                </div>
                <div class="poi-modal-meta-item">
                    <i class="fas fa-route"></i>
                    <span>${poi.distance}</span>
                </div>
                <div class="poi-modal-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${poi.duration}</span>
                </div>
                <div class="poi-modal-meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Best: ${poi.bestTime}</span>
                </div>
            </div>
            
            <div class="poi-modal-section">
                <h3 class="poi-modal-section-title">
                    <i class="fas fa-info-circle"></i>
                    About
                </h3>
                <p class="poi-modal-description">${poi.description}</p>
            </div>
            
            <div class="poi-modal-section">
                <h3 class="poi-modal-section-title">
                    <i class="fas fa-wheelchair"></i>
                    Accessibility
                </h3>
                <p class="poi-modal-description">${poi.accessibility}</p>
            </div>
            
            <div class="poi-modal-section">
                <h3 class="poi-modal-section-title">
                    <i class="fas fa-lightbulb"></i>
                    Local Tips
                </h3>
                <div class="poi-tips-list">
                    ${poi.tips.map(tip => `
                        <div class="poi-tip-item">
                            <strong>${tip.title}</strong>
                            ${tip.text}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="poi-modal-section">
                <h3 class="poi-modal-section-title">
                    <i class="fas fa-images"></i>
                    Photo Gallery
                </h3>
                <div class="poi-photo-gallery">
                    ${poi.gallery.map(img => `
                        <img src="${img}" alt="${poi.name}" class="poi-gallery-image">
                    `).join('')}
                </div>
            </div>
            
            <div class="poi-modal-actions">
                <button class="poi-modal-btn poi-modal-btn-primary" onclick="planDetour(${poi.id})">
                    <i class="fas fa-route"></i>
                    Plan Detour
                </button>
                <button class="poi-modal-btn poi-modal-btn-secondary" onclick="toggleFavoritePOI(${poi.id})">
                    <i class="fas fa-heart ${isFavorite ? '' : '-o'}"></i>
                    ${isFavorite ? 'Saved' : 'Save to Favorites'}
                </button>
                <button class="poi-modal-btn poi-modal-btn-secondary" onclick="sharePOI(${poi.id})">
                    <i class="fas fa-share-alt"></i>
                    Share
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closePOIModal() {
    const modal = document.getElementById('poiModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================
// POI MAP
// ============================================

function initializePOIMap() {
    const mapElement = document.getElementById('poiMap');
    if (!mapElement || poiMap) return; // Already initialized
    
    poiMap = L.map('poiMap', {
        center: MAP_CENTER,
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(poiMap);
    
    // Add route lines (lighter)
    allRoutes.forEach(route => {
        L.polyline(route.coordinates, {
            color: route.color,
            weight: 3,
            opacity: 0.3,
            smoothFactor: 1
        }).addTo(poiMap);
    });
    
    // Add POI markers
    updatePOIMarkers();
}

function updatePOIMarkers() {
    if (!poiMap) return;
    
    // Clear existing markers
    poiMarkers.forEach(marker => poiMap.removeLayer(marker));
    poiMarkers = [];
    
    // Add markers for filtered POIs
    filteredPOIs.forEach(poi => {
        const categoryIcons = {
            viewpoints: '🏔️',
            heritage: '🏛️',
            food: '🍽️',
            adventure: '🎿',
            nature: '🌲',
            photography: '📸',
            religious: '🕉️'
        };
        
        const icon = categoryIcons[poi.category] || '📍';
        
        const marker = L.marker(poi.coordinates, {
            icon: L.divIcon({
                html: `<div style="font-size: 2rem;">${icon}</div>`,
                className: 'poi-marker',
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            })
        }).addTo(poiMap);
        
        marker.bindPopup(`
            <div class="marker-popup" style="min-width: 200px;">
                <div class="marker-popup-title">${poi.name}</div>
                <div class="marker-popup-details">
                    <strong>${poi.location}</strong><br>
                    ⭐ ${poi.rating} (${poi.reviews} reviews)<br>
                    ${poi.distance}
                </div>
                <button onclick="showPOIDetails(${poi.id})" 
                        style="margin-top: 10px; padding: 8px 16px; background: linear-gradient(135deg, #FFD700, #FF8C00); 
                               border: none; color: white; border-radius: 15px; cursor: pointer; font-weight: 600;">
                    View Details
                </button>
            </div>
        `);
        
        marker.on('click', function() {
            poiMap.setView(poi.coordinates, 14);
        });
        
        poiMarkers.push(marker);
    });
    
    // Fit bounds to show all POIs
    if (poiMarkers.length > 0) {
        const group = L.featureGroup(poiMarkers);
        poiMap.fitBounds(group.getBounds().pad(0.1));
    }
}

function showPOIOnMap(poiId) {
    const poi = allPOIs.find(p => p.id === poiId);
    if (!poi || !poiMap) return;
    
    // Switch to map view
    const mapSection = document.querySelector('.poi-map-section');
    if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Center map on POI
    poiMap.setView(poi.coordinates, 15);
    
    // Open popup
    const marker = poiMarkers.find(m => 
        m.getLatLng().lat === poi.coordinates[0] && 
        m.getLatLng().lng === poi.coordinates[1]
    );
    
    if (marker) {
        marker.openPopup();
    }
    
    showToast(`Showing ${poi.name} on map 🗺️`, 2000);
}

// ============================================
// POI FAVORITES
// ============================================

function loadFavoritePOIs() {
    const stored = localStorage.getItem('happytrails_favorite_pois');
    if (stored) {
        try {
            favoritePOIs = JSON.parse(stored);
        } catch (e) {
            favoritePOIs = [];
        }
    }
}

function saveFavoritePOIs() {
    localStorage.setItem('happytrails_favorite_pois', JSON.stringify(favoritePOIs));
}

function toggleFavoritePOI(poiId) {
    const index = favoritePOIs.indexOf(poiId);
    
    if (index > -1) {
        favoritePOIs.splice(index, 1);
        showToast('Removed from favorites 💔', 2000);
    } else {
        favoritePOIs.push(poiId);
        showToast('Added to favorites! ❤️', 2000);
    }
    
    saveFavoritePOIs();
    
    // Re-render if modal is open
    const modal = document.getElementById('poiModal');
    if (modal && modal.style.display === 'flex') {
        showPOIDetails(poiId);
    }
    
    // Re-render cards
    renderPOICards();
}

// ============================================
// POI ACTIONS
// ============================================

function planDetour(poiId) {
    const poi = allPOIs.find(p => p.id === poiId);
    if (!poi) return;
    
    showToast(`Planning detour to ${poi.name}... 🗺️`, 2000);
    
    setTimeout(() => {
        const detourInfo = `
            <div style="background: rgba(255, 249, 230, 0.95); padding: 20px; border-radius: 15px; 
                        border: 2px solid #FFD700; margin: 20px; box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);">
                <h3 style="color: #F57F17; margin-bottom: 15px;">
                    <i class="fas fa-route"></i> Detour Plan
                </h3>
                <p style="color: #2C3E50; line-height: 1.7;">
                    <strong>Attraction:</strong> ${poi.name}<br>
                    <strong>Distance from route:</strong> ${poi.distance}<br>
                    <strong>Estimated detour time:</strong> ${poi.duration}<br>
                    <strong>Best route:</strong> Take ${poi.route}, ask driver for stop<br>
                    <br>
                    <em>Tip: Inform the driver in advance for a smooth detour!</em>
                </p>
            </div>
        `;
        
        // You could show this in a modal or notification
        console.log('Detour planned:', detourInfo);
        showToast('Detour calculated! Check details. ✅', 3000);
    }, 1000);
}

function sharePOI(poiId) {
    const poi = allPOIs.find(p => p.id === poiId);
    if (!poi) return;
    
    const shareText = `Check out ${poi.name} in ${poi.location}! ⭐ ${poi.rating} rating. ${poi.description.substring(0, 100)}...`;
    const shareUrl = window.location.origin + '/route-explorer?poi=' + poi.id;
    
    if (navigator.share) {
        navigator.share({
            title: poi.name,
            text: shareText,
            url: shareUrl
        }).catch(() => {
            copyToClipboard(shareUrl);
        });
    } else {
        copyToClipboard(shareUrl);
    }
    
    showToast('Share link copied! 📋', 2000);
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// ============================================
// POI STATISTICS
// ============================================

function updatePOIStats() {
    const totalEl = document.getElementById('totalPOIsCount');
    const photoEl = document.getElementById('photoSpotsCount');
    const heritageEl = document.getElementById('heritageCount');
    const foodEl = document.getElementById('foodSpotsCount');
    
    if (totalEl) totalEl.textContent = filteredPOIs.length;
    if (photoEl) photoEl.textContent = allPOIs.filter(p => p.category === 'photography').length;
    if (heritageEl) heritageEl.textContent = allPOIs.filter(p => p.category === 'heritage').length;
    if (foodEl) foodEl.textContent = allPOIs.filter(p => p.category === 'food').length;
}

// ============================================
// UPDATE INITIALIZATION
// ============================================

// Update the main initialization
const originalInitRouteExplorer3 = initializeRouteExplorer;
initializeRouteExplorer = function() {
    originalInitRouteExplorer3();
    initializePOI();
};

// Make functions globally accessible
window.showPOIDetails = showPOIDetails;
window.closePOIModal = closePOIModal;
window.toggleFavoritePOI = toggleFavoritePOI;
window.showPOIOnMap = showPOIOnMap;
window.sharePOI = sharePOI;
window.planDetour = planDetour;

console.log('🏔️ Phase 4: Scenic Highlights & POI loaded successfully! 💖');

/* ============================================
   ⭐ PHASE 5: KAVLIN'S FAVORITES & ADVANCED
   Personal Recommendations & Advanced Features
   ============================================ */

// Global Phase 5 variables
let userCollections = [];
let routeHistory = [];
let userPreferences = {};
let currentMood = null;
let currentSeason = 'spring';

// Kavlin's curated route data with moods
const KAVLINS_FAVORITES = {
    romantic: [
        {
            id: 1,
            busNumber: 'HT-101',
            mood: 'romantic',
            season: 'spring',
            kavlinNote: 'This sunrise route is where I proposed to my wife. The morning light through pine trees creates pure magic. Book the front seats for the best view!',
            reason: 'Perfect for couples seeking a romantic mountain escape',
            bestTime: 'Early morning (6-8 AM)',
            specialTip: 'Ask the driver to pause at the valley viewpoint - it\'s not an official stop but they always oblige for couples!'
        }
    ],
    adventure: [
        {
            id: 8,
            busNumber: 'HT-108',
            mood: 'adventure',
            season: 'summer',
            kavlinNote: 'The most thrilling route in our network! The mountain passes and sharp curves will get your adrenaline pumping. Our best drivers handle this route.',
            reason: 'For those who love excitement and mountain adventures',
            bestTime: 'Late morning (10 AM - 12 PM)',
            specialTip: 'Combine this with a paragliding session at Barog for the ultimate adventure day!'
        }
    ],
    family: [
        {
            id: 5,
            busNumber: 'HT-105',
            mood: 'family',
            season: 'autumn',
            kavlinNote: 'My parents\' favorite! Smooth roads, comfortable seats, and plenty of interesting stops for kids. The driver keeps snacks for children!',
            reason: 'Safe, comfortable, and entertaining for all ages',
            bestTime: 'Mid-morning (9-11 AM)',
            specialTip: 'Sit on the left side - kids love spotting mountain goats on that side!'
        }
    ],
    solo: [
        {
            id: 3,
            busNumber: 'HT-103',
            mood: 'solo',
            season: 'winter',
            kavlinNote: 'This is my "thinking route". Perfect for solo travelers seeking introspection. The heritage sites along the way add depth to the journey.',
            reason: 'Peaceful route ideal for self-discovery and reflection',
            bestTime: 'Afternoon (2-4 PM)',
            specialTip: 'Carry a journal - something about this route inspires writing!'
        }
    ],
    photographer: [
        {
            id: 1,
            busNumber: 'HT-101',
            mood: 'photographer',
            season: 'autumn',
            kavlinNote: 'Photographers call this the "golden route". Every turn offers a postcard-perfect shot. I\'ve seen professionals book this route repeatedly!',
            reason: 'Stunning vistas and perfect lighting throughout',
            bestTime: 'Golden hour (5-7 PM)',
            specialTip: 'Bring a polarizing filter for the valley shots and a wide-angle lens!'
        }
    ],
    peaceful: [
        {
            id: 4,
            busNumber: 'HT-104',
            mood: 'peaceful',
            season: 'monsoon',
            kavlinNote: 'When I need to disconnect and recharge, this is my go-to. The sound of rain on the bus, misty mountains, and almost meditative journey.',
            reason: 'Ultimate relaxation and stress relief',
            bestTime: 'Early afternoon (1-3 PM)',
            specialTip: 'Download some soft music or meditation tracks - perfect soundtrack!'
        }
    ]
};

// Seasonal route recommendations
const SEASONAL_ROUTES = {
    spring: {
        title: '🌸 Spring Blossoms',
        description: 'When the mountains wake up in colors',
        routes: [
            {
                id: 1,
                busNumber: 'HT-101',
                name: 'Dharampur → Solan Express',
                image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
                reason: 'Rhododendron blooms along the entire route create a pink paradise. The air smells of fresh flowers and pine.',
                kavlinTip: 'March to April is peak bloom time. Carry a camera with good macro lens!'
            },
            {
                id: 6,
                busNumber: 'HT-106',
                name: 'Dharampur → Solan Premium',
                image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800',
                reason: 'Premium comfort meets spring beauty. Larger windows give you the best view of blooming valleys.',
                kavlinTip: 'Worth the extra price in spring - the view is unobstructed!'
            }
        ]
    },
    summer: {
        title: '☀️ Summer Adventures',
        description: 'Clear skies and endless possibilities',
        routes: [
            {
                id: 2,
                busNumber: 'HT-102',
                name: 'Solan → Barog Scenic',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                reason: 'Perfect summer weather with cool mountain breeze. The tunnel approach is refreshingly cool!',
                kavlinTip: 'Pack light clothes but bring a light jacket - temperature drops near Barog.'
            }
        ]
    },
    monsoon: {
        title: '🌧️ Monsoon Magic',
        description: 'When mountains wear mist like poetry',
        routes: [
            {
                id: 4,
                busNumber: 'HT-104',
                name: 'Dagshai → Dharampur Circle',
                image: 'https://images.unsplash.com/photo-1433863448220-78aaa064ff47?w=800',
                reason: 'Monsoon transforms this route into a mystical journey through clouds. Rain on roof, mist everywhere.',
                kavlinTip: 'Most romantic in light drizzle. Heavy rain may cause delays - check forecast!'
            }
        ]
    },
    autumn: {
        title: '🍂 Autumn Gold',
        description: 'Nature\'s finest color palette',
        routes: [
            {
                id: 5,
                busNumber: 'HT-105',
                name: 'Dharampur → Solan Deluxe',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
                reason: 'Golden leaves create a carpet along the road. The most photographed route in autumn!',
                kavlinTip: 'October-November is peak foliage. Book window seats weeks in advance!'
            }
        ]
    },
    winter: {
        title: '❄️ Winter Wonderland',
        description: 'Snow-kissed serenity',
        routes: [
            {
                id: 3,
                busNumber: 'HT-103',
                name: 'Barog → Dagshai Heritage',
                image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800',
                reason: 'Colonial architecture looks stunning with snow. Hot chai at Dagshai cantonment is legendary!',
                kavlinTip: 'Carry warm clothes and hand warmers. Roads are well-maintained even in snow.'
            }
        ]
    }
};

// ============================================
// KAVLIN'S FAVORITES TAB INITIALIZATION
// ============================================

function initializeKavlinsFavorites() {
    const favoritesTab = document.querySelector('[data-tab="kavlins-favorites"]');
    if (favoritesTab) {
        favoritesTab.addEventListener('click', loadKavlinsFavoritesTab);
    }
    
    // Load user data
    loadUserCollections();
    loadRouteHistory();
    loadUserPreferences();
    
    console.log('⭐ Kavlin\'s Favorites initialized');
}

function loadKavlinsFavoritesTab() {
    // Render seasonal routes (default: spring)
    showSeasonRoutes('spring');
    
    // Render top picks
    renderTopPicks();
    
    // Render collections
    renderCollections();
    
    // Render history
    renderRouteHistory();
    
    // Setup advanced search listeners
    setupAdvancedSearchListeners();
}

// ============================================
// TRAVEL MOOD FILTERING
// ============================================

function filterByMood(mood) {
    currentMood = mood;
    
    // Update UI
    document.querySelectorAll('.mood-pill').forEach(pill => {
        pill.classList.remove('active');
        if (pill.getAttribute('data-mood') === mood) {
            pill.classList.add('active');
        }
    });
    
    // Get routes for this mood
    const moodRoutes = KAVLINS_FAVORITES[mood] || [];
    
    // Display mood-specific routes
    displayMoodRoutes(mood, moodRoutes);
    
    // Scroll to results
    setTimeout(() => {
        document.getElementById('topPicksGrid').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 300);
    
    showToast(`Showing routes perfect for ${mood} travelers! 💖`, 2000);
}

function displayMoodRoutes(mood, moodRoutes) {
    const container = document.getElementById('topPicksGrid');
    if (!container) return;
    
    const moodIcons = {
        romantic: '💑',
        adventure: '🏔️',
        family: '👨‍👩‍👧‍👦',
        solo: '🎒',
        photographer: '📸',
        peaceful: '🧘'
    };
    
    const moodLabels = {
        romantic: 'Romantic Escape',
        adventure: 'Adventure Seeker',
        family: 'Family Friendly',
        solo: 'Solo Explorer',
        photographer: 'Photographer\'s Dream',
        peaceful: 'Peaceful Retreat'
    };
    
    // Get full route data
    const routeCards = moodRoutes.map(fav => {
        const route = allRoutes.find(r => r.id === fav.id);
        if (!route) return '';
        
        return `
            <div class="top-pick-card">
                <div class="top-pick-badge">
                    ${moodIcons[mood]} ${moodLabels[mood]}
                </div>
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" 
                     alt="${route.name}" 
                     class="top-pick-image">
                <div class="top-pick-body">
                    <div class="top-pick-name">${route.name}</div>
                    <div class="top-pick-kavlin-note">
                        ${fav.kavlinNote}
                    </div>
                    <div class="top-pick-meta">
                        <div class="top-pick-meta-item">
                            <i class="fas fa-bus"></i>
                            <span>${route.busNumber}</span>
                        </div>
                        <div class="top-pick-meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${fav.bestTime}</span>
                        </div>
                        <div class="top-pick-meta-item">
                            <i class="fas fa-star"></i>
                            <span>${route.type}</span>
                        </div>
                    </div>
                    <div style="margin-top: 15px; padding: 12px; background: rgba(255, 249, 230, 0.5); 
                                border-radius: 10px; font-size: 0.9rem; color: #F57F17;">
                        <strong>💡 Kavlin's Special Tip:</strong> ${fav.specialTip}
                    </div>
                    <button class="poi-modal-btn poi-modal-btn-primary" 
                            onclick="showRouteDetails(${route.id})" 
                            style="width: 100%; margin-top: 15px;">
                        <i class="fas fa-info-circle"></i>
                        View Full Details
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = routeCards || `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: #6C757D;">
            <i class="fas fa-heart" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5; display: block;"></i>
            <p style="font-size: 1.1rem;">No routes available for this mood yet!</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">Try selecting a different mood or explore all routes.</p>
        </div>
    `;
}

// ============================================
// SEASONAL ROUTES
// ============================================

function showSeasonRoutes(season) {
    currentSeason = season;
    
    // Update tabs
    document.querySelectorAll('.seasonal-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-season') === season) {
            tab.classList.add('active');
        }
    });
    
    const seasonData = SEASONAL_ROUTES[season];
    if (!seasonData) return;
    
    const container = document.getElementById('seasonalContent');
    if (!container) return;
    
    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h4 style="font-size: 1.8rem; color: #F57F17; font-family: 'Caveat', cursive;">
                ${seasonData.title}
            </h4>
            <p style="color: #6C757D; font-size: 1.1rem;">
                ${seasonData.description}
            </p>
        </div>
        ${seasonData.routes.map(route => `
            <div class="seasonal-route-card">
                <img src="${route.image}" alt="${route.name}" class="seasonal-route-image">
                <div class="seasonal-route-info">
                    <h4>${route.name}</h4>
                    <div style="color: #6C757D; margin-bottom: 15px;">
                        <i class="fas fa-bus"></i> ${route.busNumber}
                    </div>
                    <div class="seasonal-route-reason">
                        <strong>Why This Season?</strong>
                        ${route.reason}
                    </div>
                    <div style="background: rgba(255, 215, 0, 0.2); padding: 12px; border-radius: 10px; 
                                border-left: 4px solid #FFD700; margin-top: 10px;">
                        <strong style="color: #F57F17;">💡 Kavlin's Tip:</strong>
                        <div style="color: #2C3E50; margin-top: 5px;">${route.kavlinTip}</div>
                    </div>
                </div>
                <div class="seasonal-route-actions">
                    <button class="poi-modal-btn poi-modal-btn-primary" onclick="showRouteDetails(${route.id})">
                        <i class="fas fa-info-circle"></i>
                        Details
                    </button>
                    <button class="poi-modal-btn poi-modal-btn-secondary" onclick="bookRoute(${route.id})">
                        <i class="fas fa-ticket-alt"></i>
                        Book Now
                    </button>
                </div>
            </div>
        `).join('')}
    `;
}

// ============================================
// TOP PICKS RENDERING
// ============================================

function renderTopPicks() {
    const container = document.getElementById('topPicksGrid');
    if (!container) return;
    
    // Get Kavlin's absolute favorites (one from each mood)
    const topPicks = [
        KAVLINS_FAVORITES.romantic[0],
        KAVLINS_FAVORITES.adventure[0],
        KAVLINS_FAVORITES.family[0]
    ].filter(Boolean);
    
    const moodIcons = {
        romantic: '💑',
        adventure: '🏔️',
        family: '👨‍👩‍👧‍👦',
        solo: '🎒',
        photographer: '📸',
        peaceful: '🧘'
    };
    
    container.innerHTML = topPicks.map(fav => {
        const route = allRoutes.find(r => r.id === fav.id);
        if (!route) return '';
        
        return `
            <div class="top-pick-card">
                <div class="top-pick-badge">
                    <i class="fas fa-crown"></i>
                    Kavlin's Pick
                </div>
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" 
                     alt="${route.name}" 
                     class="top-pick-image">
                <div class="top-pick-body">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <span style="font-size: 2rem;">${moodIcons[fav.mood]}</span>
                        <div class="top-pick-name">${route.name}</div>
                    </div>
                    <div class="top-pick-kavlin-note">
                        ${fav.kavlinNote}
                    </div>
                    <div class="top-pick-meta">
                        <div class="top-pick-meta-item">
                            <i class="fas fa-bus"></i>
                            <span>${route.busNumber}</span>
                        </div>
                        <div class="top-pick-meta-item">
                            <i class="fas fa-route"></i>
                            <span>${route.distance}</span>
                        </div>
                        <div class="top-pick-meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${route.duration}</span>
                        </div>
                        <div class="top-pick-meta-item">
                            <i class="fas fa-rupee-sign"></i>
                            <span>₹${route.price || 150}</span>
                        </div>
                    </div>
                    <button class="poi-modal-btn poi-modal-btn-primary" 
                            onclick="showRouteDetails(${route.id})" 
                            style="width: 100%; margin-top: 15px;">
                        <i class="fas fa-heart"></i>
                        Explore This Route
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// ADVANCED SEARCH
// ============================================

function setupAdvancedSearchListeners() {
    // Price range sliders
    const minSlider = document.getElementById('priceRangeMin');
    const maxSlider = document.getElementById('priceRangeMax');
    const minLabel = document.getElementById('priceMinLabel');
    const maxLabel = document.getElementById('priceMaxLabel');
    
    if (minSlider && maxSlider) {
        minSlider.addEventListener('input', function() {
            if (parseInt(this.value) >= parseInt(maxSlider.value)) {
                this.value = parseInt(maxSlider.value) - 10;
            }
            minLabel.textContent = `₹${this.value}`;
        });
        
        maxSlider.addEventListener('input', function() {
            if (parseInt(this.value) <= parseInt(minSlider.value)) {
                this.value = parseInt(minSlider.value) + 10;
            }
            maxLabel.textContent = `₹${this.value}`;
        });
    }
}

function performAdvancedSearch() {
    const minPrice = parseInt(document.getElementById('priceRangeMin').value);
    const maxPrice = parseInt(document.getElementById('priceRangeMax').value);
    const maxDuration = document.getElementById('durationFilter').value;
    const timePreference = document.getElementById('timeFilter').value;
    
    // Get selected amenities
    const amenities = Array.from(document.querySelectorAll('.amenity-checkbox input:checked'))
        .map(cb => cb.value);
    
    // Filter routes
    let results = allRoutes.filter(route => {
        const price = route.price || 150;
        const duration = parseDuration(route.duration);
        
        // Price check
        if (price < minPrice || price > maxPrice) return false;
        
        // Duration check
        if (maxDuration !== 'all' && duration > parseInt(maxDuration)) return false;
        
        // Time preference check
        if (timePreference !== 'all') {
            const depTime = parseTimeToMinutes(route.departure_time || '08:00 AM');
            if (timePreference === 'morning' && (depTime < 360 || depTime >= 720)) return false;
            if (timePreference === 'afternoon' && (depTime < 720 || depTime >= 1080)) return false;
            if (timePreference === 'evening' && (depTime < 1080 || depTime >= 1320)) return false;
        }
        
        // Amenities check (simplified - check bus type)
        if (amenities.length > 0) {
            if (amenities.includes('wifi') && route.type === 'Standard') return false;
            if (amenities.includes('meals') && route.type !== 'Premium') return false;
        }
        
        return true;
    });
    
    // Display results
    displayAdvancedSearchResults(results);
    
    showToast(`Found ${results.length} routes matching your criteria! 🔍`, 2000);
}

function displayAdvancedSearchResults(results) {
    const container = document.getElementById('advancedSearchResults');
    if (!container) return;
    
    if (results.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px; background: rgba(255, 249, 230, 0.5); 
                        border-radius: 20px; border: 2px dashed rgba(255, 215, 0, 0.3);">
                <i class="fas fa-search" style="font-size: 3rem; color: #FFD700; margin-bottom: 15px; display: block;"></i>
                <h4 style="color: #2C3E50; margin-bottom: 10px;">No routes found</h4>
                <p style="color: #6C757D;">Try adjusting your search criteria to find more routes.</p>
            </div>
        `;
        container.style.display = 'block';
        return;
    }
    
    container.innerHTML = `
        <div style="margin-bottom: 20px; padding: 15px; background: rgba(50, 205, 50, 0.1); 
                    border-radius: 15px; border: 2px solid rgba(50, 205, 50, 0.3);">
            <h4 style="color: #228B22; margin-bottom: 5px;">
                <i class="fas fa-check-circle"></i>
                Found ${results.length} Route${results.length !== 1 ? 's' : ''}
            </h4>
            <p style="color: #6C757D; font-size: 0.9rem;">
                These routes match your search criteria perfectly!
            </p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
            ${results.map(route => `
                <div class="route-card" onclick="showRouteDetails(${route.id})" 
                     style="--route-color: ${route.color}; cursor: pointer;">
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
                            <i class="fas fa-rupee-sign"></i>
                            <span>₹${route.price || 150}</span>
                        </div>
                        <div class="route-stat">
                            <i class="fas fa-clock"></i>
                            <span>${route.duration}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetAdvancedSearch() {
    document.getElementById('priceRangeMin').value = 0;
    document.getElementById('priceRangeMax').value = 200;
    document.getElementById('priceMinLabel').textContent = '₹0';
    document.getElementById('priceMaxLabel').textContent = '₹200';
    document.getElementById('durationFilter').value = 'all';
    document.getElementById('timeFilter').value = 'all';
    
    document.querySelectorAll('.amenity-checkbox input').forEach(cb => {
        cb.checked = false;
    });
    
    const resultsContainer = document.getElementById('advancedSearchResults');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
    
    showToast('Search filters reset! 🔄', 2000);
}

function parseTimeToMinutes(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
}

// ============================================
// ROUTE COLLECTIONS
// ============================================

function loadUserCollections() {
    const stored = localStorage.getItem('happytrails_collections');
    if (stored) {
        try {
            userCollections = JSON.parse(stored);
        } catch (e) {
            userCollections = [];
        }
    }
}

function saveUserCollections() {
    localStorage.setItem('happytrails_collections', JSON.stringify(userCollections));
}

function renderCollections() {
    const container = document.getElementById('collectionsGrid');
    if (!container) return;
    
    if (userCollections.length === 0) {
        container.innerHTML = `
            <div class="collections-empty" style="grid-column: 1 / -1;">
                <div class="collections-empty-icon">📁</div>
                <div class="collections-empty-text">
                    <p style="font-size: 1.2rem; margin-bottom: 10px;">No collections yet!</p>
                    <p>Create your first collection to organize your favorite routes.</p>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = userCollections.map(collection => `
        <div class="collection-card" onclick="viewCollection(${collection.id})">
            <div class="collection-header">
                <div class="collection-icon">📁</div>
                <div class="collection-privacy">
                    <i class="fas fa-${collection.privacy === 'public' ? 'globe' : 'lock'}"></i>
                    ${collection.privacy}
                </div>
            </div>
            <div class="collection-name">${collection.name}</div>
            <div class="collection-description">${collection.description}</div>
            <div class="collection-stats">
                <div class="collection-stat">
                    <i class="fas fa-route"></i>
                    <span>${collection.routes.length} routes</span>
                </div>
                <div class="collection-stat">
                    <i class="fas fa-calendar"></i>
                    <span>${new Date(collection.created).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function showCreateCollectionModal() {
    const modal = document.getElementById('collectionModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Clear form
        document.getElementById('collectionName').value = '';
        document.getElementById('collectionDescription').value = '';
        document.getElementById('collectionPrivacy').value = 'private';
    }
}

function closeCollectionModal() {
    const modal = document.getElementById('collectionModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function createCollection() {
    const name = document.getElementById('collectionName').value.trim();
    const description = document.getElementById('collectionDescription').value.trim();
    const privacy = document.getElementById('collectionPrivacy').value;
    
    if (!name) {
        showToast('⚠️ Please enter a collection name!', 3000);
        return;
    }
    
    const newCollection = {
        id: Date.now(),
        name: name,
        description: description || 'No description',
        privacy: privacy,
        routes: [],
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    };
    
    userCollections.push(newCollection);
    saveUserCollections();
    renderCollections();
    closeCollectionModal();
    
    showToast(`Collection "${name}" created! 📁`, 2000);
}

function viewCollection(collectionId) {
    const collection = userCollections.find(c => c.id === collectionId);
    if (!collection) return;
    
    showToast(`Opening "${collection.name}"... 📁`, 2000);
    // Could expand to show collection details in a modal
}

// ============================================
// ROUTE HISTORY
// ============================================

function loadRouteHistory() {
    const stored = localStorage.getItem('happytrails_route_history');
    if (stored) {
        try {
            routeHistory = JSON.parse(stored);
        } catch (e) {
            routeHistory = [];
        }
    }
}

function saveRouteHistory() {
    // Keep only last 20 items
    if (routeHistory.length > 20) {
        routeHistory = routeHistory.slice(0, 20);
    }
    localStorage.setItem('happytrails_route_history', JSON.stringify(routeHistory));
}

function addToHistory(routeId, action) {
    const route = allRoutes.find(r => r.id === routeId);
    if (!route) return;
    
    const historyItem = {
        routeId: routeId,
        routeName: route.name,
        busNumber: route.busNumber,
        action: action,
        timestamp: new Date().toISOString()
    };
    
    // Add to beginning of array
    routeHistory.unshift(historyItem);
    saveRouteHistory();
}

function renderRouteHistory() {
    const container = document.getElementById('historyTimeline');
    if (!container) return;
    
    if (routeHistory.length === 0) {
        container.innerHTML = `
            <div class="history-empty">
                <i class="fas fa-history" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5; display: block;"></i>
                <p style="font-size: 1.1rem;">No route history yet!</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Start exploring routes to build your travel history.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = routeHistory.map(item => {
        const timeAgo = getTimeAgo(new Date(item.timestamp));
        const actionIcons = {
            'viewed': 'fa-eye',
            'booked': 'fa-ticket-alt',
            'compared': 'fa-balance-scale',
            'favorited': 'fa-heart'
        };
        
        return `
            <div class="history-item" onclick="showRouteDetails(${item.routeId})">
                <div class="history-time">
                    <i class="fas fa-clock"></i>
                    ${timeAgo}
                </div>
                <div class="history-route-name">${item.routeName}</div>
                <div class="history-action">
                    <i class="fas ${actionIcons[item.action] || 'fa-info-circle'}"></i>
                    ${item.action.charAt(0).toUpperCase() + item.action.slice(1)} • ${item.busNumber}
                </div>
            </div>
        `;
    }).join('');
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return 'Just now';
}

// ============================================
// USER PREFERENCES
// ============================================

function loadUserPreferences() {
    const stored = localStorage.getItem('happytrails_preferences');
    if (stored) {
        try {
            userPreferences = JSON.parse(stored);
        } catch (e) {
            userPreferences = {};
        }
    }
}

function saveUserPreferences() {
    localStorage.setItem('happytrails_preferences', JSON.stringify(userPreferences));
}

// ============================================
// OVERRIDE ROUTE DETAILS TO TRACK HISTORY
// ============================================

const originalShowRouteDetails = showRouteDetails;
showRouteDetails = function(routeId) {
    // Track in history
    addToHistory(routeId, 'viewed');
    
    // Call original function
    originalShowRouteDetails(routeId);
};

// ============================================
// UPDATE INITIALIZATION
// ============================================

// Update the main initialization
const originalInitRouteExplorer4 = initializeRouteExplorer;
initializeRouteExplorer = function() {
    originalInitRouteExplorer4();
    initializeKavlinsFavorites();
};

// Make functions globally accessible
window.filterByMood = filterByMood;
window.showSeasonRoutes = showSeasonRoutes;
window.performAdvancedSearch = performAdvancedSearch;
window.resetAdvancedSearch = resetAdvancedSearch;
window.showCreateCollectionModal = showCreateCollectionModal;
window.closeCollectionModal = closeCollectionModal;
window.createCollection = createCollection;
window.viewCollection = viewCollection;

console.log('⭐ Phase 5: Kavlin\'s Favorites & Advanced Features loaded successfully! 💖');