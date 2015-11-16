var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var LuckySchema = new Schema({
    _id: {type: String ,index: true},
    lucky_id:{type:Number,default:100000},
    create_at:Number
});


mongoose.model('Lucky', LuckySchema);