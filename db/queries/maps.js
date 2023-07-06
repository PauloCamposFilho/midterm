const db = require('../connection');


///////////////////////////////
////        SELECT         ////
///////////////////////////////

// fetch a map given its id
const getMapWithID = function(mapId) {
  return db
    .query(`
    SELECT maps.*, count(favorites.id) as favorite_count
    FROM maps
    LEFT JOIN favorites ON favorites.map_id = maps.id
    WHERE maps.id = $1
    GROUP BY
    maps.id
    `, [mapId])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      throw new Error(err.message);
    });
};

// fetch all maps made by a given user, with optional limit
const getMapsFromUser = function(userId, limit) {
  const queryParams = [];
  queryParams.push(userId);
  let queryString = `
  SELECT maps.*, count(favorites.*) as favorites
  FROM maps
  JOIN users ON maps.user_id = users.id
  JOIN favorites ON maps.user_id = favorites.user_id
  WHERE maps.user_id = $1
  GROUP BY maps.id
  ORDER BY last_edit DESC
  `;
  if (limit) {
    queryParams.push(limit);
    queryString += `LIMIT $${queryParams.length}`;
  }
  return db
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// Fetch most favorited maps, optionally filtered by a particular user. Limit can be specified, default is 5
const getTopMaps = function (userId, limit) {
  const queryParams = [];
  let queryString = `
  SELECT maps.*, count(favorites.*) as favorites
  FROM favorites
  JOIN maps ON favorites.map_id = maps.id
  JOIN users ON favorites.user_id = users.id
  `;
  if (userId) {
    queryParams.push(userId);
    queryString += `WHERE maps.user_id = $${queryParams.length}`;
  }
  queryString += `
  GROUP BY maps.id
  ORDER BY count(favorites.*) DESC
  `;
  if (limit) {
    queryParams.push(limit);
    queryString += `LIMIT $${queryParams.length}`;
  } else {
    queryString += `LIMIT 5`;
  }
  return db
    .query(queryString, queryParams)
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

// insert new map
const addMap = function(map) {
  const queryString = `
  INSERT INTO maps (
    user_id,
    latitude,
    longitude,
    zoom,
    title,
    thumbnail_photo,
    description,
    last_edit
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING *
  `;
  const values = [
    map["user_id"],
    map["latitude"],
    map["longitude"],
    map["zoom"],
    map["title"],
    map["thumbnail_photo"],
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

///////////////////////////////
////        UPDATE         ////
///////////////////////////////

const updateMap = function (mapId, updates) {
  // console.log("made it in here");
  const columns = [];
  const values = [];
  const parameterizedStrings = [];
  let queryString = `
  UPDATE maps
  SET `;
  for (const column in updates) {
    columns.push(columns)
    values.push(updates[column]);
    parameterizedStrings.push(`${column} = $${values.length}`);
  }
  values.push(mapId);
  queryString += `${parameterizedStrings.join(', ')}
  WHERE id = $${values.length}
  `;
  console.log(values);
  console.log(parameterizedStrings);
  console.log(queryString);
  return db
    .query(queryString, values)
    .then((result) => {
      return result.rowCount > 0;
    })
    .catch((err) => {
      console.log(err.message);
      throw new Error(err.message);
    });
};


///////////////////////////////
////        DELETE         ////
///////////////////////////////

const deleteMap = function(mapId) {
  return db
    .query(`
    DELETE FROM maps WHERE id = $1
    `, [mapId])
    .then((result) => {
      return result.rowCount > 0;
    })
    .catch((err) => {
      console.log(err.message);
    });
};


module.exports = { getMapWithID, getMapsFromUser, addMap, getTopMaps, updateMap, deleteMap };
