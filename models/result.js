var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ResultSchema = new Schema({
    //activity_id:{type:Number,unique:true},
    activity_id:{type:Number},
    results:[Number],
    create_at:Number
});


mongoose.model('Result', ResultSchema);