'use strict';
const config = require('../config.js');
let OAuth = require('wechat-oauth');
const fs = require('fs');
let AuthLib = require('../lib/auth.js');
var mongoose = require('mongoose')
    , Profile = mongoose.model('Profile');
let path = require('path');
//let client = new OAuth(config.wechatWeb.appId, config.wechatWeb.appSecret,function (openid, callback) {
//    console.log(openid);
//    fs.readFile('./temp/tokens/openid'+':access_token.txt', 'utf8', function (err, txt) {
//        if (err) {return callback(err);}
//        callback(null, JSON.parse(txt));
//    });
//}, function (openid, token, callback) {
//
//    console.log(openid);
//    fs.writeFile('./temp/tokens/'+openid + ':access_token.txt', JSON.stringify(token), callback);
//});
let index = {

};

var common = require('../common.js');


index.index = function (req,res){
    res.sendFile('index.html',{root:path.normalize('../lucky-scuinfo')},function(e,r) {
    });
    };
index.auth = function (req,res){
    if(req.query.code){
       let accessToken = 'debugToken';
        var result = {
            nickname:req.query.code,
            avatar:"http://tp2.sinaimg.cn/5668968461/180/5736696167/1",
            open_id:req.query.code,
            gender:1,
            union_id:req.query.code
        };

Profile.findOne(
    {open_id:result.open_id},function(err,profile){
        if(err){
            console.log(err);
            res.status(500).end(err.toString);
        }else{
            if(profile){
                result.group_counts= profile.group.length;
                result.user_id = profile._id;
                 AuthLib.generate(result.user_id,function(ee,rr){
                     result.access_token =rr.access_token;
                     try{
                         var stat = JSON.parse(decodeURIComponent(req.query.stat));
                     }catch(e){
                         var stat = {r:"/"}
                     }
                     result.r = stat.r;
                     //console.log(result);

                     let info = encodeURIComponent(new Buffer(encodeURIComponent(JSON.stringify(result))).toString('base64'));
                    res.redirect('/storage.html?i='+info);
                });


            }else{
                let _profile = new Profile({
                    activity_id:'1',
                    create_at:common.time(),
                    gender:result.gender,
                    avatar:result.avatar,
                    nickname:result.nickname,
                    open_id:result.open_id,
                    union_id:result.union_id
                });

                _profile.save(function(e,r){
                    if(e){
                        console.log(e);
                        res.status(500).end();
                    }else{
                        result.group_counts= r.group.length;
                        result.user_id = r._id;
                        AuthLib.generate(result.user_id,function(ee,rr){
                            result.access_token =rr.access_token;
                            try{
                                var stat = JSON.parse(decodeURIComponent(req.query.stat));
                            }catch(e){
                                var stat = {r:"/"}
                            }
                            result.r = stat.r;
                            //console.log(result);
                            let info = encodeURIComponent(new Buffer(encodeURIComponent(JSON.stringify(result))).toString('base64'));
                            res.redirect('/storage.html?i='+info);
                        });

                    }
                })


            }


        }
    });

    }else{
        res.status(404).json({message:"没有获取到微信提供的code"});
    }
};


index.storage = function(req,res){
    res.render('storage');

};


module.exports = index;
