/*
 * All routes for Maps are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const queries = require('../db/queries/maps');
const pinQueries = require("../db/queries/pins");
const userQueries = require("../db/queries/users");
const editorQueries = require("../db/queries/editors");
const favoriteQueries = require("../db/queries/favorites");
const objHelpers = require("../helpers/objectBuilder");

router.get('/', async (req, res) => {
  const templateVars = {};
  try {
    if (req.session.user_id) {
      templateVars.userId = req.session.user_id;
      templateVars.user = await userQueries.getUserWithId(templateVars.userId);
      templateVars.userMaps = await queries.getMapsFromUser(templateVars.userId);
    }
    templateVars.maps = await queries.getTopMaps(null, 5);
    return res.render("maps", templateVars);
  } catch (err) {
    return res.status(500).send({ statusCode: 500, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const _mapId = req.params.id;
  const templateVars = {};
  templateVars.mapId = _mapId;
  templateVars.userId = req.session["user_id"];
  templateVars.userOwnsMap = false;

  if (!_mapId) { // no mapId? Shouldnt even be in here.
    return res.status(500).send("Malformed request. No mapId given.");
  }

  try {
    templateVars.users = await userQueries.getAllUsers();
    const mapInfo = await queries.getMapWithID(_mapId);
    if (mapInfo) {
      mapInfo.editors = await editorQueries.getAllEditorsForMap(_mapId);
      templateVars.userOwnsMap = templateVars.userId === mapInfo.user_id;
      const currentUserFavoriteMaps = await favoriteQueries.getAllFavoritesForUser(templateVars.userId);
      // console.log("---- userfavoritemaps ----");
      // console.log(currentUserFavoriteMaps);
      // console.log("---- end of userfavoritemaps ----");
      mapInfo.isUserFavorite = currentUserFavoriteMaps.some((maps) => { return maps.id === Number(_mapId); });
    }
    templateVars.mapInfo = mapInfo;
    console.log(mapInfo);
    return res.status(200).render("map", templateVars);
  } catch(err) {
    return res.status(500).send(err.message);
  }
});

router.get('/:id/info', async (req, res) => {
  const _mapId = req.params.id;
  try {
    const mapInfo = await queries.getMapWithID(_mapId);
    const markerInfo = await pinQueries.getAllPinsForMap(_mapId);
    return res.status(200).send({ mapInfo, markerInfo });
  }
  catch(err) {
    return res.status(500).send(err.message);
  }
});

router.post('/', async (req, res) => {
  console.log("Entered the POST maps/ route");
  if (!req.session.user_id) {
    return res.status(400).send("User must be logged in to create a map.");
  }
  if (req.body) {
    const _mapObj = objHelpers.buildMapObjectFromMapInfo(req.body.mapInfo, true);
    _mapObj.user_id = req.session.user_id; // logged in user created this map.
    try {
      const insertMapResponse = await queries.addMap(_mapObj);
      const editorInsertResponse = await editorQueries.addEditor(insertMapResponse.id, _mapObj.user_id); // add as editor to own map.
      _mapObj.id = insertMapResponse.id;
      for (const pin in req.body.markerInfo) {
        const _markerObj = objHelpers.buildMarkerObjectFromMarkerInfo(req.body.markerInfo[pin], _mapObj.id);
        const insertPinResponse = await pinQueries.addPin(_markerObj);
      }
      return res.status(200).send({ mapId: _mapObj.id, statusCode: 200, message: "Map and Pin information edited"});
    }
    catch(err) {
      return res.status(500).send(err.message);
    }
  } else {
    res.status(400).send("Malformed request. Missing map/marker info");
  }
});

router.patch('/:id', async (req, res) => {
  console.log('Entered the PATCH maps/:id route');
  if (req.body) {
    const _mapId = req.body.mapInfo.id;
    const _mapObj = objHelpers.buildMapObjectFromMapInfo(req.body.mapInfo, true);
    try {
      const updateResponse = await queries.updateMap(_mapId, _mapObj);
      const deleteResponse = await pinQueries.deletePinsWithMapId(_mapId);
      for (const pin in req.body.markerInfo) {
        const _markerObj = objHelpers.buildMarkerObjectFromMarkerInfo(req.body.markerInfo[pin], _mapId);
        const pinInsertResponse = await pinQueries.addPin(_markerObj);
      }
      return res.status(200).send("Map and Pin information edited.");
    }
    catch(err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
  } else {
    res.status(400).send("Malformed request. Missing map/marker info");
  }
});

router.delete('/:id', (req, res) => {
  // res.render('users');
  res.status(404).send("Not Yet Implemented.");
});

module.exports = router;
