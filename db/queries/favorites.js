const db = require('../connection');

// fetch all of a user's favorite maps
const getAllFavoritesForUser = function(userId) {
  return db
    .query(`
    SELECT maps.*
    FROM favorites
    JOIN maps ON favorites.map_id = maps.id
    JOIN users ON favorites.user_id = users.id
    WHERE favorites.user_id = $1
    `, [userId])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// count the favorites for a given map
const getFavoriteCountForMap = function(mapId) {
  return db
    .query(`
    SELECT count(favourites.*)
    FROM favorites
    JOIN maps ON maps_id = maps.id
    WHERE maps_id = $1
    `, [mapId])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// count the number of times maps made by a given user have been favorited
const getFavoriteCountForUser = function(userId) {
  return db
    .query(`
    SELECT count(favourites.*)
    FROM favorites
    JOIN users ON favorites.user_id = users.id
    JOIN maps on favorites.map_id = maps.id
    WHERE maps.user_id = $1
    `, [userId])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// fetch the most favorited map created by a given user
const getMostFavorited = function(userId) {
  return db
    .query(`
    SELECT maps.*, count(favorites.*)
    FROM favorites
    JOIN maps ON favorites.map_id = maps.id
    JOIN users ON favorites.user_id = users.id
    WHERE faovrites.user_id = $1
    `, [userId])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = { getAllFavoritesForUser, getFavoriteCountForMap, getFavoriteCountForUser, getMostFavorited };
