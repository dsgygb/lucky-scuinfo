'use strict';
var EventEmitter = require('events');
const config = require('../config.js');
var mongoose = require('mongoose');
const common = require('../common.js');
const fs = require('fs');
var async = require('async');
var emitter = new EventEmitter.EventEmitter();
mongoose.connect(config.db);
var models_path =  '../models';
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
});
var LuckyModel = mongoose.model('Lucky');
var ResultModel = mongoose.model('Result');
var ProfileModel = mongoose.model('Profile');
var LuckyInfoModel = mongoose.model('LuckyInfo');
var NoticeModel = mongoose.model('Notice');

//抽奖主进程
var updateStatus = function(results,data,cb){
    var luckyHash= {};
    var cbResult={
        luckyStatus:false,
        luckyGroups:[],
        type:"NO_PRIZE"
    };
    for(let i=0;i<results.length;i++){
        luckyHash[results[i]]=1;
    }
    //console.log(data._id);
    ProfileModel.findById(data._id,{},function(e,r){
        //console.log(e,r);return;
        if(e){
            console.log(e);
            cb(e);
        }else{

            if(r.group.length === 0){
                console.log('没有组');
                cb(null,{type:"NO_GROUP",noluckyStatus:true,open_id:r.open_id,union_id:r.union_id,nickname:r.union_id,user_id:r._id});
            }else{
                //console.log(r);
                let newGroup=[];

                for(let i=0;i<r.group.length;i++){
                    newGroup.push(
                        {
                            _id:r.group[i]._id,
                            user_id:r.group[i].user_id,
                            nickname:r.group[i].nickname,
                            avatar:r.group[i].avatar,
                            lucky_id:r.group[i].lucky_id,
                            create_at:r.group[i].create_at,
                            primaried:r.group[i].primaried,
                            status:luckyHash[r.group[i].lucky_id]?"已中奖":"未中1奖"
                        }
                    );

                    if(luckyHash[r.group[i].lucky_id]){
                            cbResult.luckyStatus = true;
                            cbResult.luckyGroups.push({
                                user_id:r.group[i].user_id,
                                nickname:r.group[i].nickname,
                                avatar:r.group[i].avatar,
                                lucky_id:r.group[i].lucky_id,
                                create_at:r.group[i].create_at,
                                primaried:r.group[i].primaried
                            });

                            cbResult.union_id = r.union_id;
                        cbResult.open_id = r.open_id;
                        cbResult.user_id = r._id;
                            cbResult.nickname = r.nickname;
                        cbResult.gender = r.gender;
                        cbResult.type="PRIZE";
                        cbResult.avatar = r.avatar;
                    }
                }
                //console.log(newGroup);

                ProfileModel.where({_id:data._id}).update({$set:{group:newGroup}},function(eee,rrr){

                    if(eee){
                        console.log(data);
                        console.log(eee);
                        cb(eee);
                    }else{
                        cb(eee,cbResult);
                    }
                })
            }
        }


    });

};

var notice = function(options,cb){
//通知并记录日志

    NoticeModel.findOneAndUpdate({
        activity_id:options.activity_id,
        user_id:options.user_id
    },{$set:{
        activity_id:options.activity_id,
        open_id:options.open_id,
        create_at:common.time(),
        update_at:common.time(),
        union_id:options.union_id,
        status:options.status,
        user_id:options.user_id,
        nickname:options.nickname,
        counts:options.counts?options.counts:0
    }},function(e,r){



        if(e){
cb(e);
        }else{


            if(r){
                cb(e,r);

            }else{
                var item = new NoticeModel({
                    activity_id:options.activity_id,
                    open_id:options.open_id,
                    create_at:common.time(),
                    update_at:common.time(),
                    union_id:options.union_id,
                    status:options.status,
                    user_id:options.user_id,
                    nickname:options.nickname,
                    counts:options.counts?options.counts:0
                });

                item.save(function(ee,rr){
                    console.log(ee, rr);
                    console.log('已记录通知');
                    cb(ee,rr);
                });
            }
        }




    });






};


//todo 监听抽奖码生成事件


