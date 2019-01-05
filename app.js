/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const flash = require('express-flash');
const path = require('path');
// const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');


const redis_lib = require("./controllers/utils/redis");
//redis session
var redis   = require("redis");
var client  = redis.createClient();
var RedisStore      =     require('connect-redis')(session);
//time
const sleep = require('sleep');
const http = require('http');

const fileUpload = require('express-fileupload');
const fs = require('fs');

const upload = multer({ dest: path.join(__dirname, 'uploads') });
const db = require('./db/models');
const User = db.User;
const Wallet = db.Wallet;

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

// const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 80)
app.set('view engine', 'pug');;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

var sessionMiddleware = session({
    store: new RedisStore({ host: 'localhost', port: 6379, client: client,ttl :  300000}),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
    
})


// app.use(csrf());
// app.use(function (req, res, next) {
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     res.locals.csrftoken = req.csrfToken();
//     next();
// })

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());
// app.use((req, res, next) => {
//     if (req.path === '/api/upload') {
//       next();
//     } else {
//       lusca.csrf()(req, res, next);
//     }
// });

// app.use(lusca.csp({policy : {"default-src": "*"}}));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.p3p('Unibot'));
app.use(lusca.hsts({ maxAge: 31536000 }));
app.use(lusca.xssProtection(true));
app.use(lusca.nosniff());
app.use(lusca.referrerPolicy('same-origin'));
app.disable('x-powered-by');

// app.use(function(req, res) {
//    res.render('404.pug', {title: '404: File Not Found'});
// });
/**
 * Primary app routes.
 */

var server = require('http').createServer(app);

const io = require('socket.io')(server,{
    path: '/test',
    serveClient: true,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});


function getAddressWallet(id,cb){
    console.log(id);
    User.findById(id)
    .then(user=>{
        console.log(135);
        console.log(user);
        Wallet.findById(user.dataValues.wallet_id)
        .then(wallet=>{
            return cb(true,wallet.address);
        }).catch(err=>{
            return cb(false,"");
        })
    })
};

io.use(function(socket,next){
    sessionMiddleware(socket.request, socket.request.res, next);
})
app.use(sessionMiddleware);
app.use(function (req,res,next) {
    res.locals.session = req.session;
    next();
});
const routeradmin = require('./router/routeadmin');
app.use(routeradmin);
const routerdashboard = require('./router/routedashboard');
app.use(routerdashboard);

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

app.use(function(req, res, next){
    // console.log("error")
    res.render('404', { status: 404, url: req.url });
  });


io.on('connection', function (socket) {
        console.log('a user connected');
        

        socket.on('newnotify', function (data) {
            if(data){
                console.log("mesge:   "+data);
                io.emit("newnotify", data);
            }
        });
        socket.on('disconnect', function(data){
            console.log('user disconnected');
        });
});

server.listen(app.get('port'),()=>{
    db.sequelize.sync();
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');

})