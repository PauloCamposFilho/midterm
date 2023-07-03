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
const addEditor = function(editor) {
  const queryString = `
  INSERT INTO favorites (
    map_id,
    user_id,
  )
  VALUES ($1, $2)
  RETURNING *
  `;
  const values = [
    editor["map_id"],
    editor["user_id"],
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


module.exports = { getAllEditorsForMap, addEditor };
