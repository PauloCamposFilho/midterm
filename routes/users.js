/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const userQueries = require("../db/queries/users");
const mapQueries = require('../db/queries/maps');
const favoriteQueries = require("../db/queries/favorites");
const pinQueries = require("../db/queries/pins");
const router  = express.Router();

// I'm not sure what this route looks like. Maybe an index of users, formatted like a leaderboard?
router.get('/', (req, res) => {

  res.status(404).send("Not Yet Implemented.");
});

router.get("/favorites", async (req, res) => {
  const _userId = req.session.user_id;
  const templateVars = {};
  templateVars.userId = _userId;
  if (!_userId) { // user not logged in, shouldn't be here. Redirect to /
    return res.redirect("/");
  }
  try {
    templateVars.userInfo = await userQueries.getUserWithId(_userId);
    templateVars.userMaps = await favoriteQueries.getAllFavoritesForUser(_userId);
    return res.status(200).render("favorites", templateVars);
  } catch (err) {
    return res.status(500).send({ statusCode: 500, message: err.message });
  }
});

router.get("/my-maps", async (req, res) => {
  const _userId = req.session.user_id;
  const templateVars = {};
  templateVars.userId = _userId;
  if (!_userId) { // user not logged in, shouldn't be here. Redirect to /
    return res.redirect("/");
  }
  try {
    templateVars.userInfo = await userQueries.getUserWithId(_userId);
    templateVars.userMaps = await mapQueries.getMapsFromUser(_userId, 999999); // I hope to have to change this in the future.
    return res.status(200).render("my-maps", templateVars);
  } catch (err) {
    return res.status(500).send({ statusCode: 500, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  console.log("Yeah, I'm in here...");
  const _userId = req.params.id;
  const templateVars = {};
  templateVars.userId = _userId;
  console.log(_userId);
  try {
    templateVars.userInfo = await userQueries.getUserWithId(_userId);
    templateVars.userMaps = await mapQueries.getMapsFromUser(_userId, 5);
    templateVars.topMaps = await mapQueries.getTopMaps(_userId, 5);
    console.log(templateVars)
    if (_userId) {
      return res.status(200).render("profile", templateVars);
    } else {
      return res.status(500).send("Malformed request. No userId given.");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// update user info
router.patch('/:id', (req, res) => {
  /* const userId = req.params.id;
  const userProperties = ["username", "email", "password", "profile_picture"];
  const updates = {};
  // check which values are being updated
  for (const column of userProperties) {
    for (const property of Object.keys(req.body)) {
      // check whether input field is empty
      if (property === column && req.body[property] !== "") {
        updates[property] = req.body[property];
      }
    }
   }
  // pass updates as an object of column-value pairs
  updateUser(userId, updates)
    .then((success) => {
        if (success) {
          // redirect to updated user page (could be changed to a no-reload implementation later)
          res.redirect(`/users/${userId}`);
        } else {
          res.status(404).send("User not found.");
        }
      });
    })
    .catch((err) => {
      console.log(err.message);
    }); */
  res.status(404).send("Not Yet Implemented.");
});

// delete a user
router.delete('/:id', (req, res) => {
  /* // tie deleteUser input to cookies so that users may only delete their own account
  const userId = req.session["user_id"];
  deleteUser(userId)
    .then((success) => {
      if (success) {
        res.redirect("/register");
      } else {
        res.status(404).send("User not found.");
      }
    })
    .catch((err) => {
      console.log(err.message);
    }); */
  res.status(404).send("Not Yet Implemented.");
});

router.post('/', (req, res) => {
  userQueries.getUserWithId(1) //auto-login as user 1
    .then((result) => {
      if (result) {
        req.session["user_id"] = result["id"];
        return res.redirect("/maps"); // new redirect to /maps
      } else {
        res.status(404).send("User not found.");
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
