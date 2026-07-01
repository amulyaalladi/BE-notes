// import express
const express = require('express');
const { getAllNotes, createNote, updateNote, deleteNote, getNoteById } = require('./controllers/notesController.js');

// create a router
const notesRouter = express.Router();

// configure the routes
notesRouter.get('/', getAllNotes);
notesRouter.get('/:id',getNoteById)
notesRouter.post('/', createNote);
notesRouter.put('/:id', updateNote);
notesRouter.delete('/:id', deleteNote);

// export the router
module.exports = notesRouter;