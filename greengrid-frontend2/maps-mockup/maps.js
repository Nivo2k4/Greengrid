// Map configurations
const mapConfigs = {
    mainMap: {
        center: [28.6139, 77.2090], // New Delhi
        zoom: 12,
        markers: [
            { lat: 28.6139, lng: 77.2090, popup: "🏢 GreenGrid HQ<br>Main Office Location" },
            { lat: 28.6329, lng: 77.2197, popup: "📊 Data Center<br>Environmental Monitoring" },
            { lat: 28.5935, lng: 77.2074, popup: "🌱 Green Zone<br>Air Quality Station" }
        ]
    },
    monitoringMap: {
        center: [19.0760, 72.8777], // Mumbai
        zoom: 11,
        markers: [
            { lat: 19.0760, lng: 72.8777, popup: "🌡️ Temperature Station<br>Marine Drive" },
            { lat: 19.0544, lng: 72.8324, popup: "💨 Air Quality Monitor<br>Bandra West" },
            { lat: 19.1136, lng: 72.8697, popup: "🌊 Water Quality Sensor<br>Juhu Beach" },
            { lat: 19.0330, lng: 72.8569, popup: "📈 Pollution Monitor<br>Worli" },
            { lat: 19.0970, lng: 72.8570, popup: "🔋 Solar Panel Station<br>Andheri" }
        ]
    },
    regionalMap: {
        center: [20.5937, 78.9629], // Center of India
        zoom: 5,
        markers: [
            { lat: 28.6139, lng: 77.2090, popup: "🏙️ Delhi Region<br>15 Active Stations" },
            { lat: 19.0760, lng: 72.8777, popup: "🌊 Mumbai Region<br>22 Active Stations" },
            { lat: 13.0827, lng: 80.2707, popup: "🏖️ Chennai Region<br>18 Active Stations" },
            { lat: 12.9716, lng: 77.5946, popup: "🌳 Bangalore Region<br>20 Active Stations" },
            { lat: 22.5726, lng: 88.3639, popup: "🏭 Kolkata Region<br>12 Active Stations" }
        ]
    }
};

// Custom marker icons
const customIcons = {
    green: L.divIcon({
        className: 'custom-div-icon',
        html: '<div style="background-color:#4caf50;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
    }),
    blue: L.divIcon({
        className: 'custom-div-icon',
        html: '<div style="background-color:#2196F3;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
    }),
    red: L.divIcon({
        className: 'custom-div-icon',
        html: '<div style="background-color:#f44336;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
    })
};

// Initialize maps function
function initializeMaps() {
    // Main Map
    const mainMap = L.map('main-map').setView(mapConfigs.mainMap.center, mapConfigs.mainMap.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mainMap);
    
    mapConfigs.mainMap.markers.forEach((marker, index) => {
        L.marker([marker.lat, marker.lng], { icon: customIcons.green })
            .addTo(mainMap)
            .bindPopup(marker.popup);
    });
    
    // Monitoring Map
    const monitoringMap = L.map('monitoring-map').setView(mapConfigs.monitoringMap.center, mapConfigs.monitoringMap.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(monitoringMap);
    
    mapConfigs.monitoringMap.markers.forEach((marker, index) => {
        const iconColor = index % 2 === 0 ? customIcons.blue : customIcons.green;
        L.marker([marker.lat, marker.lng], { icon: iconColor })
            .addTo(monitoringMap)
            .bindPopup(marker.popup);
    });
    
    // Regional Map
    const regionalMap = L.map('regional-map').setView(mapConfigs.regionalMap.center, mapConfigs.regionalMap.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(regionalMap);
    
    mapConfigs.regionalMap.markers.forEach((marker, index) => {
        L.marker([marker.lat, marker.lng], { icon: customIcons.red })
            .addTo(regionalMap)
            .bindPopup(marker.popup);
    });
    
    // Add some interactivity
    addMapInteractions(mainMap, monitoringMap, regionalMap);
}

// Add interactive features
function addMapInteractions(mainMap, monitoringMap, regionalMap) {
    // Add click event to all maps
    [mainMap, monitoringMap, regionalMap].forEach(map => {
        map.on('click', function(e) {
            L.popup()
                .setLatLng(e.latlng)
                .setContent(`<b>Clicked Location</b><br>Lat: ${e.latlng.lat.toFixed(4)}<br>Lng: ${e.latlng.lng.toFixed(4)}`)
                .openOn(map);
        });
    });
    
    // Add some animated circles for visual effect
    setTimeout(() => {
        // Add animated circle to main map
        L.circle([28.6139, 77.2090], {
            color: '#4caf50',
            fillColor: '#4caf50',
            fillOpacity: 0.2,
            radius: 2000
        }).addTo(mainMap);
        
        // Add animated circles to monitoring map
        mapConfigs.monitoringMap.markers.forEach(marker => {
            L.circle([marker.lat, marker.lng], {
                color: '#2196F3',
                fillColor: '#2196F3',
                fillOpacity: 0.1,
                radius: 1500
            }).addTo(monitoringMap);
        });
    }, 1000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure proper rendering
    setTimeout(initializeMaps, 100);
});

// Add some real-time simulation
setInterval(() => {
    // This could be used for real-time updates
    console.log('Maps are live and running!');
}, 10000);