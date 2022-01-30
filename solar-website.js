const http = require('http');
const https = require('https');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const request = require('request');
const session = require('express-session')
const csrf = require('csurf')
const flatten = require('flat')
const uuidv4 = require('uuid/v4');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const fs = require('fs');
const ini = require('ini');
const bodyParser = require("body-parser");

const { encrypt, decrypt } = require('./helpers/cryptoFunctions');

const iniConfig = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

const {
    promisify
} = require('util');

const asyncv3 = require('async');

mongoose.connect(iniConfig.mongo_connect);
var db = require('./models/allSchema')(mongoose);


var indexRouter = require('./routes/index');

var serverPort = 8787;

var app = express();


var server = http.createServer(app);

server.listen(serverPort);


////
// Web Stuff

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.set('db', db);
app.set('iniConfig', iniConfig);

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: iniConfig.session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 864000
    }
}));
app.use(csrf());
app.use(flash());

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});