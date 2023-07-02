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
      return (result.rows[0]);
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
      return (result.rows[0]);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = { getUserWithEmail, getUserWithId, addUser };
