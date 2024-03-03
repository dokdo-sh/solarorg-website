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
const flash = require('connect-flash');
const fs = require('fs');
const bodyParser = require("body-parser");
const sxpApiHelper = require("@types/sxp-api-helper");
const indexRouter = require('./routes/index');
const app = express();
const server = http.createServer(app);
const config = require('config')
const port = config.get('server.port');
const secret = config.get('server.secret')

const {
    promisify
} = require('util');
const { response } = require('express');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: secret,
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

server.listen(port);

//// Socket.io

const io = require('socket.io').listen(server);

//// sxpApiHelper
const sxpApi = sxpApiHelper.sxpApi;
const sxpapi = new sxpApi.default();

io.on('connection', function(socket) {

    socket.on('getTxStats', function(input) {
        (async() => {
            socket.emit('showTxStats', JSON.parse(fs.readFileSync(`data/mainnet.json`)))
        })()
    });


    /* sxp api */

    socket.on('getwallet', function(input) {
        (async() => {
            let response = await sxpapi.getWalletByID(input.walletId);
            const data = (response.data);
            const flatJson = {
                balance: (parseFloat(data.balance) / 100000000).toFixed(2)
            };
            socket.emit('showwallet', flatJson);
        })();

    });

    socket.on('getWalletSent', function(input) {

        (async() => {
            let response = await sxpapi.getWalletSentTransactions(input.walletId);

            const data = (response.data);
            const flatJson = [];

            for (let i = 0; i < data.length; i++) {
                let tempJson = {
                    nonce: data[i].nonce,
                    recipient: data[i].recipient ? data[i].recipient : data[i].asset.transfers ? data[i].asset.transfers.length > 1 ? `${data[i].asset.transfers.length} recipients` : `${data[i].asset.transfers[0].recipientId}` : "Other",
                    memo: data[i].memo == undefined ? '<span>-</span>' : data[i].memo,
                    amount: data[i].amount,
                    id: data[i].id,
                    timestamp: data[i].timestamp.human
                };
                flatJson.push(tempJson);
            }
            socket.emit('showWalletSent', flatJson);
        })();

    });
});