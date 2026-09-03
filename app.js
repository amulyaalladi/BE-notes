// import express into the app
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');
const errorRoute = require('./routes/errorRoute');
const authRouter = require('./routes/authRouter');
const cookieParser = require('cookie-parser');
const cors=require('cors');

// create an express application
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:5173',
  'https://project1notesapp.netlify.app'
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
// use the middleware
app.use(logger);


app.use('/notes', require('./routes/notesRouter'));
app.use('/auth', authRouter);
app.use(errorRoute);

// export the express app
module.exports = app;