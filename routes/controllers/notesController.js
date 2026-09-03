const Note = require('../../models/note');

// Small helper: admins see everything, regular users only see their own
// notes. Used by getAllNotes and the ownership checks below.
const isAdmin = (request) => request.userRole === 'admin';

// Shared ownership check used by update/delete/pin/archive/trash/restore.
// Returns the note if the caller is allowed to modify it, otherwise sends
// the appropriate error response and returns null.
const findOwnedNote = async (request, response, id) => {
    const note = await Note.findById(id);
    if (!note) {
        response.status(404).json({ message: 'Note not found' });
        return null;
    }
    if (!isAdmin(request) && note.user.toString() !== request.userId) {
        response.status(403).json({ message: 'You do not have permission to modify this note' });
        return null;
    }
    return note;
};

const notesController = {
    getAllNotes: async (request, response) => {
        try {
            // Was Note.find() with no filter at all — every logged-in user
            // saw every other user's notes. Admins still see everything;
            // regular users only see their own.
            const filter = isAdmin(request) ? {} : { user: request.userId };
            const notes = await Note.find(filter).sort({ pinned: -1, createdAt: -1 });
            response.json({ message: 'get all notes', notes });
        } catch (error) {
            response.status(500).json({ message: 'Internal server error' });
        }
    },
    createNote: async (request, response) => {
        try {
            const { title, description, tag } = request.body;

            const newNote = new Note({
                title,
                description,
                tag,
                user: request.userId, // was missing — notes had no owner at all
            });

            await newNote.save();
            response.status(201).json({ message: 'Note created successfully', note: newNote });
        } catch (error) {
            response.status(500).json({ message: 'Internal server error' });
        }
    },
    updateNote: async (request, response) => {
        try {
            const { id } = request.params;
            const note = await findOwnedNote(request, response, id);
            if (!note) return; // response already sent by findOwnedNote

            // Only touch fields that were actually sent, instead of always
            // overwriting title/description/tag (which previously wiped
            // them out to `undefined` on any partial update).
            const { title, description, tag, pinned, archived, trashed } = request.body;
            if (title !== undefined) note.title = title;
            if (description !== undefined) note.description = description;
            if (tag !== undefined) note.tag = tag;
            if (pinned !== undefined) note.pinned = pinned;
            if (archived !== undefined) note.archived = archived;
            if (trashed !== undefined) note.trashed = trashed;

            await note.save();
            response.status(200).json({ message: 'note updated successfully', note });
        } catch (error) {
            response.status(500).json({ message: 'Internal server error' });
        }
    },
    deleteNote: async (request, response) => {
        try {
            const { id } = request.params;
            const note = await findOwnedNote(request, response, id);
            if (!note) return;

            await note.deleteOne();
            response.json({ message: 'note deleted successfully' });
        } catch (error) {
            response.status(500).json({ message: 'Internal server error' });
        }
    },
    getNoteById: async (request, response) => {
        try {
            const { id } = request.params;
            const note = await findOwnedNote(request, response, id);
            if (!note) return;

            response.json({ note });
        } catch (error) {
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    // PATCH /notes/:id/pin — toggles pinned
    pinNote: async (request, response) => {
        try {
            const note = await findOwnedNote(request, response, request.params.id);
            if (!note) return;

            note.pinned = !note.pinned;
            await note.save();
            response.status(200).json({ message: 'note pin toggled', note });
        } catch (error) {
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    // PATCH /notes/:id/archive
    archiveNote: async (request, response) => {
        try {
            const note = await findOwnedNote(request, response, request.params.id);
            if (!note) return;

            note.archived = true;
            note.trashed = false;
            note.pinned = false;
            await note.save();
            response.status(200).json({ message: 'note archived', note });
        } catch (error) {
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    // PATCH /notes/:id/trash
    trashNote: async (request, response) => {
        try {
            const note = await findOwnedNote(request, response, request.params.id);
            if (!note) return;

            note.trashed = true;
            note.archived = false;
            note.pinned = false;
            await note.save();
            response.status(200).json({ message: 'note moved to trash', note });
        } catch (error) {
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    // PATCH /notes/:id/restore — pulls a note out of Archive or Trash
    restoreNote: async (request, response) => {
        try {
            const note = await findOwnedNote(request, response, request.params.id);
            if (!note) return;

            note.trashed = false;
            note.archived = false;
            await note.save();
            response.status(200).json({ message: 'note restored', note });
        } catch (error) {
            response.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = notesController;
