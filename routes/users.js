/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { getUserWithId, updateUser, getUserWithEmail } = require('../db/queries/users');
const router  = express.Router();

// I'm not sure what this route looks like. Maybe an index of users, formatted like a leaderboard?
router.get('/', (req, res) => {

  res.status(404).send("Not Yet Implemented.");
});

router.get('/:id', (req, res) => {
  /* const userId = req.params.id;
  getUserWithId(userId)
    .then((user) => {
      if (user) {
        const templateVars = {}; // template variables tbd
        res.render("userProfile", templateVars); //userProfile is stand-in for correct view
      } else {
        res.status(404).send("User not found.");
      }
    })
    .catch((err) => {
      console.log(err.message);
    }); */
  res.status(404).send("Not Yet Implemented.");
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
  /* const email = req.body["email"];
  getUserWithEmail(email)
    .then((result) => {
      if (result) {
        req.session["user_id"] = result["id"];
      } else {
        res.status(404).send("User not found.");
      }
    })
    .catch((err) => {
      console.log(err.message);
    }); */
  res.status(404).send("Not Yet Implemented.");
});

module.exports = router;
