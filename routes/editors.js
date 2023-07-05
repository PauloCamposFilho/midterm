/*
 * All routes for registration are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const mapQueries = require('../db/queries/maps');
const editorQueries = require('../db/queries/editors');
const userQueries = require('../db/queries/users');
const router  = express.Router();

router.post('/', async (req, res) => {
  const userId = req.session["user_id"];
  const mapId = req.body["mapId"];
  const newEditor = req.body["editorId"];
  if (!userId || !mapId || !newEditor) {
    return res.status(400).send("Malformed request. Missing parameters");
  }
  try {
    const mapOwnerId = await mapQueries.getMapWithID(mapId).user_id;
    if (mapOwnerId === userId) {
      const addEditorResponse = await editorQueries.addEditor(mapId, newEditor);
      const editorUser = await userQueries.getUserWithId(newEditor);
      return res.status(200).send({ user: editorUser, statusCode: 200 });
    } 
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
