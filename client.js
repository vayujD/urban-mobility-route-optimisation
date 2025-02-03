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



// Initialize Firebase references
// const routesRef = firebase.database().ref('routes');


// Custom icon definition
const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});






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














// Toggle point selection mode
function togglePointSelection() {
    isSelectingPoint = !isSelectingPoint;
    const btn = document.getElementById('select-point-btn');
    if (isSelectingPoint) {
        btn.textContent = 'Cancel Selection';
        btn.style.backgroundColor = '#dc3545';
        map.getContainer().style.cursor = 'crosshair';
    } else {
        btn.textContent = 'Select Point on Map';
        btn.style.backgroundColor = '#4CAF50';
        map.getContainer().style.cursor = '';
    }
}

// Handle map click for point selection
function onMapClick(e) {
    if (!isSelectingPoint) return;

    if (selectedPointMarker) {
        map.removeLayer(selectedPointMarker);
    }

    selectedPoint = e.latlng;
    selectedPointMarker = L.marker(selectedPoint).addTo(map);

    togglePointSelection();
}







// Check users passing through a point
async function checkUsers() {
    if (!selectedPoint) {
        alert('Please select a point on the map first');
        return;
    }

    const checkTime = document.getElementById('check-time').value;
    if (!checkTime) {
        alert('Please select a time to check');
        return;
    }

    const selectedDateTime = new Date(checkTime);
    const timeWindow = 30 * 60 * 1000; // 30 minutes in milliseconds
    const searchRadius = 50; // 50 meters

    try {
        // Get all routes from Firebase
        const snapshot = await routesRef.once('value');
        const routes = [];
        snapshot.forEach(childSnapshot => {
            const route = childSnapshot.val();
            const routeTime = new Date(route.departureTime);

            // Check if route is within the time window
            if (Math.abs(routeTime - selectedDateTime) <= timeWindow) {
                routes.push(route);
            }
        });


        // Count users passing through the selected point
        let userCount = 0;
        const usersFound = new Set();

        routes.forEach(route => {
            // Check if any point in the route is within the search radius
            const isNearby = route.points.some(point => {
                const distance = calculateDistance(
                    selectedPoint.lat,
                    selectedPoint.lng,
                    point.lat,
                    point.lng
                );
                return distance <= searchRadius;
            });

            if (isNearby && !usersFound.has(route.username)) {
                userCount++;
                usersFound.add(route.username);
            }
        });

        // Create or update marker with user count
        if (countMarker) {
            map.removeLayer(countMarker);
        }

        countMarker = L.marker([selectedPoint.lat, selectedPoint.lng], {
            icon: L.divIcon({
                className: 'count-marker',
                html: `<div class="user-count">${userCount}</div>`,
                iconSize: [40, 40]
            })
        }).addTo(map);

        // Show users in a popup
        const userList = Array.from(usersFound).join(', ');
        const timeRange = `${new Date(selectedDateTime - timeWindow).toLocaleTimeString()} - ${new Date(selectedDateTime + timeWindow).toLocaleTimeString()}`;

        countMarker.bindPopup(`
     <strong>${userCount} users</strong> passing within ${searchRadius}m<br>
     Time window: ${timeRange}<br>
     ${userCount > 0 ? `<small>Users: ${userList}</small>` : ''}
 `).openPopup();

        // Add circle to show search radius
        if (searchRadiusCircle) {
            map.removeLayer(searchRadiusCircle);
        }
        searchRadiusCircle = L.circle([selectedPoint.lat, selectedPoint.lng], {
            radius: searchRadius,
            color: '#4CAF50',
            fillColor: '#4CAF50',
            fillOpacity: 0.1
        }).addTo(map);

    } catch (error) {
        console.error('Error checking users:', error);
        alert('Error checking users. Please try again.');
    }
}

// Calculate distance between two points in meters using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
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
    const dialog = document.getElementById('route-dialog');
    if (!dialog) {
        console.error('Route dialog not found');
        return;
    }

    const source = dialog.querySelector('#source').value;
    const destination = dialog.querySelector('#destination').value;
    const departureTime = dialog.querySelector('#departure-time').value;
    const stopInput = dialog.querySelector('#stops');
    const stopValues = stopInput.value.split(',').map(stop => stop.trim()).filter(stop => stop); // Filter out empty stops

    if (!source || !destination) {
        alert('Please enter both source and destination');
        return;
    }

    try {
        const sourceCoords = await getCoordinates(source);
        const destCoords = await getCoordinates(destination);
        const waypoints = await Promise.all(stopValues.map(stop => getCoordinates(stop)));

        // Clear existing markers
        map.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add markers for source and destination
        L.marker([sourceCoords.lat, sourceCoords.lng], { icon: customIcon }).addTo(map)
            .bindPopup('Source: ' + source)
            .openPopup();
        L.marker([destCoords.lat, destCoords.lng], { icon: customIcon }).addTo(map)
            .bindPopup('Destination: ' + destination)
            .openPopup();

        // Add markers for each stop and display order
        // console.log(sourceCoords.lat, sourceCoords.lng);
        // waypoints.forEach((coord, index) => {console.log(waypoints[index].lat, waypoints[index].lng);
        //     L.marker([coord.lat, coord.lng], { icon: customIcon }).addTo(map)
        //         .bindPopup(`Stop ${index + 1}: ${stopValues[index]}`)
        //         .openPopup();


        // });
        // console.log(destCoords.lat, destCoords.lng);








        // Create an array to hold all coordinates in order: source → waypoints → destination
        const allCoords = [sourceCoords, ...waypoints, destCoords];

// Log the entire array
        console.log("All coordinates:", allCoords);

// Replace existing logging code with this unified array
        allCoords.forEach((coord, index) => {
            console.log(`Coordinate ${index + 1}:`, coord.lat, coord.lng);
        });

// marker code using same loop for waypoints
        waypoints.forEach((coord, index) => {
            L.marker([coord.lat, coord.lng], { icon: customIcon })
                .addTo(map)
                .bindPopup(`Stop ${index + 1}: ${stopValues[index]}`)
                .openPopup();
        });













        // Add routing logic here
        if (routingControl) {
            map.removeControl(routingControl);
        }

        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(sourceCoords.lat, sourceCoords.lng),
                ...waypoints.map(coord => L.latLng(coord.lat, coord.lng)),
                L.latLng(destCoords.lat, destCoords.lng)
            ],
            routeWhileDragging: true,
            createMarker: function() { return null; } // Disable default markers
        }).addTo(map);

    } catch (error) {
        alert('Error finding route. Please check your locations and try again.');
    }
}

