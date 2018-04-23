var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var net = require('net');
var readline = require('readline-sync');

var userName = readline.question('May I have your name? ');
var port = readline.question('May I have the port to connect? ');
var tournamentID = readline.question('May I have the tournament id? ');

var socket = require('socket.io-client')("http://127.0.0.1:"+ port +"");  // for example: http://127.0.0.1:3000
var connect = socket.on('connect', function(){
    console.log("ok, the connection is ready")
});
socket.on('connect', function(){
    socket.emit('signin', {
      user_name: userName,
      tournament_id: parseInt(tid),
      user_role: 'player'
    });
});

socket.on('ok_signin', function(){
    console.log("Hey, you are a part of the tournament #"+tid+"!!");
});

socket.on('ready', function(data){
    console.log(data)
    var gameID = data.game_id;
    var playerTurnID = data.player_turn_id;
    var board = data.board;
    console.log("ready")
    socket.emit('play', {
        tournament_id: tournamentID,
        player_turn_id: playerTurnID,
        game_id: gameID,
        movement: (5,6)
    });
});

socket.on('finish', function(data){
    var gameID = data.game_id;
    var playerTurnID = data.player_turn_id;
    var winnerTurnID = data.winner_turn_id;
    var board = data.board;
    
    // TODO: Your cleaning board logic here
    
    socket.emit('player_ready', {
      tournament_id: tournamentID,
      player_turn_id: playerTurnID,
      game_id: gameID
    });
  });