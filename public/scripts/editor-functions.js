const editorDeleteEventHandler = async ($button) => {
  console.log("I'm in here... removing editor.");
  if ($button.prop("disabled") === true) {
    return;
  }
  try {
    const mapId = $("#map").attr("data-mapId");
    const editorId = Number($button.attr("data-editorId"));
    const response = await db_helpers.removeEditorFromMap(mapId, editorId);
    console.log(response);
    $button.parent().remove();
  } catch (err) {
    console.log(err);
    bootbox.alert({
      title: 'Wikimaps',
      message: `There has been an error: ${err.message}`,
      centerVertical: true
    });
  }
};

const editorAddEventHandler = async ($button) => {
  console.log("I'm in here... adding editor");
  if ($button.prop("disabled") === true) {
    return;
  } else {
    try {
      const mapId = $("#map").attr("data-mapId");
      const editorId = Number($("#mapEditors").val());
      const response = await db_helpers.addEditorToMap(mapId, editorId);
      console.log(response);
      const $editorToAdd = $("<li>")
      .text(response.user.username)
      .append($("<button>")
        .text("X")
        .addClass("btn btn-sm btn-danger removeEditor")
        .attr("data-editorid", response.user.id).click(function() { // anonymous function so I can use the $(this) context properly on the callback here. weird edge-case.
          editorDeleteEventHandler($(this));
        }));        
      if ($(".map-editor-list").length > 0) {
        $(".map-editor-list ul").append($editorToAdd);
        return;
      }
    } catch (err) {
      bootbox.alert({
        title: 'Wikimaps',
        message: `There has been an error: ${err.message}`,
        centerVertical: true
      });
    }
  }
};

$(document).ready(function() {
  $(".addEditor").click(function () { editorAddEventHandler($(this)) });
  $(".removeEditor").click(function () { editorDeleteEventHandler($(this)) });
});