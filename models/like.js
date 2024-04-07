const { model, Schema}=require('mongoose')

const likeSchema=new Schema({
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

module.exports=model('Like', likeSchema)