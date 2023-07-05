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
const objHelpers = require("../helpers/objectBuilder");

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

router.post('/', async (req, res) => {
  console.log("Entered the POST maps/ route");
  if (req.body) {
    // const _mapObj = {
    //   title: req.body.mapInfo.title,
    //   description: req.body.mapInfo.description,
    //   thumbnail_photo: req.body.mapInfo.thumbnail_photo,
    //   latitude: req.body.mapInfo.latitude,
    //   longitude: req.body.mapInfo.longitude,
    //   zoom: req.body.mapInfo.zoom,
    //   last_edit: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
    // }
    const _mapObj = objHelpers.buildMapObjectFromMapInfo(req.body.mapInfo, true);
    try {
      const insertMapResponse = await queries.addMap(_mapObj);
      _mapObj.id = insertMapResponse.id;
      for (const pin in req.body.markerInfo) {
        // const _markerObj = {
        //   map_id: _mapObj.id,
        //   title: req.body.markerInfo[pin].title,
        //   description: req.body.markerInfo[pin].description,
        //   latitude: req.body.markerInfo[pin].latitude,
        //   longitude: req.body.markerInfo[pin].longitude
        // }
        const _markerObj = objHelpers.buildMarkerObjectFromMarkerInfo(req.body.markerInfo[pin], _mapObj.id);
        const insertPinResponse = await pinQueries.addPin(_markerObj);
      }
    }
    catch(err) {
      return res.status(500).send(err.message);
    }
    // queries
    //   .addMap(_mapObj)
    //   .then((response) => {
    //     console.log("--- MAP INSERTED ---");
    //     console.log(response);
    //     _mapObj.id = response.id;
    //     console.log("--------------------");
    //     for (const pin in req.body.markerInfo) {
    //       const _markerObj = {
    //         map_id: _mapObj.id,
    //         title: req.body.markerInfo[pin].title,
    //         description: req.body.markerInfo[pin].description,
    //         latitude: req.body.markerInfo[pin].latitude,
    //         longitude: req.body.markerInfo[pin].longitude
    //       }
    //       console.log(_markerObj);
    //       pinQueries
    //         .addPin(_markerObj)
    //         .catch((err) => {
    //           return res.status(500).send(err.message);
    //         });
    //     }
    //   })
    //   .then(() => {
    //     return res.status(200).send("Map and Pin information created.");
    //   })
    //   .catch((err) => {
    //     return res.status(500).send(err.message);
    //   });
  } else {
    res.status(400).send("Malformed request. Missing map/marker info");
  }
});

router.patch('/:id', async (req, res) => {
  console.log('Entered the PATCH maps/:id route');
  if (req.body) {
    const _mapId = req.body.mapInfo.id;
    // const _mapObj = {
    //   title: req.body.mapInfo.title,
    //   description: req.body.mapInfo.description,
    //   thumbnail_photo: req.body.mapInfo.thumbnail_photo,
    //   latitude: req.body.mapInfo.latitude,
    //   longitude: req.body.mapInfo.longitude,
    //   zoom: req.body.mapInfo.zoom
    // };
    const _mapObj = objHelpers.buildMapObjectFromMapInfo(req.body.mapInfo);
    try {
      const updateResponse = await queries.updateMap(_mapId, _mapObj);
      const deleteResponse = await pinQueries.deletePinsWithMapId(_mapId);
      for (const pin in req.body.markerInfo) {
        // const _markerObj = {
        //   map_id: _mapId,
        //   title: req.body.markerInfo[pin].title,
        //   description: req.body.markerInfo[pin].description,
        //   latitude: req.body.markerInfo[pin].latitude,
        //   longitude: req.body.markerInfo[pin].longitude
        // };
        const _markerObj = objHelpers.buildMarkerObjectFromMarkerInfo(req.body.markerInfo[pin], _mapId);
        const pinInsertResponse = await pinQueries.addPin(_markerObj);        
      }
      return res.status(200).send("Map and Pin information edited.");
    }
    catch(err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
    // queries
    //   .updateMap(_mapId, _mapObj)
    //   .then(() => {
    //     pinQueries
    //       .deletePinsWithMapId(_mapId)
    //       .then(() => {
    //         for (const pin in req.body.markerInfo) {
    //           const _markerObj = {
    //             map_id: _mapId,
    //             title: req.body.markerInfo[pin].title,
    //             description: req.body.markerInfo[pin].description,
    //             latitude: req.body.markerInfo[pin].latitude,
    //             longitude: req.body.markerInfo[pin].longitude
    //           };
    //           console.log(_markerObj);
    //           pinQueries
    //             .addPin(_markerObj)
    //             .catch((err) => {
    //               return res.status(500).send(err.message);
    //             });
    //         }
    //       })
    //       .catch((err) => {
    //         return res.status(500).send(err.message);
    //       });        
    //   })
    //   .then(() => {
    //     return res.status(200).send("Map and Pin information updated.");
    //   })
    //   .catch((err) => {
    //     return res.status(500).send(err.message);
    //   });
  } else {
    res.status(400).send("Malformed request. Missing map/marker info");
  }
});
router.delete('/:id', (req, res) => {
  // res.render('users');
  res.status(404).send("Not Yet Implemented.");
});

module.exports = router;
