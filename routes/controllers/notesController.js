const Note = require('../../models/note');

const notesController = {
    getAllNotes:async(request, response) => {
        try {
            const notes=await Note.find();
            response.json({ message: 'get all notes', notes });
        }
        catch (error) {
            response.status(500).json({ message: 'Internal server error' });
        }
    },
    createNote: async (request, response) => {
        try {
            const { title, description, tag } = request.body;

            const newNote = new Note({
                title,
                description,
                tag
            });

            await newNote.save();
            response.status(201).json({ message: 'Note created successfully', note: newNote });
        } catch (error) {
            response.status(500).json({ message: 'Internal server error' });
        }
    },
    updateNote: async (request, response) => {
        try {
            const {id}=request.params;
            const {title,description,tag}=request.body;

            const noteToUpdate=await Note.find({tag});
            noteToUpdate[0].title=title;
            await noteToUpdate.save()
            //await  Note.findByIdAndUpdate(id,{title,description,tag});

            response.status(200).json({
                message:"note updated successfully"
            })
            
        } catch (error) {
            response.status(500).json({ message: 'Internal server error' });
        }
        
    },
    deleteNote: async (request, response) => {
        try {
            const {id} =request.params;
            const{title, description,tag}=request.body;

            await Note.findByIdandDelete(id);

            response.json({
                message:"note deleted successfully"
            })
            
        } catch (error) {
            response.status(500).json({ message: 'Internal server error' });
        }
        
    },
    getNoteById: async(requst, response)=>{
        try {
            const {id}=request.params;

            await Note.findById(id)
            
        } catch (error) {
            response.status(500).json({ message: 'Internal server error' });
        }
        
    }
};

module.exports = notesController;