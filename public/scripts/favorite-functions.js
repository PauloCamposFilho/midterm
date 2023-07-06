const favoriteClickHandler = async ($sender) => {
  const _mapId = $sender
  if ($sender.hasClass("favorited")) { // user has favorited this map.
    try {
      const deleteFavoriteMap = await db_helpers.removeFavoriteMap($sender.mapId);
      bootbox.dialog({
        message: 'Thank you for your support! Our map creators appreciate it.',
        closeButton: false,
        backdrop: true,
        centerVertical: true
      });
      return;      
    } catch (err) {
      bootbox.alert({
        title: 'Wikimaps',
        message: `There has been an error: ${err}`,
        centerVertical: true
      });
      return;
    }
  } else { // adding a new favorite
    try {
      const addFavoriteMap = await db_helpers.addFavoriteMap($sender.mapId);
      bootbox.dialog({
        message: 'Thank you for your support! Our map creators appreciate it.',
        closeButton: false,
        backdrop: true,
        centerVertical: true
      });
    } catch (err) {
      bootbox.alert({
        title: 'Wikimaps',
        message: `There has been an error: ${err}`,
        centerVertical: true
      });
    }
  }
};