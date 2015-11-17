'use strict';
var mongoose = require('mongoose')
    , Profile = mongoose.model('Profile'),
    Lucky = mongoose.model('Lucky'),
    StatModel = mongoose.model('Stat'),
    common = require('../common.js');

let luckyLib = require('../lib/lucky.js');
let follow = {

};

follow.following = function  (req,res){
    if(!req.body.user_id || !req.body.access_token ){

        res.status(409).json({message:"缺少body参数"});
        return;
    }


    StatModel.findById('1',function(e5,r5){

        if(e5){
            res.status(500).json({message:"服务器内部错误"});
        }else{
            if(r5){


                if(r5.lucky_time<common.time()){

                    res.status(411).json({message:"该活动已截至"});

                }else {

                    Profile.findById(req.body.user_id, function (ee, rr) {


                        if (ee) {

                            console.log(ee);

                            res.status(500).json({
                                message: "没有这个人?"
                            });

                            //todo

                        } else {

                            let flag = false;

                            for (let i = 0; i < rr.group.length; i++) {


                                if (rr.group[i].user_id === req.params.user_id) {
                                    flag = true;
                                    break;
                                }
                            }

                            if (flag === true) {
                                res.status(409).json({
                                    message: "已经与他组队了",
                                    type: "conflict",
                                    code: "conflict"
                                });
                            } else {
                                //todo
                                luckyLib.generate('1', function (e, r) {
                                    if (e) {
                                        console.log(e);
                                        res.status(500).json({
                                            message: "服务器内部错误"
                                        });
                                    } else {
                                        let result = {
                                            user_id: rr._id,
                                            nickname: rr.nickname,
                                            avatar: rr.avatar,
                                            lucky_id: r,
                                            create_at: common.time(),
                                            primaried: false,
                                            status: "未开奖"
                                        };

                                        Profile.findByIdAndUpdate(req.params.user_id, {
                                            $push: {
                                                "group": {
                                                    user_id: result.user_id,
                                                    nickname: result.nickname,
                                                    avatar: result.avatar,
                                                    lucky_id: result.lucky_id,
                                                    create_at: result.create_at,
                                                    primaried: result.primaried,
                                                    status: result.status
                                                }
                                            }
                                        }, function (eee, rrr) {
                                            //console.log(e,r);


                                            if (eee) {
                                                console.log(eee);

                                                res.status(500).json({
                                                    message: "不存在此用户"
                                                });
                                            } else {


                                                Profile.findByIdAndUpdate(result.user_id, {
                                                    $push: {
                                                        "group": {
                                                            user_id: rrr._id,
                                                            nickname: rrr.nickname,
                                                            avatar: rrr.avatar,
                                                            lucky_id: r,
                                                            create_at: common.time(),
                                                            primaried: true,
                                                            status: "未开奖"
                                                        }
                                                    }
                                                }, function (eeee, rrrr) {

                                                    if (eeee) {
                                                        console.log(eeee);

                                                        res.status(500).json({
                                                            message: "插入失败"
                                                        });
                                                    } else {


                                                        res.status(200).json({
                                                            user_id: result.user_id,
                                                            lucky_id: result.lucky_id,
                                                            create_at: result.create_at,
                                                            status: result.status,
                                                            avatar: rrr.avatar
                                                        });
                                                    }

                                                });

                                            }

                                        });


                                    }


                                });

                            }


                        }


                    });
                }
            }else{
                res.status(404).json({message:"没有该活动"});
            }
        }
    });



};



module.exports = follow;