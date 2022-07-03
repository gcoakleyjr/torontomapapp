mapboxgl.accessToken = 'pk.eyJ1IjoiZ2NvYWtsZXlqciIsImEiOiJjbDU1b3BkdGIwcnZwM2RtZnhxdThqZzNsIn0.ir90AYJ272JpNzo3c8HUHg';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campLocation, // starting position [lng, lat]
    zoom: 11, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(campLocation)
    .addTo(map)