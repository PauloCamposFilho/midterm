// this is required in case we need to retrieve the map object later based on the DOM element only.
// Every map created gets this initialization hook that sets itself to a property of the container it is rendered in.
L.Map.addInitHook(function() {
  // Store a reference of the Leaflet map object on the map container,
  // so that it could be retrieved from DOM selection.
  // https://leafletjs.com/reference-1.3.4.html#map-getcontainer
  this.getContainer()._leaflet_map = this;
});

const markerFormUpdate = (marker) => {
  $("form#markerInfo input[name='id']").val(marker._id);
  $("form#markerInfo input[name='title']").val(marker._title);
  $("form#markerInfo input[name='description']").val(marker._description);
  $("form#markerInfo input[name='latitude']").val(marker._latlng.lat);
  $("form#markerInfo input[name='longitude']").val(marker._latlng.lng);
  $("form#markerInfo input[name='image']").val(marker._imageUrl);
};

const onMarkerClickHandler = (e) => {
  const _marker = e.target;
  _markerMapObject = _marker;
  markerFormUpdate(_marker);
  $("#markerInfo").slideDown();
};

const onMarkerRightClickHandler = (e) => {
  const _marker = e.target;
  _marker.remove();
};

const onMarkerHoverHandler = (layer) => {
  console.log(layer);
  // Access the custom properties of the marker
  const title = layer._title;
  const description = layer._description;
  const imageUrl = layer._imageUrl;

  // Create the tooltip content
  // const content = '<strong>' + title + '</strong><br>' + description;
  const content = `<div><strong> ${title} </strong><br> ${description} </div> ${imageUrl ? `<img src='${imageUrl}' alt='image' width='100px'>` : ""} `;

  // Return the tooltip content
  return content;
};

const onMapClickHandler = (event) => {
  const userCanEdit = $("#userCanEdit").val() === 'true'; // userCanEdit is a hidden input field in map.ejs at the top of <body>. Comparison written this way since strings are always truthy.
  if (!userCanEdit) {
    return;
  }
  const _map = event.target;
  let marker = new L.Marker(event.latlng, {draggable:true});
  marker._title = "Add a Title to me!"
  marker._description = "...and a description!";
  _map.addLayer(marker);
  marker._id = marker._leaflet_id;
  console.log(_map.getContainer());
  marker.on('click', onMarkerClickHandler);
  marker.on('contextmenu', onMarkerRightClickHandler);
  marker.bindTooltip(onMarkerHoverHandler, { offset: [0, -20] });
  markerFormUpdate(marker);
  if (!$("#markerInfo").is(":visible")) {
    $("#markerInfo").slideDown();
  }
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

  // define map variables.
  let _info;

  const mapObj = {
    latitude: '',
    longitude: '',
    zoom: 15,
    title: '',
    description: '',
    thumbnail_photo: '',
    id: mapId || -1
  };

  if (!mapId) {
    // Retrieve latitude and longitude
    if (position.coords) { // geolocation OK
      mapObj.latitude = position.coords.latitude;
      mapObj.longitude = position.coords.longitude;
    } else { // somewhere in Burnaby. Picked at random for default start location when creating map w/o geolocation
      mapObj.latitude = 49.262176;
      mapObj.longitude = -122.946625;
    }
  } else { // lets get the map info!
    try {
      _info = await db_helpers.getMapInfo(mapId);
      mapObj.latitude = _info.mapInfo.latitude;
      mapObj.longitude = _info.mapInfo.longitude;
      mapObj.zoom = _info.mapInfo.zoom;
      mapObj.title = _info.mapInfo.title || "";
      mapObj.description = _info.mapInfo.description || "";
      mapObj.thumbnail_photo = _info.mapInfo.thumbnail_photo;
    } catch (err) {
      console.log(err);
      console.log(_info);
      return;
    }
    console.log(_info);
  }

  // Create a map centered at the current position

  const _map = L.map('map').setView([mapObj.latitude, mapObj.longitude], mapObj.zoom); // Adjust the zoom level as needed
  _map._appId = mapObj.id;
  _map._title = mapObj.title;
  _map._description = mapObj.description;

  // Add a tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(_map);

  // add pins to map, if they exist.
  if (_info && _info.markerInfo) {
    renderPinsToMap(_info.markerInfo, _map);
  }

  populateMapForm(mapObj);

  // add event
  _map.on('click', onMapClickHandler);
};

