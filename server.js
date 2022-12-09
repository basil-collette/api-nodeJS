'use strict';
const createError = require('http-errors');
const helmet = require('helmet');
const express = require('express');
const http = require('http');
require('dotenv').config();

//SETUP ____________________________________________________________________ SETUP

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);

//ROUTES __________________________________________________________________ ROUTES

const indexRouter = require('./routers/index.router');
app.use('/', indexRouter);
const userRouter = require('./routers/user.router');
app.use('/user', userRouter);
const groupeRouter = require('./routers/groupe.router');
app.use('/groupe', groupeRouter);

// ERRORS __________________________________________________________________ ERRORS

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    var error = {
        status: err.status,
        message: err.message
    }
    res.status(err.status || 500);
    res.send(error);
});

//FUNCTIONS _______________________________________________________________ FUNCTIONS

// Normalize a port into a number, string, or false.
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

// Event listener for HTTP server "error" event.
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}