const db = require('../connection');

// fetch a map given its id
const getMapWithID = function(mapId) {
  return db
    .query(`
    SELECT *
    FROM maps
    WHERE id = $1
    `, [mapId])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// fetch all maps made by a given user
const getMapsFromUser = function(userId) {
  return db
    .query(`
    SELECT maps.*
    FROM maps
    JOIN users ON user_id = users.id
    WHERE user_id = $1
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

// insert new pin
const addMap = function(map) {
  const queryString = `
  INSERT INTO pins (
    user_id,
    title,
    description,
    last_edit
  )
  VALUES ($1, $2, $3, $4)
  RETURNING *
  `;
  const values = [
    map["user_id"],
    map["title"],
    map["description"],
    map["last_edit"],
  ];
  return db
    .query(queryString, values)
    .then((result) => {
      return (result.rows[0]);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = { getMapWithID, getMapsFromUser, addMap };
