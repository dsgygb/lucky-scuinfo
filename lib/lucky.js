'use strict';

var mongoose = require('mongoose');
let LuckyModel = mongoose.model('Lucky');
let Lucky = {

};


Lucky.generate =  function(keyId,callback){
    LuckyModel.findById(keyId,function(err,doc){
        if(!err && !doc){
            var obj = {};
            obj._id = keyId;
            var keys = new LuckyModel(obj);
            keys.save(function(err,doc){
                if(err){
                    callback(err);
                    return;
                }
                callback(null,doc.lucky_id);
            })
        }else{
            LuckyModel.findByIdAndUpdate(keyId,{$inc:{lucky_id: 1}},
                function(err,doc){
                    if(err){
                        callback(err);
                        return;
                    }
                    callback(null,doc.lucky_id);
                })
        }
    });
};


module.exports = Lucky;