const populateMapForm = (mapObj) => {
  const $mapForm = $("#mapInfo");
  const $mapTitle = $mapForm.find("input[name='title']");
  const $mapDescription = $mapForm.find("input[name='description']");
  const $mapPhotoURL = $mapForm.find("input[name='thumbnail_photo']");
  $mapTitle.val(mapObj.title);
  $mapDescription.val(mapObj.description);
  $mapPhotoURL.val(mapObj.thumbnail_photo);
  console.log(`img??? ${mapObj.thumbnail_photo}`);

  $("img.map-thumbnail").attr("src", mapObj.thumbnail_photo);
};

// function is called after database-functions.js getPinsForMap
const renderPinsToMap = (pinsObj, mapObj) => {
  if (!Array.isArray(pinsObj) || pinsObj.length === 0) {
    return;
  }
  const userCanEdit = $("#userCanEdit").val() === 'true'; // userCanEdit is a hidden input field in map.ejs at the top of <body>. Comparison written this way since strings are always truthy.
  for (const pin of pinsObj) {
    // create L.Marker object
    let marker = new L.Marker([pin.latitude, pin.longitude], {draggable:userCanEdit});
    // set custom properties
    marker._title = pin.title;
    marker._description = pin.description;
    marker._imageUrl = pin.image;
    marker._id = pin.id;
    // pin it to the map.
    mapObj.addLayer(marker);
    // add event handlers.
    marker.on('click', onMarkerClickHandler);
    marker.on('contextmenu', onMarkerRightClickHandler);
    marker.bindTooltip(onMarkerHoverHandler, { offset: [0, -20] });
  }
};

// updates marker information in memory.
const updateMarkerInfo = () => {
  console.log("Entered updateMarkerInfo");
  const _map = $("#map")[0]._leaflet_map;
  const _markerObj = {};
  const _markerForm = $("#markerInfo");
  _markerObj.id = Number(_markerForm.find("input[name='id']").val());
  _markerObj.title = _markerForm.find("input[name='title']").val();
  _markerObj.description = _markerForm.find("input[name='description']").val();
  _markerObj.image = _markerForm.find("input[name='image']").val();

  for (const marker in _map._layers) {
    console.log("in the loop");
    console.log(_map._layers[marker]._id, _markerObj.id, _map._layers[marker]._id === _markerObj.id);
    if (_map._layers[marker] instanceof L.Marker && _map._layers[marker]._id === _markerObj.id) {
      console.log("I'm in here.");
      _map._layers[marker]._title = _markerObj.title;
      _map._layers[marker]._description = _markerObj.description;
      _map._layers[marker]._imageUrl = _markerObj.image;
      break;
    }
  }
  _markerForm.slideUp();
};

const saveMap = async() => {
  const _map = $("#map")[0]._leaflet_map;
  const _mapCoords = _map.getCenter();
  const _mapZoom = _map.getZoom();
  const $mapForm = $("#mapInfo");
  const mapTitle = $mapForm.find("input[name='title']").val();
  const mapDescription = $mapForm.find("input[name='description']").val();
  const mapThumbnailPhoto = $mapForm.find("input[name='thumbnail_photo']").val();
  const mapInfo = {
    id: _map._appId,
    title: mapTitle,
    description: mapDescription,
    thumbnail_photo: mapThumbnailPhoto,
    latitude: _mapCoords.lat,
    longitude: _mapCoords.lng,
    zoom: _mapZoom
  };
  const markerInfo = getAllMarkers(_map);
  try {
    let response;
    if (mapInfo.id > 0) {
      response = await db_helpers.editMapInfo({ mapInfo, markerInfo });
    } else {
      response = await db_helpers.addMap({ mapInfo, markerInfo });
      if (response.mapId) {
        window.location.href = `${window.location.origin}/maps/${response.mapId}`;
      }
    }
    console.log(response);
  } catch (err) {
    console.log(err);
  }
  populateMapForm(mapInfo);
};

const getAllMarkers = (map) => {
  let allMarkers = [];
  for (const info in map._layers) {
    if (map._layers[info] instanceof L.Marker) { // is a marker
      const _marker = map._layers[info];
      console.log(_marker);
      allMarkers.push({
        id: _marker._id,
        map_id: map._appId,
        title: _marker._title,
        description: _marker._description,
        image: _marker._imageUrl,
        latitude: _marker._latlng.lat,
        longitude: _marker._latlng.lng
      });
    }
  }
  return allMarkers;
};

$(document).ready(function() {
  // Function to initialize the map
    initMap();
    const _map = $("#map")[0]._leaflet_map;
    $("#savePinData").click(updateMarkerInfo);
    $("#saveMap").click(saveMap);
    $("#mapEditors").chosen();
    $("#mapEditors").on("change", function() {
      const _selectedId = Number($(this).val());
      if (_selectedId === 0) {
        $(".addEditor").prop("disabled", true);
        return;
      }
      $(".addEditor").prop("disabled", false);
    }).trigger("change");
  });

