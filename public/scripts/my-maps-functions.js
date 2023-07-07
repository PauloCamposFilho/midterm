const deleteMapClickHandler = async ($sender) => {
  const _mapId = $sender.attr("data-mapId");
  console.log($sender);
  try {
    if (!_mapId) {
      throw new Error("Bad request. Invalid mapId.");
    }
    bootbox.confirm({
      title: 'Wikimaps',
      message: 'Are you sure you want to delete this map? This action is irreversible.',
      centerVertical: true,
      callback: async function(result) {
        if (result) {
          const deleteMap = await db_helpers.deleteMap(_mapId);
          $(`#user_maps tbody tr[data-mapId='${_mapId}']`).fadeOut(400, "linear", function() {
            $(`#user_maps tbody tr[data-mapId='${_mapId}']`).remove();
          });
          bootbox.alert({
            title: 'Wikimaps',
            message: `Map removed successfully.`,
            centerVertical: true
          });
          if ($("#userCanEdit").length > 0) { // we're inside the map page... reload it!
            location.reload();
          }
        }
      }
    });
  } catch(err) {
    bootbox.alert({
      title: 'Wikimaps',
      message: `There has been an error: ${err.message}`,
      centerVertical: true
    });
  }
};

$(document).ready(function() {
  $(".deleteMap").click(function(event) {
    deleteMapClickHandler($(this));
    event.stopPropagation();
  });
});