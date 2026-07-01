// import express into the app
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');
const errorRoute = require('./errorRoute');

// create an express application
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use the middleware
app.use(logger);

app.use('/notes', require('./routes/notesRouter'));

app.use(errorRoute);

// export the express app
module.exports = app;