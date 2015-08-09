'use strict';
var chalk = require('chalk');
var fs = require('fs');

// Requires in ./db/index.js -- which returns a promise that represents
// mongoose establishing a connection to a MongoDB database.
var startDb = require('./db');


var options ={
    key: fs.readFileSync(__dirname +'/key.pem'),
    cert: fs.readFileSync(__dirname +'/cert.pem')
};
// Create a node server instance! cOoL!
//
// HTTPS
// var server = require('https').createServer(options);

//HTTP
var server = require('http').createServer();


var createApplication = function () {
    var app = require('./app');
    server.on('request', app); // Attach the Express application.
    require('./io')(server);   // Attach socket.io.
};

var startServer = function () {

    var PORT = process.env.PORT || 8080;

    server.listen(PORT, function () {
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
    });

};

startDb.then(createApplication).then(startServer).catch(function (err) {
    console.error('Initialization error:', chalk.red(err.message));
    console.error('Process terminating . . .');
    process.kill(1);
});

//No using DB for now
// //startDb.then(createApplication).then(startServer).catch(function (err) {
//     console.error('Initialization error:', chalk.red(err.message));
//     console.error('Process terminating . . .');
//     process.kill(1);
// });