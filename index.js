'use strict';

/**
 * Created by yangguobao on 11/13/15.
 */
const common = require('./common.js');
const config = require('./config.js');
const mongoose = require('mongoose');
const fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
mongoose.connect(config.db);
var models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
});
var app = express();
app.use(express.static('public'));
app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
    extended: true
}));
app.set("views", __dirname + "/views");
app.set("view engine", "html");
app.engine('.html', require('ejs').__express);
const index = require('./controllers/index.js');
const follow = require('./controllers/follow.js');
const profile = require('./controllers/profile.js')
const stat = require('./controllers/stat.js');
const AuthLib = require('./lib/auth.js');
const makeLuckyLib = require('./lib/makeLucky.js');

let AuthModel = mongoose.model('Auth');
var consumer = require('./consumer.js');

app.get('/',index.index);
app.get('/auth',index.auth);
app.get('/storage',index.storage);
app.get('/u/:user_id',profile.profile);
app.put('/api/following/:user_id',AuthLib.checkAuth,follow.following);
app.get('/api/profile/:user_id',profile.api);
app.put('/api/stat/:activity_id/inc',stat.inc);
app.get('/api/stat/:activity_id',stat.stat);


app.listen(8005);
