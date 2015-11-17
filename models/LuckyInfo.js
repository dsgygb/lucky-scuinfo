var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var LuckyInfoSchema = new Schema({
    activity_id:Number,
    lucky_id:{
     type:Number
    },
    host:{
        user_id:String,
        nickname:String,
        avatar:String,
        create_at:Number,
        open_id:String,
        union_id:String
    },

    friend:{
        user_id:String,
        nickname:String,
        avatar:String,
        create_at:Number,
        open_id:String,
        union_id:String
    },
    create_at:Number
});




mongoose.model('LuckyInfo', LuckyInfoSchema);