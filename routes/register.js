/*
 * All routes for registration are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { addUser } = require('../db/queries/users');
const router  = express.Router();

router.post('/', (req, res) => {
  const user = {
    username: req.body["username"],
    email: req.body["email"],
    password: req.body["password"],
    profile_picture: req.body["profile_picture"],
  };
  addUser(user)
    .then((result) => {
      if (result) {
        req.session["user_id"] = result["id"];
        res.redirect("/");
      } else {
        res.status(400).send("Failed to create user.");
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
  res.status(404).send("Not Yet Implemented.");
});

module.exports = router;
