var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var StatSchema = new Schema({
    _id: {type: String ,index: true},
    views:{type:Number,default:0},
    groups:{type:Number,default:0},
    lucky_time:{type:Number,default:1473350400},
    create_at:Number
});
mongoose.model('Stat', StatSchema);
