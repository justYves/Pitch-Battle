'use strict';
var socketio = require('socket.io');
var chalk = require('chalk');
var uuid = require('node-uuid');
var io = null;
module.exports = function(server) {

  if (io) return io;
  io = socketio(server);
  var waiting = [];
  var clients = {};
  var users = {};
  var rooms = {};



  //io Logic Here
  var connectedUser = 0;
  io.on('connection', function(client) {

    clients[client.id] = client;

    console.log(client.id);
    io.sockets.emit('connection successfull', client.id);

    //Connection Status
    console.log(chalk.green('\t socket.io:: player ' + client.id + ' connected'));
    console.log(chalk.blue("Total connected user: ", ++connectedUser));

    //Matches player against each other <---- Put in another file--->
    function matchUsers() {
      if (waiting.length >= 2) {

        // waiting[Math.floor(Math.random()*(waiting.length-1))];
        var user1 = waiting.pop();
        var user2 = waiting.pop();
        console.log('opponents Found! ', user1.name + ' is fighting ' + user2.name + '.');
        //Change angular state to Fight and provide the opponent's name


        //Create a room for the fight
        var newRoom = new Room();
        user1.join(newRoom.id);
        user2.join(newRoom.id);

        newRoom.players.concat([user1, user2]);
        rooms[newRoom.id] = new Room;
        user1.emit('foundOpponents', user2.name);
        user2.emit('foundOpponents', user1.name);

        setTimeout(function() {
          io.sockets.to(newRoom.id).emit('fight', newRoom.id)
        }, 1000);
      }
    }

    function Room() {
      this.id = uuid.v4().toString();
      this.players = [];
    };


    //Emit to a specific room:
    client.on('room',function(roomId,msg){
      client.broadcast.to(roomId).emit(msg);
    });

    //Receive Name info and ready status from player
    client.on('message', function(from, msg) {
      client.name = from;
      waiting.push(client);
      // console.log('received message from', from, JSON.stringify(msg));
      // console.log('broadcasting message');
      console.log(from, msg);
      console.log(chalk.yellow("Users looking for opponents: ", waiting.length));
      // io.sockets.emit('broadcast', {
      //   payload: msg,
      //   source: from
      // });
      // console.log('broadcast complete');
      matchUsers();
    });

    //player disconnects
    client.on('disconnect', function() {
      console.log(chalk.red('\t socket.io:: client disconnected ' + client.id));
      console.log(chalk.blue("Total connected user: ", --connectedUser));
      delete clients[client.id];
    });


  });
  return io;
};