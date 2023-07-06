const favoriteClickHandler = async ($sender) => {
  const _mapId = $sender.attr("data-mapId");
  let _currentNumFavorites = Number($(".favorite-count").text());
  if ($sender.find("i").hasClass("favorited")) { // user has favorited this map.
    try {
      const deleteFavoriteMap = await db_helpers.removeFavoriteMap(_mapId);
      bootbox.dialog({
        message: 'Thank you for your support! Our map creators appreciate it.',
        closeButton: false,
        backdrop: true,
        centerVertical: true
      });
      _currentNumFavorites--;
      $sender.find("i").removeClass("favorited");
    } catch (err) {
      bootbox.alert({
        title: 'Wikimaps',
        message: `There has been an error: ${err.message}`,
        centerVertical: true
      });
      return;
    }
  } else { // adding a new favorite
    try {
      const addFavoriteMap = await db_helpers.addFavoriteMap(_mapId);
      bootbox.dialog({
        message: 'Thank you for your support! Our map creators appreciate it.',
        closeButton: false,
        backdrop: true,
        centerVertical: true
      });
      _currentNumFavorites++;
      $sender.find("i").addClass("favorited");
    } catch (err) {
      bootbox.alert({
        title: 'Wikimaps',
        message: `There has been an error: ${err.message}`,
        centerVertical: true
      });
    }
  }
  $(".favorite-count").text(_currentNumFavorites);
};

$(document).ready(function() {
  $(".favoriteToggle").click(function(event) {
    favoriteClickHandler($(this));
    event.stopPropagation();
  });
});