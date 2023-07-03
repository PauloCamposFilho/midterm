/*
 * All routes for registration are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

router.post('/', (req, res) => {
  // res.render('users');
  res.status(404).send("Not Yet Implemented.");
});

module.exports = router;