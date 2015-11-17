var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var NoticeSchema = new Schema({
    activity_id:{type:Number},
    open_id:String,
    create_at:Number,
    update_at:Number,
    union_id:String,
    user_id:String,
    status:Boolean,
    nickname:String,
    counts:{type:Number,default:0},
    log:String
});


mongoose.model('Notice', NoticeSchema);