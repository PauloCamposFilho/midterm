// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));
app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2"]
}));

// Index of query functions
const queries = require('./db/queries');

// Resource Routes
const usersRoutes = require('./routes/users');
const mapsRoutes = require('./routes/maps');
const pinsRoutes = require('./routes/pins');
const favoritesRoutes = require('./routes/favorites');
const editorsRoutes = require('./routes/editors');
const registerRoutes = require('./routes/register');
const logoutRoutes = require("./routes/logout");

// Mount all resource routes
app.use('/users', usersRoutes);
app.use('/maps', mapsRoutes);
app.use('/pins', pinsRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/editors', editorsRoutes);
app.use("/register", registerRoutes);
app.use("/logout", logoutRoutes);

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  // res.render('index');
  res.redirect("/maps");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


///////////////////////////////
//// TEMPLATE BOILERPLATE  ////
///////////////////////////////

// ROUTING
// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
// const userApiRoutes = require('./routes/users-api');
// const widgetApiRoutes = require('./routes/widgets-api');
// const usersRoutes = require('./routes/users');

// MOUNTING
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
// app.use('/api/users', userApiRoutes);
// app.use('/api/widgets', widgetApiRoutes);
// Note: mount other resources here, using the same pattern above
