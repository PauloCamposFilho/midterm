const db = require('../connection');


///////////////////////////////
////        SELECT         ////
///////////////////////////////

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
    SELECT count(favorites.*)
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
    WHERE maps.user_id = $1
    GROUP BY maps.id
    ORDER BY count(favorites.*) DESC
    LIMIT 1
    `, [userId])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};


///////////////////////////////
////        INSERT         ////
///////////////////////////////

// insert a new favorite
const addFavorite = function(mapId, userId) {
  const queryString = `
  INSERT INTO favorites (
    map_id,
    user_id
  )
  VALUES ($1, $2)
  RETURNING *
  `;
  const values = [
    mapId,
    userId,
  ];
  return db
    .query(queryString, values)
    .then((result) => {
      return result.rowCount > 0;
    })
    .catch((err) => {
      console.log(err.message);
    });
};


///////////////////////////////
////        DELETE         ////
///////////////////////////////

const deleteFavorite = function(mapId, userId) {
  return db
    .query(`
    DELETE FROM favorites WHERE map_id = $1 AND user_id = $2
    `, [mapId, userId])
    .then((result) => {
      return result.rowCount > 0;
    })
    .catch((err) => {
      console.log(err.message);
    });
};



module.exports = { getAllFavoritesForUser, getFavoriteCountForMap, getFavoriteCountForUser, getMostFavorited, addFavorite, deleteFavorite };
