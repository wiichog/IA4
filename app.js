var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var net = require('net');
var readline = require('readline-sync');
var Tree = require('easy-tree');
var _ = require('underscore');

var userName = readline.question('May I have your name? ');
var port = 4000// readline.question('May I have the port to connect? ');
var tournamentID = 1221//readline.question('May I have the tournament id? ');
var tree = new Tree();


var socket = require('socket.io-client')("http://127.0.0.1:"+ port +"");  // for example: http://127.0.0.1:3000
socket.on('connect', function(){
    console.log("ok, the connection is ready")
    socket.emit('signin', {
      user_name: userName,
      tournament_id: parseInt(tournamentID),
      user_role: 'player'
    });
});

socket.on('ok_signin', function(){
    console.log("Hey, you are a part of the tournament #"+tournamentID+"!!");
});

socket.on('ready', function(data){
    //console.log(data)
    var gameID = data.game_id;
    var playerTurnID = data.player_turn_id;
    var board = data.board;
    socket.emit('play', {
        tournament_id: tournamentID,
        player_turn_id: playerTurnID,
        game_id: gameID,
        movement: moveBy(data.board,playerTurnID)
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

function moveBy(board,playerTurnID){
    console.log("********************************")
    var matrixBoard = []
    for(var i=0; i<board.length; i+= 8){
        matrixBoard.push(board.slice(i,i+8))
    }
    console.log(matrixBoard)
    console.log(playerTurnID)
    if(playerTurnID==1){
        var returnvalidMoves = validMove(matrixBoard,2,1)
    }
    else if(playerTurnID==2){
        var returnvalidMoves = validMove(matrixBoard,1,2)
    }
    constructTree(returnvalidMoves[0],returnvalidMoves[1],matrixBoard)
    var validMoves = returnvalidMoves[0]
    var random = validMoves[Math.floor(Math.random() * validMoves.length)].split(",")
    var x = parseInt(random[1])
    var y = parseInt(random[0])
    var number = (y *8) +x
    
    return number
}

function validMove(matrixBoard,playerTurnID,lookingFor){
    var posibleMoves = []
    var origins = []
    for(var y=0;y<matrixBoard.length;y++){
        var row = matrixBoard[y]
        for(var x=0;x<row.length;x++){
            if(row[x]==playerTurnID){
                //upperRight
                try {
                    if(matrixBoard[y-1][x+1]==0){
                        var position = 1
                        while(true){
                            try{
                                var looking = matrixBoard[y+position][x-position]
                            }
                            catch(err) {break}
                            if (looking == null){break}
                            if(looking==lookingFor && !(posibleMoves.includes(""+(y-1).toString()+","+ (x+1).toString() +""))){
                                posibleMoves.push(""+(y-1).toString()+","+ (x+1).toString() +"")
                                origins.push(""+(y).toString()+","+ (x).toString() +"")
                                break
                            }
                            position += 1 
                        }
                    }
                }catch(err) {}

                //up
                try {
                    if(matrixBoard[y-1][x]==0){
                        var position = 1
                        while(true){
                            try{
                                var looking = matrixBoard[y+position][x]
                            }
                            catch(err) {break}
                            if (looking == null){break}
                            if(looking==lookingFor && !(posibleMoves.includes(""+(y-1).toString()+","+ (x).toString() +""))){
                                posibleMoves.push(""+(y-1).toString()+","+ (x).toString() +"")
                                origins.push(""+(y).toString()+","+ (x).toString() +"")
                                break
                            }
                            position += 1 
                        }
                    }
                }catch(err) {}

                //upperLeft
                try {
                    if(matrixBoard[y-1][x-1]==0){
                        var position = 1
                        while(true){
                            try{
                                var looking = matrixBoard[y+position][x+position]
                            }
                            catch(err) {break}
                            if (looking == null){break}
                            if(looking==lookingFor && !(posibleMoves.includes(""+(y-1).toString()+","+ (x-1).toString() +""))){
                                posibleMoves.push(""+(y-1).toString()+","+ (x-1).toString() +"")
                                origins.push(""+(y).toString()+","+ (x).toString() +"")
                                break
                            }
                            position += 1 
                        }
                    }
                }catch(err) {}


                //left
                try {
                    if(row[x-1]==0){
                        var position = 1
                        while(true){
                            try{
                                var looking = row[x+position]
                            }
                            catch(err) {break}
                            if (looking == null){break}
                            if(looking==lookingFor && !(posibleMoves.includes(""+(y).toString()+","+ (x-1).toString() +""))){
                                posibleMoves.push(""+(y).toString()+","+ (x-1).toString() +"")
                                origins.push(""+(y).toString()+","+ (x).toString() +"")
                                break
                            }
                            position += 1 
                        }
                    }
                }catch(err) {}

                //lowerLeft
                try {
                    if(matrixBoard[y+1][x-1]==0){
                        var position = 1
                        while(true){
                            try{
                                var looking = matrixBoard[y-position][x+position]
                            }
                            catch(err) {break}
                            if (looking == null){break}
                            if(looking==lookingFor && !(posibleMoves.includes(""+(y+1).toString()+","+ (x-1).toString() +""))){
                                posibleMoves.push(""+(y+1).toString()+","+ (x-1).toString() +"")
                                origins.push(""+(y).toString()+","+ (x).toString() +"")
                                break
                            }
                            position += 1 
                        }
                    }
                }catch(err) {}

                //low
                try {
                    if(matrixBoard[y+1][x]==0){
                        var position = 1
                        while(true){
                            try{
                                var looking = matrixBoard[y-position][x]
                            }
                            catch(err) {break}
                            if (looking == null){break}
                            if(looking==lookingFor && !(posibleMoves.includes(""+(y+1).toString()+","+ (x).toString() +""))){
                                posibleMoves.push(""+(y+1).toString()+","+ (x).toString() +"")
                                origins.push(""+(y).toString()+","+ (x).toString() +"")
                                break
                            }
                            position += 1 
                        }
                    }
                }catch(err) {}

                //lowerRight
                try {
                    if(matrixBoard[y+1][x+1]==0){
                        var position = 1
                        while(true){
                            try{
                                var looking = matrixBoard[y-position][x-position]
                            }
                            catch(err) {break}
                            if (looking == null){break}
                            if(looking==lookingFor && !(posibleMoves.includes(""+(y+1).toString()+","+ (x+1).toString() +""))){
                                posibleMoves.push(""+(y+1).toString()+","+ (x+1).toString() +"")
                                origins.push(""+(y).toString()+","+ (x).toString() +"")
                                break
                            }
                            position += 1 
                        }
                    }
                }catch(err) {}

                //right
                try {
                    if(row[x+1]==0){
                        var position = 1
                        while(true){
                            try{
                                var looking = row[x-position]
                            }
                            catch(err) {break}
                            if (looking == null){break}
                            if(looking==lookingFor && !(posibleMoves.includes(""+(y).toString()+","+ (x+1).toString() +""))){
                                posibleMoves.push(""+(y).toString()+","+ (x+1).toString() +"")
                                origins.push(""+(y).toString()+","+ (x).toString() +"")
                                break
                            }
                            position += 1 
                        }
                    }
                }catch(err) {}
            }
        }
    }
    return [posibleMoves,origins]
}

function constructTree(moves,origins,actualBoard){
    console.log("******constructBoard*****")
    for(var i=0;i<moves.length;i++){
        constructBoard(moves[i].split(","),origins[i].split(","),actualBoard);
    }
}

function constructBoard(destiny, origin, board){
    paths = []
    boards = []
    var xd = destiny[1];
    var yd = destiny[0];
    var xo = origin[1];
    var yo = origin[0];
    var restx = xo-xd
    var resty = yo-yd

    board[yd][xd] = 5 
    console.log(board)

    console.log(yd,xd)
    console.log(yo,xo)



    console.log(restx)
    console.log(resty)

    //up
    if(resty>0 && restx==0){
        var newBoard = arrayClone(board);
            for(yd;yd<=yo;yd++){
                newBoard[yd][xd]=1
            }
        boards.push(newBoard)
    }
    //down
    else if(resty<0 && restx==0){
        var newBoard = arrayClone(board);
            for(yd;yd>=yo;yd--){
                newBoard[yd][xd]=1
            }
        boards.push(newBoard)
    }
    //left
    else if(resty==0 && restx>0){
        var newBoard = arrayClone(board);
            for(xd;xd<=xo;xd++){
                newBoard[yd][xd]=1
            }
        boards.push(newBoard)
    }
    //right
    else if(resty==0 && restx<0){
        var newBoard = arrayClone(board);
            for(xd;xd<=xo;xd--){
                newBoard[yd][xd]=1
            }
        boards.push(newBoard)
    }
}

function arrayClone(arr) {  
    if( _.isArray( arr ) ) {
        return _.map( arr, arrayClone );
    } else if( typeof arr === 'object' ) {
        throw 'Cannot clone array containing an object!';
    } else {
        return arr;
    }
}