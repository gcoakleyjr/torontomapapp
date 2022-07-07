mapboxgl.accessToken = 'pk.eyJ1IjoiZ2NvYWtsZXlqciIsImEiOiJjbDU1b3BkdGIwcnZwM2RtZnhxdThqZzNsIn0.ir90AYJ272JpNzo3c8HUHg';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: post.geometry.coordinates, // starting position [lng, lat]
    zoom: 11, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(post.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 15})
        .setHTML(
            `<h4>${post.title}</h4>`
        )
    )
    .addTo(map)