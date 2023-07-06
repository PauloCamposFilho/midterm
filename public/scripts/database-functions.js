const db_helpers = {
  getPinsForMap: async(mapId) => {
    return db_helpers.ajaxRequestWrapper({
      url: `/pins/${mapId}`,
      type: 'GET'
    });
  },
  getMapInfo: async(mapId) => {
    return db_helpers.ajaxRequestWrapper({
      url: `/maps/${mapId}/info`,
      type: 'GET'
    });
  },
  editMapInfo: async (mapInfoObj) => {
    return db_helpers.ajaxRequestWrapper({
      url: `/maps/${mapInfoObj.mapInfo.id}`,
      type: 'PATCH',
      data: {
        mapInfo: mapInfoObj.mapInfo,
        markerInfo: mapInfoObj.markerInfo
      },
      dataType: 'json'
    });
  },
  addMap: async (mapInfoObj) => {
    return db_helpers.ajaxRequestWrapper({
      url: `/maps/`,
      type: 'POST',
      data: {
        mapInfo: mapInfoObj.mapInfo,
        markerInfo: mapInfoObj.markerInfo
      },
      dataType: 'json'
    });
  },
  addEditorToMap: async (mapId, editorId) => {
    return db_helpers.ajaxRequestWrapper({
      url: `/editors/`,
      type: 'POST',
      data: { mapId, editorId },
      datatype: 'json'
    });
  },
  removeEditorFromMap: (mapId, editorId) => {
    return db_helpers.ajaxRequestWrapper({
      url: `/editors/`,
      type: 'DELETE',
      data: { mapId, editorId },
      datatype: 'json'
    });
  },
  addFavoriteMap: (mapId) => {
    return db_helpers.ajaxRequestWrapper({
      url: `/favorites/`,
      type: 'POST',
      data: { mapId },
      datatype: 'json'
    });
  },
  removeFavoriteMap: (mapId) => {
    return db_helpers.ajaxRequestWrapper({
      url: `/favorites/`,
      type: 'DELETE',
      data: { mapId },
      datatype: 'json'
    });
  },
  ajaxRequestWrapper: async(options) => {
    /*
    options {
      url: endpoint URL,
      type: RESTFul expected,
      data: the data to be sent
      dataType: default is text.
    }
    */
    return new Promise((resolve, reject) => {
      if (!options) {
        reject("options parameter object cannot be null");
      }
      if (!options.type) {
        options.type = 'GET';
      }
      if (!options.dataType) {
        options.dataType = 'text';
      }
      $.ajax({
        url: options.url,
        type: options.type,
        data: options.data,
        datatype: options.dataType,
        success: function(res) {
          resolve(res);
        },
        error: function (xhr, textStatus, error) {
          console.log(xhr);
          console.log(textStatus);
          console.log(error);   
          reject(xhr.responseJSON);
        }
      });
    });
  }
};