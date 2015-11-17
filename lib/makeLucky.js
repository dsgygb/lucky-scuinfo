'use strict';
var EventEmitter = require('events');
const config = require('../config.js');
var mongoose = require('mongoose');
const common = require('../common.js');
const fs = require('fs');

var emitter = new EventEmitter.EventEmitter();
mongoose.connect(config.db);
var models_path =  '../models';
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
});
var LuckyModel = mongoose.model('Lucky');
var ResultModel = mongoose.model('Result');
var ProfileModel = mongoose.model('Profile');

//抽奖主进程

var makeRandom = function(min,max){
   return  Math.floor(Math.random()*(max-min+1)+min);
};

emitter.on('luckyIdGenerated',function(data){
    console.log(data.results);


    console.log('更改状态中..');

    var updateStatus = function(results,data,cb){
        var luckyHash= {};
        for(let i=0;i<results.length;i++){
            luckyHash[results[i]]=1;
        }

        ProfileModel.findById(data._id,{},function(e,r){

            if(e){
                console.log(e);
                cb(e);
            }else{

                if(r.group.length === 0){
                    cb(e,{type:"NO_GROUP",open_id:r.open_id,union_id:r.union_id,nickname:r.union_id,user_id:r._id});
                }else{

                    let newGroup=[];

                    for(let i=0;i<r.group.length;i++){
                        newGroup.push(
                            {
                                user_id:r.group[i].user_id,
                                nickname:r.group[i].nickname,
                                avatar:r.group[i].avatar,
                                lucky_id:r.group[i].lucky_id,
                                create_at:r.group[i].create_at,
                                primaried:r.group[i].primaried,
                                status:luckyHash[r.group[i].lucky_id]?"已中奖":"未中奖"
                            }
                        )
                    }


                }


                cb(e,r);

            }


        });

        console.log('处理');
        cb(null)
    };
    var stream = ProfileModel.find().stream();

    var cache = [];
    stream.on('data',function(doc){
        console.log(doc);

        cache.push(doc);
        if(cache.length == 1){
            stream.pause();
            process.nextTick(function(){
                updateStatus(cache,function(e,r){

                    if(e){
                        //todo
                    }else{
                        //todo 通知 日志
                    }

                    cache = [];
                    stream.resume();
                })


            });
        }

    }).on('error',function(err){
        console.log(err);
    }).on('close',()=>{
        console.log('ok');
    });


    //,然后改所有的人,然后通知所有的人


});

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