// Toggle routes list panel
function toggleRoutesList() {
    const panel = document.getElementById('routes-panel');
    const btn = document.getElementById('routes-btn');
    const isHidden = panel.classList.contains('hidden');

    if (isHidden) {
        panel.classList.remove('hidden');
        btn.textContent = 'Hide Routes';
        loadAllRoutes();
    } else {
        panel.classList.add('hidden');
        btn.textContent = 'Show All Routes';
    }
}

// Load and display all routes
function loadAllRoutes() {
    const container = document.getElementById('routes-container');
    const filter = document.getElementById('route-filter').value;

    routesRef.orderByChild('timestamp').limitToLast(50).once('value', (snapshot) => {
        container.innerHTML = '';
        const routes = [];

        snapshot.forEach((childSnapshot) => {
            const route = childSnapshot.val();
            route.id = childSnapshot.key;
            routes.push(route);
        });

        routes.reverse().forEach(route => {
            if (filter === 'my' && route.username !== username) {
                return;
            }

            const routeDiv = document.createElement('div');
            routeDiv.className = 'route-item';

            const date = new Date(route.departureTime);
            routeDiv.innerHTML = `
                <strong>${route.username}</strong><br>
                From: ${route.source}<br>
                To: ${route.destination}<br>
                Time: ${date.toLocaleString()}
            `;

            routeDiv.onclick = () => showRouteOnMap(route);
            container.appendChild(routeDiv);
        });
    });
}
// Show selected route on map
function showRouteOnMap(route) {
    if (routingControl) {
        map.removeControl(routingControl);
    }

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(route.sourceCoords.lat, route.sourceCoords.lng),
            L.latLng(route.destCoords.lat, route.destCoords.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false
    }).addTo(map);

    map.fitBounds([
        [route.sourceCoords.lat, route.sourceCoords.lng],
        [route.destCoords.lat, route.destCoords.lng]
    ]);
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
    const stopPoints = document.getElementById('stops').value.split(',').map(stop => stop.trim());

    console.log('stopPoints:', stopPoints);

    try {
        const sourceCoords = await getCoordinates(source);
        const destCoords = await getCoordinates(destination);
        const stopPointsCoords = await Promise.all(stopPoints.map(async stop => {
            const coords = await getCoordinates(stop);
            console.log(`Coordinates for stop points' ${stop}":`, coords);
            return {
                latitude: coords.lat,
                longitude: coords.lng
            }

        }));

        const route = routingControl._selectedRoute;
        const points = route.coordinates.map(coord => ({
            latitude: coord.lat,
            longitude: coord.lng
        }));

        const routeData = {
            username: username,
            departureTime: departureTime,
            source: source,
            destination: destination,
            stopPoints: stopPointsCoords,
            sourceCoords: {
                latitude: sourceCoords.lat,
                longitude: sourceCoords.lng
            },
            destCoords: {
                latitude: destCoords.lat,
                longitude: destCoords.lng
            },
            points: points
        };

        console.log('Route data:', routeData);

        const response = await fetch('http://localhost:3000/api/routes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(routeData)
        });

        if (response.ok) {
            alert('Route shared successfully!');
        } else {
            alert('Error sharing route. Please try again.');
        }
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







//vechicle count
async function saveVehicleCount() {
    const availableVehicles = document.getElementById("vehicleCount").value;
    const messageElement = document.getElementById("message");

    if (!availableVehicles || availableVehicles < 1) {
        messageElement.textContent = "Please enter a valid number!";
        messageElement.style.color = "red";
        return;
    }

    try {
        const response = await fetch("/api/vehicles", {
            method: "POST",
            headers: { "Content-Type": "package/json" },
            body: JSON.stringify({ count: availableVehicles }),
        });

        const data = await response.json();
        if (response.ok) {
            messageElement.textContent = data.message;
            messageElement.style.color = "green";
        } else {
            messageElement.textContent = "Error: " + data.message;
            messageElement.style.color = "red";
        }
    } catch (error) {
        messageElement.textContent = "Server Error!";
        messageElement.style.color = "red";
        console.error("Error:", error);
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