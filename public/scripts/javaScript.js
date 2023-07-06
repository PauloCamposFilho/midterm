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
  $(".addEditor").click(function () { editorAddEventHandler($(this)) });
  $(".removeEditor").click(function () { editorDeleteEventHandler($(this)) });
  $(".favorite-indicator").click(function() { favoriteClickHandler($(this)) });
});

