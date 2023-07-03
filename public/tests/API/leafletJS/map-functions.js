// this is required in case we need to retrieve the map object later based on the DOM element only.
// Every map created gets this initialization hook that sets itself to a property of the container it is rendered in.
L.Map.addInitHook(function() {
  // Store a reference of the Leaflet map object on the map container,
  // so that it could be retrieved from DOM selection.
  // https://leafletjs.com/reference-1.3.4.html#map-getcontainer
  this.getContainer()._leaflet_map = this;
});

const pinsTest = [
  {
    title: "This is Test1",
    description: "This is description A",
    Lat: 49.268813,
    Lon: -122.944436
  },
  {
    title: "This is Test1",
    description: "This is description B",
    Lat: 49.275057,
    Lon: -122.930789
  }
];

const onMarkerClickHandler = (e) => {
  const _marker = e.target;
  $("input[name='id']").val(_marker._leaflet_id);
  $("input[name='title']").val(_marker._title);
  $("input[name='description']").val(_marker._description);
  $("input[name='coordinates']").val(_marker._latlng);
  $("#pinInfo").slideDown();
  //console.log(this._map); // the property _map points to the map object that a marker belongs to.
};

const onMarkerRightClickHandler = (e) => {
  const _marker = e.target;
  _marker.remove();
};


const onMapClick = (event) => {
  const _map = event.target;
  let marker = new L.Marker(event.latlng, {draggable:true});
  marker._title = Math.random();
  marker._description = (Math.random() + 1).toString(36).substring(7);
  _map.addLayer(marker);
  console.log(_map.getContainer());
  marker.on('click', onMarkerClickHandler);
  marker.on('contextmenu', onMarkerRightClickHandler);
};

const getAllMarkers = (map) => {
  let allMarkers = [];
  for (const info in map._layers) {
    if (map._layers[info] instanceof L.Marker) { // is a marker
      const _marker = map._layers[info];
      allMarkers.push(map._layers[info]);
      console.log(`Marker ID (${_marker._leaflet_id}), Title: ${_marker._title}, Description: ${_marker._description}, Coords: ${_marker._latlng}`);
    }
  }
  console.log(allMarkers);
  return allMarkers;
};

const initMap = () => {
  const mapId = $("#map").attr("data-mapId");
  console.log('mapId', mapId);
  if (mapId) {
    return buildMap(null, mapId);
  }
  // Check if geolocation is supported by the browser
  if (navigator.geolocation) {
    // Get the current position
    navigator.geolocation.getCurrentPosition(buildMap, buildMap);
  } else {
    // Browser doesn't support geolocation
    buildMap({});
  }
};

const buildMap = async (position, mapId) => {
  let latitude;
  let longitude;
  let zoom = 15;
  let _info;
  if (!mapId) {
    // Retrieve latitude and longitude
    if (position.coords) { // geolocation OK
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    } else { // somewhere in Burnaby
      latitude = 49.262176;
      longitude = -122.946625;
    }
  } else { // lets get the map info!
    _info = await db_helpers.getMapInfo(mapId);
    console.log(_info);
    latitude = _info.mapInfo.latitude;
    longitude = _info.mapInfo.longitude;
    zoom = _info.mapInfo.zoom;    
  }
  
  // Create a map centered at the current position
  let _mapId = mapId || -1;
  _map = L.map('map').setView([latitude, longitude], zoom); // Adjust the zoom level as needed
  _map._appId = _mapId;

  // Add a tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(_map);

  // test: map has predefined pins.
  
  renderPinsToMap(_info.pinInfo, _map);

  // add event
  _map.on('click', onMapClick);
};

// function is called after database-functions.js getPinsForMap
const renderPinsToMap = (pinsObj, mapObj) => {  
  if (!Array.isArray(pinsObj) || pinsObj.length === 0) {
    return;
  }
  for (const pin of pinsObj) {
    // create L.Marker object
    let marker = new L.Marker([pin.latitude, pin.longitude], {draggable:true});
    // set custom properties
    marker._title = pin.title;
    marker._description = pin.description;
    // pin it to the map.
    mapObj.addLayer(marker);
    // add event handlers.
    marker.on('click', onMarkerClickHandler);
    marker.on('contextmenu', onMarkerRightClickHandler);
  }
};