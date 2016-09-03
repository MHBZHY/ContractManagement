/**
 * Created by zhy on 16/6/8.
 */
var express = require('express');
var app = express();

//session
var session = require('express-session');
var cookie = require('cookie-parser');

//设置cookie
app.use(cookie());

//设置session
app.use(session({
    secret: 'Contract',
    cookie: {maxAge: 15 * 60 * 1000},
    resave: false,
    saveUninitialized: true
}));

//设置刷新session
app.use(function (req, res, next) {
    req.session._garbage = new Date();
    req.session.touch();
    next();
});

//注册post处理
var Parser = require('./Service/Parser');
var parser = new Parser(app);

parser.parseRequest();

//静态页面
app.use(express.static(__dirname + '/Public'));

//模版引擎
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/Public/view');

//启动服务器
app.listen('8010', function () {
    console.log('Server started at 8010');
});