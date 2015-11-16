'use strict';


//todo 销毁token mongo的和内存的


var common =require('./common.js');
var mongoose = require('mongoose');
let AuthModel = mongoose.model('Auth');
var dropMemory = function(){
    setInterval(function(){
var update_at = common.time()-300;
        AuthModel.find(
            {"update_at":{$lt:update_at}},function(e,r){
            }
        )      ;

AuthModel.remove(
    {"update_at":{$lt:update_at}},function(e){
    }
)
    },5*1000*300);
};


dropMemory();