/*
 * All routes for registration are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const favoriteQueries = require('../db/queries/favorites');
const router  = express.Router();

router.post('/', async (req, res) => {
  const userId = req.session.user_id;
  const mapId = req.body.mapId;
  if (!userId || mapId) { // user not logged in
    return res.status(400).send("Malformed request. Missing parameters.");
  }
  try {
    const addFavoriteResponse = await favoriteQueries.addFavorite(mapId, userId);
    return res.status(200).send({ statusCode: 200, message: "Map has been favorited successfully." });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.delete("/", async (req, res) => {
  const userId = req.session.user_id;
  const mapId = req.body.mapId;
  if (!userId || mapId) { // user not logged in
    return res.status(400).send("Malformed request. Missing parameters.");
  }
  try {
    const removeFavoriteResponse = await favoriteQueries.deleteFavorite(mapId, userId);
    return res.status(200).send({ statusCode: 200, message: "Map has been favorited successfully." });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});
module.exports = router;
