/*
 * All routes for Logout are defined here
 * Since this file is loaded in server.js into /logout,
 *   these routes are mounted onto /logout
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  req.session["user_id"] = null; // remove the session cookie.
  res.redirect('/maps/1'); // placeholder. redirects to map 1 for now until we sort the home/index page.
});

module.exports = router;