/*jslint node: true */
"use strict";

// const config = require('./config');
import express from 'express';
import bodyParser from 'body-parser';

module.exports = function () {
    let app = express();
    //app.set('port_https', config.httpsport);


    app.all('*', function (req, res, next) {
        /*
            force all traffic get redirected to https
            if (req.secure) {
                return next();
            };
            res.redirect('https://' + req.hostname + ':' + app.get('port_https') + req.url);
            });
        */

        // CORS headers       
        res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        // Set custom headers for CORS
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
        if (req.method == 'OPTIONS') {
            res
                .status(200)
                .end();
        } else {
            next();
        }
    });

    //handle any global errors here
    app.use(function (err, req, res, next) {
        res
            .status(500)
            .send({
                "Error": err.stack
            });
    });

    //autenticated api requests
    app.all('/api/v1/*', function (req, res, next) {
        var token = req.headers['x-access-token'];
        if (token) {
            next();

        } else {
            next();
            // return res.status(403).send({
            //     success: false,
            //     message: 'No token provided.'
            // });
        }
    });

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    // app.use(session({
    //     saveUninitialized: true,
    //     resave: true,
    //     secret: config.sessionSecret
    // }));


    app.use(function (req, res, next) {
        // logging to console.
        console.log('OK hm Something is happening.');
        next(); // make sure we go to the next routes and don't stop here
    });


    // app.set('views', './app/views');
    // app.engine('ejs', ejsmate);
    // app.set('view engine', 'ejs');

    // app.use(flash());
    // app.use(passport.initialize());
    // app.use(passport.session());


    require('./routes/sharejsaof')(app); //'../src/routes/sharejsaof'
    require('./routes/timesheet')(app);
    require('./routes/github')(app);
    require('./routes/newman')(app);

    //require('../src/api/routes/v1/sharejs/shareaof')(app);

    app.use(express.static('./public'));

    return app;
};