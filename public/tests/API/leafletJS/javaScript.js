let _testE
$(document).ready(function() {
// Function to initialize the map
  initMap();
  $("#mapSubmit").click(function() {
    const mapId = $("#map")[0]._leaflet_map._appId;
    alert(mapId);
  });  
});

