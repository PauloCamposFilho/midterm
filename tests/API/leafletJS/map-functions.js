function onMapClick(e) {
  var marker = new L.Marker(e.latlng, {draggable:true});
  marker._title = Math.random();
  marker._description = (Math.random() + 1).toString(36).substring(7);
    map.addLayer(marker);
    console.log("marker", marker);
    console.log(marker._leaflet_id);
    marker.on('click', function() {
      $("input[name='id']").val(this._leaflet_id);
      $("input[name='title']").val(this._title);
      $("input[name='description']").val(this._description);
      $("input[name='coordinates']").val(this._latlng);
    });
    marker.on('contextmenu', function() {
      this.remove();
    });
}

function getAllMarkers() {
  var allMarkers = [];  
  for (const info in map._layers) {
    if (map._layers[info] instanceof L.Marker) { // is a marker
      const _marker = map._layers[info];
      allMarkers.push(map._layers[info]);
      console.log(`Marker ID (${_marker._leaflet_id}), Title: ${_marker._title}, Description: ${_marker._description}, Coords: ${_marker._latlng}`);      
    }
  }
  // Output the markers
  console.log(allMarkers); 
}

const buildMap = (position) => {
  // Retrieve latitude and longitude
  if (position.coords) { // geolocation OK
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  } else { // somewhere in Burnaby
    latitude = 49.262176;
    longitude = -122.946625;
  }
  // Create a map centered at the current position
  map = L.map('map').setView([latitude, longitude], 15); // Adjust the zoom level as needed

  // Add a tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  // Add a marker at the current position
  // L.marker([latitude, longitude]).addTo(map);

  // add event
  map.on('click', onMapClick);
}
function initMap() {
  // Check if geolocation is supported by the browser
  if (navigator.geolocation) {
    // Get the current position
    navigator.geolocation.getCurrentPosition(buildMap, buildMap);
  } else {
    // Browser doesn't support geolocation
    buildMap({});
  }
}

