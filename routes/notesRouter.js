// import express
const express = require('express');
const {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
    pinNote,
    archiveNote,
    trashNote,
    restoreNote,
} = require('./controllers/notesController.js');
const { isAuthenticated, allowRules } = require('../auth.js');


// create a router
const notesRouter = express.Router();

// configure the routes
// All routes just require a logged-in user now — ownership is enforced
// inside the controller (findOwnedNote), which also lets admins manage
// any note. Previously PUT/DELETE were locked to admin-only, so a normal
// user could never edit or delete their own note.
notesRouter.get('/', isAuthenticated, allowRules(['user', 'admin']), getAllNotes);
notesRouter.get('/:id', isAuthenticated, allowRules(['user', 'admin']), getNoteById);
notesRouter.post('/', isAuthenticated, allowRules(['user', 'admin']), createNote);
notesRouter.put('/:id', isAuthenticated, allowRules(['user', 'admin']), updateNote);
notesRouter.delete('/:id', isAuthenticated, allowRules(['user', 'admin']), deleteNote);

// New: dedicated actions for the Pin / Archive / Trash / Restore buttons
// in the frontend, instead of the frontend faking these with local-only
// state (which never persisted).
notesRouter.patch('/:id/pin', isAuthenticated, allowRules(['user', 'admin']), pinNote);
notesRouter.patch('/:id/archive', isAuthenticated, allowRules(['user', 'admin']), archiveNote);
notesRouter.patch('/:id/trash', isAuthenticated, allowRules(['user', 'admin']), trashNote);
notesRouter.patch('/:id/restore', isAuthenticated, allowRules(['user', 'admin']), restoreNote);

// export the router
module.exports = notesRouter;
