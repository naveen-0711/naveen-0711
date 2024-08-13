let map;
let service;
let infowindow;

function initMap() {
    // Initialize the map centered on a default location
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
        zoom: 15
    });

    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
}

function searchLocation() {
    const input = document.getElementById('locationInput').value;
    const geocoder = new google.maps.Geocoder();

    if (!input) {
        alert("Please enter a location.");
        return;
    }

    geocoder.geocode({ address: input }, function(results, status) {
        if (status === 'OK') {
            const location = results[0].geometry.location;
            map.setCenter(location);

            // Clear previous markers
            clearMarkers();

            // Add a marker for the input location
            new google.maps.Marker({
                position: location,
                map: map,
                title: 'Selected Location'
            });

            // Search for nearby buildings
            service.nearbySearch({
                location: location,
                radius: 1000, // Search within 1 km
                type: ['establishment'] // Types of places to search
            }, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    results.forEach(place => {
                        createMarker(place);
                    });
                } else {
                    alert('Nearby search was not successful for the following reason: ' + status);
                }
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

let markers = [];

function createMarker(place) {
    const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name
    });

    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, marker);
    });
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

// Initialize the map when the window loads
window.onload = initMap;