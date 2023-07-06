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
  console.log("Made it to POST /editors")
  console.log(req.body);
  if (!userId || !mapId || !newEditor) {
    return res.status(400).send("Malformed request. Missing parameters");
  }
  try {
    console.log("In the TRY block");
    const _mapInfo = await mapQueries.getMapWithID(mapId);
    if (_mapInfo.user_id === userId) {
      const addEditorResponse = await editorQueries.addEditor(mapId, newEditor);
      const editorUser = await userQueries.getUserWithId(newEditor);
      return res.status(200).send({ user: editorUser, statusCode: 200 });
    }
    return res.status(401).send({ statusCode: 400, message: "Unauthorized. You do not own this map." });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.delete("/", async (req, res) => {
  const userId = req.session["user_id"];
  const mapId = Number(req.body["mapId"]);
  const editorId = Number(req.body["editorId"]);
  console.log("Made it to DELETE /editors");
  console.log("req.body", req.body);
  console.log("userId", userId);
  console.log("editorId", editorId);
  
  if (!userId || !mapId || !editorId) {
    return res.status(400).send("Malformed request. Missing parameters");
  }  
  try {
    const _mapInfo = await mapQueries.getMapWithID(mapId);
    console.log("_mapInfo.user_id", _mapInfo.user_id);
    if (_mapInfo.user_id == userId) { // checks that user has permission to do this action.
      console.log("made it into the first if");
      if (_mapInfo.user_id == editorId) { // trying to remove the map creator as an editor. Never allowed.        
        return res.status(401).send({ statusCode: 401, message: "Unauthorized. You cannot remove editing permissions from a map creator. "});
      }
      const deleteEditorResponse = await editorQueries.removeEditor(mapId, editorId);
      return res.status(200).send({ statusCode: 200 });
    }
    return res.status(401).send({ statusCode: 400, message: "Unauthorized. You do not own this map." });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
