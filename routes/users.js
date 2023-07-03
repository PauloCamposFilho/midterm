/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { getUserWithId } = require('../db/queries/users');
const router  = express.Router();

router.get('/', (req, res) => {

  res.status(404).send("Not Yet Implemented.");
});

router.get('/:id', (req, res) => {
  /* const userId = req.params.id;
  getUserWithId(userId)
    .then(user => {
      if (user) {
        const templateVars = {}; // template variables tbd
        res.render("userProfile", templateVars); //userProfile is stand-in for correct view
      } else {
        res.status(404).send("User not found.");
      }
    }); */
  res.status(404).send("Not Yet Implemented.");
});

router.patch('/:id', (req, res) => {
  // res.render('users');
  res.status(404).send("Not Yet Implemented.");
});

router.delete('/:id', (req, res) => {
  // res.render('users');
  res.status(404).send("Not Yet Implemented.");
});

router.post('/', (req, res) => {
  // res.render('users');
  res.status(404).send("Not Yet Implemented.");
});

module.exports = router;
