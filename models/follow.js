const { model, Schema}=require('mongoose')

const followSchema=new Schema({
    follower:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    following:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

module.exports=model('Follow', followSchema)