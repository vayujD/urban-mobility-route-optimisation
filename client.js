// import L from "leaflet";
// import "leaflet-routing-machine";

// Initialize map and variables
let map;
let routingControl;
let currentLocationMarker = null;
let username = '';
let userRoutes = {};
let selectedPoint = null;
let selectedPointMarker = null;
let isSelectingPoint = false;
let countMarker = null;
let searchRadiusCircle = null;

// Custom icon definition
const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});





function onMapClick(e) {
    if (!isSelectingPoint) return;
    
    if (selectedPointMarker) {
        map.removeLayer(selectedPointMarker);
    }
    
    selectedPoint = e.latlng;
    selectedPointMarker = L.marker(selectedPoint).addTo(map);
    
    togglePointSelection();
}














// Initialize map
function initMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
    }).addTo(map);

    // Get user location
    getCurrentLocation();
    
    // Add map click handler
    map.on('click', onMapClick);
}

// Get coordinates from location name
async function getCoordinates(locationName) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`);
        const data = await response.json();
        
        if (data.length === 0) {
            throw new Error('Location not found');
        }
        
        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
        };
    } catch (error) {
        console.error('Error getting coordinates:', error);
        throw error;
    }
}

// Find route between source and destination
async function findRoute() {
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const departureTime = document.getElementById('departure-time').value;

    if (!source || !destination) {
        alert('Please enter both source and destination');
        return;
    }

    try {
        const sourceCoords = await getCoordinates(source);
        const destCoords = await getCoordinates(destination);

        if (routingControl) {
            map.removeControl(routingControl);
        }

        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(sourceCoords.lat, sourceCoords.lng),
                L.latLng(destCoords.lat, destCoords.lng)
            ],
            routeWhileDragging: true
        }).addTo(map);

    } catch (error) {
        alert('Error finding route. Please check your locations and try again.');
    }
}

// Share route with other users
async function shareRoute() {
    if (!username) {
        alert('Please set your username first');
        return;
    }

    if (!routingControl || !routingControl._selectedRoute) {
        alert('Please find a route first');
        return;
    }

    const departureTime = document.getElementById('departure-time').value;
    if (!departureTime) {
        alert('Please select a departure time');
        return;
    }

    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    
    try {
        const sourceCoords = await getCoordinates(source);
        const destCoords = await getCoordinates(destination);
        
        const route = routingControl._selectedRoute;
        const points = route.coordinates.map(coord => ({
            lat: coord.lat,
            lng: coord.lng
        }));

        const routeData = {
            username: username,
            departureTime: departureTime,
            source: source,
            destination: destination,
            sourceCoords: sourceCoords,
            destCoords: destCoords,
            points: points
        };

         fetch('http://localhost:3000/api/routes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(routeData)
        });

        alert('Route shared successfully!');
    } catch (error) {
        console.error('Error sharing route:', error);
        alert('Error sharing route. Please try again.');
    }
}

// Get current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                
                if (currentLocationMarker) {
                    map.removeLayer(currentLocationMarker);
                }
                
                currentLocationMarker = L.marker([latitude, longitude])
                    .bindPopup('Your Location')
                    .addTo(map);
                
                map.setView([latitude, longitude], 13);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Error getting your location. Please enter it manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}








// Set username
function setUsername() {
    const usernameInput = document.getElementById('username');
    username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('username', username);
        alert('Username set successfully!');
    } else {
        alert('Please enter a valid username');
    }
}




// Initialize map when page loads
document.addEventListener('DOMContentLoaded', initMap);