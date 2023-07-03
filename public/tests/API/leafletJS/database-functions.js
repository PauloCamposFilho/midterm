const db_helpers = {
  getPinsForMap: async (mapId) => {
    return db_helpers.ajaxRequestWrapper({
      url: `http://localhost:3000/pins/${mapId}`,
      type: 'GET'
    });
  },
  getMapInfo: async (mapId) => {
    return db_helpers.ajaxRequestWrapper({
      url: `http://localhost:3000/maps/${mapId}`,
      type: 'GET'
    });
  },
  ajaxRequestWrapper: async (options) => {
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
        options.type = 'GET'
      }
      if (!options.dataType) {
        options.dataType = 'text';
      }
      $.ajax({
        url: options.url,
        type: options.type,
        data: options.data,
        success: function(res) {
          resolve(res);
        },
        error: function(err) {
          reject(err.message);
        }
      });
    });
  }  
};
// async function getData() {
//   try {
//     return db_helpers.ajaxRequestWrapper({ url: 'https://api.ipify.org?format=json', dataType: 'JSON' });    
//   } catch (error) {
//     console.log(error);
//   }
  
// }