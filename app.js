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
app.use(cors({origin:'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE'],
    allowHeaders:['content-Type','Authorization'],
    credentials:true
}));

// use the middleware
app.use(logger);


app.use('/api/notes', require('./routes/notesRouter'));
app.use('/auth', authRouter);
app.use(errorRoute);

// export the express app
module.exports = app;