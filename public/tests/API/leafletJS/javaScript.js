$(document).ready(function() {
// Function to initialize the map
  initMap();
  const _map = $("#map")[0]._leaflet_map;
  $("#savePinData").click(saveMap);
});

