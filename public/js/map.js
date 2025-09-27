const cordinates = coordinates;
document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView(cordinates, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

    const marker = L.marker(cordinates,{icon:redIcon}).addTo(map);
    marker.bindPopup("<p>Exact location will be provided after booking</p>").openPopup();

});

// const NodeGeocoder = require('node-geocoder');
// const geocoder = NodeGeocoder({ provider: 'openstreetmap' });

// geocoder.geocode('Thane, Maharashtra')
//     .then(res => console.log(res[0]))
//     .catch(err => console.error(err));