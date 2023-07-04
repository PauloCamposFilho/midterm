/*
 * All routes for registration are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { getMapWithID } = require('../db/queries/maps');
const { addEditor } = require('../db/queries/editors');
const router  = express.Router();

router.post('/', (req, res) => {
  /* const userId = req.session["user_id"];
  const mapId = req.body["mapId"];
  const newEditor = req.body["userId"];
  getMapWithID(mapId)
    .then((result) => {
      if (result["userId"] === userId) {
        addEditor(mapId, newEditor)
          .then((success) => {
            if (success) {
              res.redirect(`maps/${mapId}`); // redirection may not be the desired behaviour, placeholder
            } else {
              res.status(404).send("Unable to add new editor");
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else {
        res.status(401).send("Only the owner of a map may add new editors");
      }
    })
    .catch((err) => {
      console.log(err.message);
    }); */
  res.status(404).send("Not Yet Implemented.");
});

module.exports = router;
