const db = require('../connection');

// fetch all users with edit permissions for a given map
const getAllEditorsForMap = function(mapId) {
  return db
    .query(`
    SELECT users.*
    FROM editors
    JOIN users ON editors.user_id = users.id
    JOIN maps ON editors.map_id = maps.id
    WHERE maps.id = $1
    `, [mapId]);
};

module.exports = { getAllEditorsForMap };
