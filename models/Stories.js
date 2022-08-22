const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    user:{
        type: mongoose.Schema.type.ObjectId,
        ref:'user'
    },
    title:{
        type: String , 
        required: true
    },
    description:{
        type:String,
        required:true
    },
    tag:{
        type:String ,
        default:null
    }
})

const Post = mongoose.model('post',PostSchema);
module.exports = Post;