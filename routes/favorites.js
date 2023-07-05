/*
 * All routes for registration are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { addFavorite } = require('../db/queries/favorites');
const router  = express.Router();

router.post('/', (req, res) => {
  /* const userId = req.session["user_id"];
  const mapId = req.body["mapId"];
  addFavorite(mapId, userId)
    .then((success) => {
      if (success) {
        res.redirect(`/map/${mapId}`); // redirection may not be the desired behaviour, placeholder
      } else {
        res.status(404).send("Unable to add map to favorites");
      }
    })
    .catch((err) => {
      console.log(err.message);
    }); */
  res.status(404).send("Not Yet Implemented.");
});

module.exports = router;
