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

var results=[ 120229,
        134075,
        167031,
        166306,
        179851,
        127607,
        161777,
        114586,
        100348,
        176658,
        127690,
        146524,
        108688,
        163831,
        167502,
        175574,
        112931,
        154063,
        139427,
        187021,
        169693,
        188607,
        190081,
        171487,
        115576,
        130534,
        138846,
        198630,
        177761,
        145613,
        198043,
        187658,
        185667,
        180176,
        192904,
        165622,
        161775,
        197534,
        130742,
        102972,
        173538,
        167196,
        148413,
        106427,
        164655,
        195631,
        124573,
        173063,
        117032,
        104544,
        106710,
        169741,
        119371,
        178908,
        185017,
        157829,
        157881,
        185795,
        182959,
        146580,
        141824,
        178168,
        175582,
        125911,
        195217,
        158273,
        166561,
        199391,
        113672,
        131251,
        141262,
        149683,
        188940,
        182104,
        140951,
        151308,
        188705,
        145765,
        152211,
        176894,
        106255,
        191191,
        149762,
        105766,
        180016,
        154693,
        120173,
        118355,
        142546,
        110900,
        127040,
        136004,
        143563,
        138478,
        171918,
        187161,
        109700,
        187689,
        111595,
        157237 ];
var luckyHash= {};
for(let i=0;i<results.length;i++){
    luckyHash[results[i]]=1;
}
console.log(luckyHash['104524']?"yes":'no');

