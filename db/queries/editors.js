const db = require('../connection');


///////////////////////////////
////        SELECT         ////
///////////////////////////////

// fetch all users with edit permissions for a given map
const getAllEditorsForMap = function(mapId) {
  return db
    .query(`
    SELECT users.*
    FROM editors
    JOIN users ON editors.user_id = users.id
    JOIN maps ON editors.map_id = maps.id
    WHERE maps.id = $1
    `, [mapId])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

///////////////////////////////
////        INSERT         ////
///////////////////////////////

// insert a new favorite
const addEditor = function(mapId, userId) {
  const queryString = `
  INSERT INTO favorites (
    map_id,
    user_id,
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

const removeEditor = function(mapId, userId) {
  return db
    .query(`
    DELETE FROM editors WHERE map_id = $1 AND user_id = $2
    `, [mapId, userId])
    .then((result) => {
      return result.rowCount > 0;
    })
    .catch((err) => {
      console.log(err.message);
    });
};



module.exports = { getAllEditorsForMap, addEditor, removeEditor };
