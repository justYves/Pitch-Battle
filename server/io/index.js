'use strict';
var socketio = require('socket.io');
var chalk = require('chalk');
var uuid = require('node-uuid');
var randNote = require('./giveNote.js');
var io = null;
module.exports = function(server) {

  if (io) return io;
  io = socketio(server);
  var waiting = {}; //player waiting to play
  var clients = {}; //all connected clients
  var rooms = {}; // Object are easier to delete obj[key]


// console.log("!!!!!",randNote);
  //io Logic Here
  var connectedUser = 0;
  io.on('connection', function(client) {
    clients[client.id] = client;
    client.emit('connection successfull', client.id);

    //Connection Status
    console.log(chalk.green('\t socket.io:: player ' + client.id + ' connected'));
    console.log(chalk.blue("Total connected user: ", ++connectedUser));

    //Matches player against each other <---- Put in another file--->
    function matchUsers() {
      if (Object.keys(waiting).length >= 2) {

        //<---- Random ---> NOT WORKING
        var user1 = waiting[Object.keys(waiting)[Math.floor((Math.random())*(Object.keys(waiting).length-1))]];
        delete waiting[user1.id];
        var user2 = waiting[Object.keys(waiting)[Math.floor((Math.random())*(Object.keys(waiting).length-1))]];
        delete waiting[user2.id];

        // var index = Object.keys(waiting).length-1;
        // Object.keys(waiting)[index]


        console.log('opponents Found! ', user1.name + ' is fighting ' + user2.name + '.');

        //Create a room for the fight
        var newRoom = new Room(user1, user2);
        rooms[newRoom.id] = newRoom;

        //notify user1
        user1.join(newRoom.id);
        user1.room = newRoom.id;
        user1.emit('foundOpponents', user2.name); //change angular state

        //notify user2
        user2.join(newRoom.id);
        user2.room = newRoom.id;
        user2.emit('foundOpponents', user1.name); //change angular state

        io.sockets.in(newRoom.id).on('leave', function(){
          console.log("someone left the room!");
        });

        setTimeout(function() {
          io.to(newRoom.id).emit('fight', newRoom.id);
          var note = randNote();
          io.to(newRoom.id).emit('new note',note)
        }, 5000);
      }
    }

    function Room(user1, user2) {
      this.id = uuid.v4().toString();
      this.round = 1;
      this.currentNote='';
      this.players = [{
        name:user1.name,
        id:user1.id
      }, {
        name:user2.name,
        id:user2.id
      }];
    }


    //Emit to a specific room:
    client.on('room', function(roomId, msg) {
      client.broadcast.to(roomId).emit(msg);
      setTimeout(function() {
          io.to(roomId).emit('new note',randNote())
      }, 5000);
    });

    // Opponent disconnected
    client.on('return to Waiting',function(){
      client.leave(client.room);
    });

    //Receive Name info and ready status from player
    client.on('ready', function(from, msg) {
      client.name = from;
      waiting[client.id] = client;
      // console.log('received message from', from, JSON.stringify(msg));
      // console.log('broadcasting message');
      console.log(from, msg);
      console.log(chalk.yellow("Users looking for opponents: ", Object.keys(waiting).length));
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

      //delete from room
      if(client.room) {
        console.log(client.id + " left room " + client.room);
        client.leave(client.room);
        delete rooms[client.room];
        io.sockets.in(client.room).emit('leave');
      }
      //delete from waiting Room
      delete waiting[client.id];

      //delet from connected client
      delete clients[client.id];
    });

    // <----- ADMIN ---->
    client.on('admin', function() {
      //Return clients ID and Name
      var filterClients = [];
      Object.keys(clients).forEach(function(client) {
        filterClients.push({
          name: clients[client].name,
          id: clients[client].id
        });
      });

      //Return Name with User in it
      var filterRooms = [];
      Object.keys(rooms).forEach(function(id) {
        filterRooms.push({
          id: rooms[id].id,
          players: rooms[id].players
        });
      });

      var waitingRoom = [];
      Object.keys(waiting).forEach(function(player) {
        waitingRoom.push({
          name: waiting[player].name,
          id: waiting[player].id
        });
      });

      client.emit('data', filterRooms, filterClients, waitingRoom);
    });


  });
  return io;
};