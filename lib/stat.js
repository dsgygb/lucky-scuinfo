'use strict';

var mongoose = require('mongoose');
let StatModel = mongoose.model('Stat');
let Stat = {

};


Stat.inc =  function(keyId,fields,callback){
    StatModel.findById(keyId,function(err,doc){
        if(!err && !doc){
            var obj = {};
            obj._id = keyId;
            var keys = new StatModel(obj);
            keys.save(function(err,doc){
                if(err){
                    callback(err);
                    return;
                }
                callback(null,doc.Stat_id);
            })
        }else{

            let fieldArr = fields.split(',');


let views=false,groups=false;


            for(let i=0;i<fieldArr.length;i++){
                if(fieldArr[i]==='views'){
                    views=true;
                }else if(fieldArr[i]==='groups'){
                    groups = true;
                }
            }

            if(views && groups){
                StatModel.findByIdAndUpdate(keyId,{$inc:{views: 1,groups:1},$set:{lucky_time:1447768800}},
                    function(err,doc){
                        if(err){
                            callback(err);
                            return;
                        }
                        callback(null,doc);
                    });
            }else if(views){
                StatModel.findByIdAndUpdate(keyId,{$inc:{views: 1}},
                    function(err,doc){
                        if(err){
                            callback(err);
                            return;
                        }
                        callback(null,doc);
                    });
            }else if(groups){
                StatModel.findByIdAndUpdate(keyId,{$inc:{groups: 1}},
                    function(err,doc){
                        if(err){
                            callback(err);
                            return;
                        }
                        callback(null,doc);
                    });
            }else{

                callback('缺少字段参数,views,or groups');
            }




        }
    });
};


module.exports = Stat;