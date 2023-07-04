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

router.get('/', (req, res) => {
  // res.render('users');  )
  res.status(404).send("Not Yet Implemented.");
});
router.get('/:id', (req, res) => {
  // res.render('users');
  const _mapId = req.params.id;
  const templateVars = {};
  templateVars.mapId = _mapId;
  if (_mapId) {
    return res.status(200).render("map", templateVars);
  } else {
    return res.status(500).send("Malformed request. No mapId given.");
  }
});
router.get('/:id/info', (req, res) => {
  const _mapId = req.params.id;
  let mapInfo;
  let markerInfo;
  console.log("mapId", _mapId);

  queries.getMapWithID(_mapId)
    .then((response) => {
      mapInfo = response;
      pinQueries.getAllPinsForMap(_mapId)
        .then((pinResponse) => {
          markerInfo = pinResponse;
          return res.status(200).send({ mapInfo, markerInfo});
        })
        .catch((err) => {
          return res.status(500).send(err);
        });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

router.post('/', (req, res) => {
  // res.render('users');
  res.status(404).send("Not Yet Implemented.");
});

router.patch('/:id', (req, res) => {
  console.log('Entered the PATCH maps/:id route');
  if (req.body) {
    const _mapId = req.body.mapInfo.id;
    const _mapObj = {
      title: req.body.mapInfo.title,
      description: req.body.mapInfo.description,
      latitude: req.body.mapInfo.latitude,
      longitude: req.body.mapInfo.longitude,
      zoom: req.body.mapInfo.zoom
    };
    queries
      .updateMap(_mapId, _mapObj)
      .then(() => {
        for (const pin in req.body.markerInfo) {
          const _markerObj = {
            title: req.body.markerInfo[pin].title,
            description: req.body.markerInfo[pin].description,
            latitude: req.body.markerInfo[pin].latitude,
            longitude: req.body.markerInfo[pin].longitude
          };
          console.log(_markerObj);
          pinQueries
            .updatePin(req.body.markerInfo[pin].id, _markerObj)
            .catch((err) => {
              return res.status(500).send(err.message);
            });
        }
      })
      .then(() => {
        return res.status(200).send("Map and Pin information updated.");
      })
      .catch((err) => {
        return res.status(500).send(err.message);
      });
  }
});
router.delete('/:id', (req, res) => {
  // res.render('users');
  res.status(404).send("Not Yet Implemented.");
});

module.exports = router;
