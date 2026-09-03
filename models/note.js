const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    description:{
        type: String,
    },
    tag:{
        type: String,
        enum:['work','personal','study','important','todo','ideas','others'],
        default: 'work'
    },
    // Owner of the note — was missing entirely, which meant getAllNotes()
    // returned every user's notes to whoever was logged in.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    pinned: {
        type: Boolean,
        default: false,
    },
    archived: {
        type: Boolean,
        default: false,
    },
    trashed: {
        type: Boolean,
        default: false,
    },
},{timestamps:true});


module.exports = mongoose.model('Note', noteSchema, 'notes');
