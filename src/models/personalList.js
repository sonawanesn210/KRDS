/* const mongoose =require('mongoose')
const ObjectId =mongoose.Schema.Types.ObjectId

const likeSchema = new mongoose.Schema({
    likedBy:{
        type:ObjectId,
        ref:'krdsuser',
        unique:true,
        required:true
    },
    bookLiked:[{
        ref:'krdsuser',
        unique:true,
        required:true
    }]
        
    
})

module.exports = mongoose.model("krdslike", likeSchema); */
