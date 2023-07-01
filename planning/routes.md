## Routing

## Users
* GET /users
* GET /users/:id    (for profile / login)
* PATCH /users/:id  (profile updates)
* DELETE /users/:id
* POST /users

## Maps
* GET /maps
* GET /maps/:id
* POST /maps
* PATCH /maps/:id
* DELETE /maps/:id

## Pins
* GET /pins/:map_id
* POST /pins/:map_id
* PATCH /pins/:map_id
* DELETE /pins/:map_id

## Favourites / Editors
* No routing required. Contained to both GET /users/:id AND GET /maps/:id AND POST /pins/:map_id AND PATCH /pins/:map_id respectively.