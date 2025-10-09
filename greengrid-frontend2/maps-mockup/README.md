# GreenGrid Maps Mockup

## Overview
Standalone HTML mockup pages with interactive Leaflet maps for the GreenGrid project. These are completely independent from the main React frontend and can be opened directly in a browser.

## Files Structure
```
maps-mockup/
├── index.html      # Main mockup page with 3 interactive maps
├── styles.css      # Modern glassmorphism styling
├── maps.js         # JavaScript for map functionality
└── README.md       # This file
```

## Features

### 🗺️ Three Interactive Maps:
1. **Primary Location Map** - Delhi region with HQ and data centers
2. **Environmental Monitoring Points** - Mumbai with various sensor stations
3. **Regional Overview** - Pan-India view with regional stations

### 🎨 Design Features:
- Modern glassmorphism design with gradient backgrounds
- Custom colored markers (Green, Blue, Red)
- Interactive popups with station information
- Click-to-show coordinates functionality
- Animated circles for visual enhancement
- Fully responsive design

### 🔧 Technologies Used:
- **Leaflet.js** - Interactive mapping library
- **OpenStreetMap** - Map tiles
- **Vanilla HTML/CSS/JS** - No frameworks, pure web technologies

## How to Use

### Option 1: Direct File Opening
1. Navigate to `greengrid-frontend2/maps-mockup/`
2. Open `index.html` directly in your web browser
3. Maps will load automatically

### Option 2: Local Server (Recommended)
```bash
# Navigate to the maps-mockup folder
cd greengrid-frontend2/maps-mockup

# Start a simple HTTP server (Python 3)
python -m http.server 8000

# Or with Node.js (if you have live-server installed)
npx live-server

# Then open http://localhost:8000 in your browser
```

## Interactive Features

### 📍 Markers & Popups
- Click on any marker to see station details
- Each marker shows specific environmental monitoring information
- Different colored markers represent different types of stations

### 🖱️ Click Interactions
- Click anywhere on the map to see coordinates
- Zoom and pan functionality built-in
- Responsive controls for mobile devices

## Customization

### Adding New Markers
Edit `maps.js` and add to the respective map config:
```javascript
{ lat: YOUR_LAT, lng: YOUR_LNG, popup: "YOUR_POPUP_TEXT" }
```

### Changing Map Centers
Modify the `center` arrays in `mapConfigs` object in `maps.js`

### Styling
All visual customization can be done in `styles.css`

## Browser Compatibility
- Chrome/Chromium (Recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance
- Lightweight - No heavy frameworks
- Fast loading with CDN resources
- Optimized for mobile devices
- Minimal JavaScript for smooth performance

## Future Enhancements
- Real-time data integration
- Weather overlays
- Heatmap functionality
- Clustering for multiple markers
- Custom tile layers
- Data export functionality

---

**Note:** This is a standalone mockup and doesn't integrate with the main React application. It's designed to be completely independent for testing and demonstration purposes.