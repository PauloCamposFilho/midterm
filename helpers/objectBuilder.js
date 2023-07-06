const buildMapObjectFromMapInfo = (mapInfo, includeLastEdit) => {
  const returnObj = {
    title: mapInfo.title,
    description: mapInfo.description,
    thumbnail_photo: mapInfo.thumbnail_photo,
    latitude: mapInfo.latitude,
    longitude: mapInfo.longitude,
    zoom: mapInfo.zoom
  };
  if (includeLastEdit) {
    returnObj.last_edit = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
  }
  return returnObj;
};

const buildMarkerObjectFromMarkerInfo = (markerInfo, mapId) => {
  const returnObj = {
    title: markerInfo.title,
    description: markerInfo.description,
    image: markerInfo.image,
    latitude: markerInfo.latitude,
    longitude: markerInfo.longitude,
  };
  if (mapId) {
    returnObj.map_id = mapId;
  }
  return returnObj;
};

module.exports = { buildMapObjectFromMapInfo, buildMarkerObjectFromMarkerInfo };