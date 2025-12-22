document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map').setView([38.6270, -90.1994], 10); // Centered on St. Louis

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const locations = [
        {
            name: 'St. Patrick Center',
            address: '800 N Tucker Blvd, St. Louis, MO 63101',
            type: 'Shelter'
        },
        {
            name: 'St. Louis Vet Center',
            address: '287 North Lindbergh Boulevard, Creve Coeur, MO 63141',
            type: 'Veteran Resource Center'
        },
        {
            name: 'Veterans Community Project',
            address: '8925 Gallant Fox Dr, St. Louis, MO 63123',
            type: 'Veteran Resource Center'
        }
    ];

    locations.forEach(location => {
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location.address)}`;

        fetch(geocodeUrl)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const lat = data.results[0].latitude;
                    const lon = data.results[0].longitude;

                    const marker = L.marker([lat, lon]).addTo(map);
                    marker.bindPopup(`<b>${location.name}</b><br>${location.address}<br><em>${location.type}</em>`);
                }
            })
            .catch(error => {
                console.error('Error geocoding:', error);
            });
    });
});