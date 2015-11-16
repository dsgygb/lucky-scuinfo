"use strict";

var mongoose = require('mongoose')
    , Profile = mongoose.model('Profile');
let profile = {

};

profile.profile = function  (){

};

profile.api = function(req,res){

    Profile.findById(req.params.user_id,function(e,r){
        //console.log(e,r);
        if(e){
            res.status(500).json({message:"服务器内部错误"});
        }else{
            if(r){
                res.status(200).json(r);
            }else{
                res.status(404).json({message:"找不到该用户"});
            }
        }
    })


};



module.exports = profile;