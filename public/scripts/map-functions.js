// this is required in case we need to retrieve the map object later based on the DOM element only.
// Every map created gets this initialization hook that sets itself to a property of the container it is rendered in.
L.Map.addInitHook(function() {
  // Store a reference of the Leaflet map object on the map container,
  // so that it could be retrieved from DOM selection.
  // https://leafletjs.com/reference-1.3.4.html#map-getcontainer
  this.getContainer()._leaflet_map = this;
});

const onMarkerClickHandler = (e) => {
  const _marker = e.target;
  $("input[name='id']").val(_marker._id);
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

const initMap = () => {
  const mapId = $("#map").attr("data-mapId") || 0;
  console.log('mapId', mapId);
  if (mapId > 0) {
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

const buildMap = async(position, mapId) => {
  let latitude;
  let longitude;
  let zoom = 15;
  let _info;
  let _title = "";
  let _description = "";
  let _mapId = mapId || -1;
  
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
    try {
      _info = await db_helpers.getMapInfo(mapId);
    }
    catch(err) {
      console.log(err);
      console.log(_info);
      return; 
    }
    console.log(_info);
    latitude = _info.mapInfo.latitude;
    longitude = _info.mapInfo.longitude;
    zoom = _info.mapInfo.zoom;
  }
  
  // Create a map centered at the current position
  if (_info && _info.mapInfo) {
    _title = _info.mapInfo.title || "";
    _description = _info.mapInfo.description || "";
  }
  
  _map = L.map('map').setView([latitude, longitude], zoom); // Adjust the zoom level as needed
  _map._appId = _mapId;
  _map._title = _title;
  _map._description = _description;

  // Add a tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(_map);

  // add pins to map, if they exist.
  if (_info && _info.markerInfo) {
    renderPinsToMap(_info.markerInfo, _map);
  }

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
    marker._id = pin.id;
    // pin it to the map.
    mapObj.addLayer(marker);
    // add event handlers.
    marker.on('click', onMarkerClickHandler);
    marker.on('contextmenu', onMarkerRightClickHandler);
  }
};

const saveMap = async() => {
  const _map = $("#map")[0]._leaflet_map;
  const _mapCoords = _map.getCenter();
  const _mapZoom = _map.getZoom();
  const mapInfo = {
    id: _map._appId,
    title: _map._title,
    description: _map._description,
    latitude: _mapCoords.lat,
    longitude: _mapCoords.lon,
    zoom: _mapZoom
  };
  const markerInfo = getAllMarkers(_map);
  const response = await db_helpers.editMapInfo({ mapInfo, markerInfo });
  if (response) {
    console.log(response);
  }
};

const getAllMarkers = (map) => {
  let allMarkers = [];
  for (const info in map._layers) {
    if (map._layers[info] instanceof L.Marker) { // is a marker
      const _marker = map._layers[info];
      allMarkers.push({
        id: _marker._id,
        map_id: map._appId,
        title: _marker._title,
        description: _marker._description,
        latitude: _marker._latlng.lat,
        longitude: _marker._latlng.lon
      });
    }
  }
  return allMarkers;
};