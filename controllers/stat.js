"use strict"

var mongoose = require('mongoose')
    , StatModel = mongoose.model('Stat'),
    statLib = require('../lib/stat.js');
let Stat = {

};



Stat.inc = function  (req,res){

    if(typeof req.body.fields !== "string"){

        res.status(400).json({message:'缺少参数 fields'});
    }else {

        statLib.inc(req.params.activity_id, req.body.fields, function (e, r) {
            if (e) {
                console.log(e);
                res.status(500).json({message:"内部错误"});
            } else {
                res.status(200).json(r);
            }
        });
    }

};


Stat.stat = function(req,res){

    StatModel.findById(req.params.activity_id,function(e,r){

        if(e){
            res.status(500).json({message:"服务器内部错误"});
        }else{
            if(r){
              console.log(r);
                res.status(200).json(r);
            }else{
                res.status(404).json({message:"没有该活动"});
            }
        }
    })


};



module.exports = Stat;
