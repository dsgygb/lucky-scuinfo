'use strict';
var mongoose = require('mongoose');
//let LuckyModel = mongoose.model('Lucky');

//抽奖主进程

var makeLucky = function(min,max){
   var luckyId = Math.floor(Math.random()*(max-min+1)+min);
    console.log(luckyId);
//
//LuckyModel.find({},function(e,r){
//    console.log(e,r);
//})

};

//todo 抽奖
//makeLucky(100000,233322);