var insertActivityLuckyResult = function(options,cb){
    async.each(
        options.luckyGroups,function(group,cb1){
            
            var updateQuery;
            if(group.primaried){

                updateQuery = {
                    $set:{
                        friend:{

                            user_id:options.user_id,
                            nickname:options.nickname,
                            avatar:options.avatar,
                            create_at:group.create_at,
                            open_id:options.open_id,
                            union_id:options.union_id
                        }
                    }
                }
            }else{


                updateQuery = {
                    $set:{
                        host:{

                            user_id:options.user_id,
                            nickname:options.nickname,
                            avatar:options.avatar,
                            create_at:group.create_at,
                            open_id:options.open_id,
                            union_id:options.union_id
                        }
                    }
                }
            }

            LuckyInfoModel.findOneAndUpdate({activity_id:options.activity_id,lucky_id:group.lucky_id},updateQuery,function(e,r){
                //console.log(e, r);
                if(e){
                    console.log(e);
                    cb1(e);
                    return;
                }else{

                    if(r){
                        cb1(null);
                        //console.log('直接更新了一个');



                    }else{

                        var luckyInfo;
                        //没有这个lucky_id,新增
                        if(group.primaried){

                             luckyInfo = new LuckyInfoModel({
                                activity_id:options.activity_id,
                                lucky_id:group.lucky_id,
                                friend:{
                                    user_id:options.user_id,
                                    nickname:options.nickname,
                                    avatar:options.avatar,
                                    create_at:group.create_at,
                                    open_id:options.open_id,
                                    union_id:options.union_id
                                },
                                create_at:common.time()
                            });

                        }else{
                            luckyInfo = new LuckyInfoModel({
                                activity_id:options.activity_id,
                                lucky_id:group.lucky_id,
                                host:{
                                    user_id:options.user_id,
                                    nickname:options.nickname,
                                    avatar:options.avatar,
                                    create_at:group.create_at,
                                    open_id:options.open_id,
                                    union_id:options.union_id
                                },
                                create_at:common.time()
                            });

                        }


                        luckyInfo.save(function(eee,rrr){
                            cb1(eee,rrr);
                            //console.log(eee,rrr);
                        });




                    }
                }


            });


        },function(err){

            if(err){

                console.log(err);
                cb(err);
            }else{
                //console.log('这个人的弄完了');
                cb(null);
            }

        }
    );
};

emitter.on('start',function(){
    ResultModel.findOne({activity_id:1},function(e1,r1){
        console.log('更改状态中..');
        var stream = ProfileModel.find().stream();//todo 选取活动

        //var cache = [];
        r1.results = [100001,100002];
        var xxx= 0;
        stream.on('data',function(doc){
            //console.log(doc);
            //cache.push(doc);
            //if(cache.length == 1){
            stream.pause();
            process.nextTick(function(){
                updateStatus(r1.results,doc,function(e,r){
                    if(e){
                        //todo
                        console.log(e);

                        stream.resume();

                    }else{

                        if(r.type=='PRIZE'){

                            //console.log(r);

                            r.activity_id = 1;

                            insertActivityLuckyResult(r,function(e3){

                                if(e3){
                                    console.log(e3);
                                    stream.resume();
                                }else{
                                    console.log(++xxx + '中奖完成');
                                    notice({user_id:r.user_id,open_id:r.open_id,union_id:r.union_id,nickname:r.nickname,status:true,counts:r.luckyGroups.length},function(e,r){
                                        stream.resume();
                                    });

                                }

                            });


                        }else if(r.type=='NO_PRIZE'){

                            notice({user_id:r.user_id,open_id:r.open_id,union_id:r.union_id,nickname:r.nickname,status:false},function(e,r){
                                console.log(++xxx + '未中奖完成');

                                stream.resume();
                            });

                        }else{
                            console.log(++xxx + '无组合完成');

                            stream.resume();

                        }
                    }

                    //cache = [];
                })


            });
            //}

        }).on('error',function(err){
            console.log(err);
        }).on('close',()=>{
            console.log('已全部更新完毕');
        });



    });
});

var start = function(){
    emitter.emit('start');
};
start();

var makeRandom = function(min,max){
   return  Math.floor(Math.random()*(max-min+1)+min);
};







var generateLuckyNumber = function(){

    var arr = [];

    for(var i=0;i<100;i++){
        arr.push(makeRandom(100000,200000));
    }
    var results = new ResultModel(
        {
            activity_id:1,
            create_at:common.time(),
            results:arr
        }
    );

    results.save(function(e,r){

        if(e){
            console.log(e);

        }else{
            console.log('幸运抽奖码生成完毕');
            emitter.emit('luckyIdGenerated',r);
        }
    });
};


