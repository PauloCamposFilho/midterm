const db = require('../connection');


///////////////////////////////
////        SELECT         ////
///////////////////////////////

// fetch pins for a map given its id
const getAllPinsForMap = function(mapId) {
  return db
    .query(`
    SELECT *
    FROM pins
    WHERE map_id = $1
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

// insert new pin
const addPin = function(pin) {
  const queryString = `
  INSERT INTO pins (
    map_id,
    latitude,
    longitude,
    title,
    description,
    image
  )
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *
  `;
  const values = [
    pin["map_id"],
    pin["latitude"],
    pin["longitude"],
    pin["title"],
    pin["description"],
    pin["image"],
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

const updatePin = function (pinId, updates) {
  const values = [];
  const parameterizedStrings = [];
  let queryString = `
  UPDATE pins
  SET `;
  for (const column in updates) {
    values.push(column, updates[column]);
    parameterizedStrings.push(`$${values.length - 1} = $${values.length}, `);
  }
  values.push(pinId);
  queryString += `${parameterizedStrings.join(', ')}
  WHERE id = $${values.length}
  `;
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

const deletePin = function(pinId) {
  return db
    .query(`
    DELETE FROM pins WHERE id = $1
    `, [pinId])
    .then((result) => {
      return result.rowCount > 0;
    })
    .catch((err) => {
      console.log(err.message);
    });
};


module.exports = { getAllPinsForMap, addPin, updatePin, deletePin };
