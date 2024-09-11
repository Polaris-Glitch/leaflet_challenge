// Initialize the map
const map = L.map('map').setView([0, 0], 2);

// Add a base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch earthquake data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
        const earthquakes = data.features;

        // Define color scale based on depth
        function getColor(depth) {
            return depth > 300 ? '#00ff00' :
                   depth > 100 ? '#7fff00' :
                   depth > 50  ? '#ffff00' :
                   depth > 10  ? '#ff7f00' :
                                 '#ff0000';
        }

        // Define marker size based on magnitude
        function getRadius(magnitude) {
            return magnitude * 4;
        }

        // Add earthquake markers
        earthquakes.forEach(eq => {
            const coords = eq.geometry.coordinates;
            const magnitude = eq.properties.mag;
            const depth = coords[2];
            const color = getColor(depth);

            L.circle([coords[1], coords[0]], {
                radius: getRadius(magnitude),
                color: color,
                fillColor: color,
                fillOpacity: 0.7,
            }).bindPopup(`
                <strong>Location:</strong> ${eq.properties.place}<br>
                <strong>Magnitude:</strong> ${magnitude}<br>
                <strong>Depth:</strong> ${depth} km<br>
                <strong>Time:</strong> ${new Date(eq.properties.time).toLocaleString()}
            `).addTo(map);
        });
    });