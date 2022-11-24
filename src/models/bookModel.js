const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        //uppercase: true,
    },
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        refs: 'newusers'
    },
    ISBN: {
        type: String,
        requireed: true,
        trim: true,
        unique: true
    },
    category: {
        type: String,
        trim: true,
       
    },
   
    deletedAt: {
        type: Date,
        default: null,
        
    },
       isDeleted: {
        type: Boolean,
        default: false,
        trim: true
    }
    



}, { timestamps: true })
module.exports = mongoose.model('books', bookSchema)