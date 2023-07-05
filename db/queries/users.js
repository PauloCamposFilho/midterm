const db = require('../connection');


///////////////////////////////
////        SELECT         ////
///////////////////////////////

// for use with user login
const getUserWithEmail = function(email) {
  return db
    .query(`
    SELECT *
    FROM users
    WHERE email = $1
    `, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// for use with cookies to fetch user info for profile rendering
const getUserWithId = function(userId) {
  return db
    .query(`
    SELECT * FROM users
    WHERE id = $1
    `, [userId])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getAllUsers = () => {
  const queryString = `SELECT * FROM users`;
  return db
    .query(queryString)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message)
      throw new Error(err);
    });
};


///////////////////////////////
////        INSERT         ////
///////////////////////////////

// insert a new user
const addUser = function(user) {
  const queryString = `
  INSERT INTO users (
    username,
    email,
    password,
    profile_picture
  )
  VALUES ($1, $2, $3, $4)
  RETURNING *
  `;
  const values = [
    user["username"],
    user["email"],
    user["password"],
    user["profile_picture"],
  ];
  return db
    .query(queryString, values)
    .then((result) => {
      return result.rows[0]["id"];
    })
    .catch((err) => {
      console.log(err.message);
    });
};


///////////////////////////////
////        UPDATE         ////
///////////////////////////////

const updateUser = function (userId, updates) {
  const values = [];
  const parameterizedStrings = [];
  let queryString = `
  UPDATE users
  SET `;
  for (const column in updates) {
    values.push(column, updates[column]);
    parameterizedStrings.push(`$${values.length - 1} = $${values.length}, `);
  }
  values.push(userId);
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

const deleteUser = function(userId) {
  return db
    .query(`
    DELETE FROM users WHERE id = $1
    `, [userId])
    .then((result) => {
      return result.rowCount > 0;
    })
    .catch((err) => {
      console.log(err.message);
    });
};


module.exports = { getUserWithEmail, getUserWithId, addUser, updateUser, deleteUser, getAllUsers };
