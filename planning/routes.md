## Routing

## Users
* GET /users
* GET /users/:id    (for profile)
* PATCH /users/:id  (profile updates)
* DELETE /users/:id
* POST /users       (using this for dummy login route)

## Logout
* GET /logout       (logs user out)

## Maps
* GET /maps
* GET /maps/:id
* GET /maps/:id/info
* POST /maps
* PATCH /maps/:id
* DELETE /maps/:id

## Pins
* GET /pins/:map_id
* POST /pins/:map_id
* PATCH /pins/:map_id
* DELETE /pins/:map_id

## Register
* POST /register

## Favourites / Editors
* No routing required. Contained to both GET /users/:id AND GET /maps/:id AND POST /pins/:map_id AND PATCH /pins/:map_id respectively.