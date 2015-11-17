"use strict";

var mongoose = require('mongoose')
    , LuckyInfo = mongoose.model('LuckyInfo');
let luckyInfo = {

};



luckyInfo.api = function(req,res){

    LuckyInfo.find({activity_id:req.params.activity_id},function(e,r){
        console.log(e,r);
        if(e){
            res.status(500).json({message:"服务器内部错误"});
        }else{
            if(r){
                res.status(200).json(r);
            }else{
                res.status(404).json({message:"找不到该活动"});
            }
        }
    })


};



module.exports = luckyInfo;