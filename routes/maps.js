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
  let mapInfo;
  let pinInfo;
  console.log("mapId", _mapId);

  queries.getMapWithID(_mapId)
    .then((response) => {
      mapInfo = response;
      pinQueries.getAllPinsForMap(_mapId)
        .then((pinResponse) => {
          pinInfo = pinResponse;
          console.log(pinInfo);
          res.status(200).send({ mapInfo, pinInfo});
        })
        .catch((err) => {
          console.log(err.message);
        });
    })
    .catch((err) => {
      console.log(err.message);
    });  
  //res.status(404).send("Not Yet Implemented.");
});
router.post('/', (req, res) => {
  // res.render('users');
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

module.exports = router;
