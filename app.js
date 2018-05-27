var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var net = require('net');
var readline = require('readline-sync');
var TreeNode = require('treenode').TreeNode;

var userName = readline.question('May I have your name? ');
var port = 4000// readline.question('May I have the port to connect? ');
var tournamentID = 1221//readline.question('May I have the tournament id? ');



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
    var matrixBoard = []
    for(var i=0; i<board.length; i+= 8){
        matrixBoard.push(board.slice(i,i+8))
    }
    
    constructTree(matrixBoard,playerTurnID)

    var validMoves = returnvalidMoves[0]
    var random = validMoves[Math.floor(Math.random() * validMoves.length)].split(",")
    var x = parseInt(random[1])
    var y = parseInt(random[0])
    var number = (y *8) +x
    
    return number
}

function constructTree(board,playerTurnID){
    var firstplayerTurnID = playerTurnID;
    var tree = new TreeNode({id: 0, name: board, parent: -1});
    var firstBoard =  tree.data.name;
    var validMovesFB = validMove(firstBoard,playerTurnID);
    var boards = newBoards(validMovesFB[0],validMovesFB[1],firstBoard,playerTurnID);
    var counter = 1;
    var parents = []
    for(var i=0;i<boards.length;i++){
        tree.addChild({id: counter, name: boards[i], parent: 0});
        parents.push(counter)
        counter += 1;
    }
    tree.forEach(function(node) {
        if(node.data.parent==0){
            var childBoard = node.data.name;
            if(playerTurnID==1){
                playerTurnID=2
            }
            else if(playerTurnID==2){
                playerTurnID=1
            }
            var validMovesCB = validMove(childBoard,playerTurnID);
            var boardsCB = newBoards(validMovesFB[0],validMovesFB[1],firstBoard,playerTurnID);
            for(var j=0;j<boardsCB.length;j++){//second level
                node.addChild({id:counter,name:boardsCB[j],parent:node.data.id});
                counter += 1;
            }
        }
    });
    console.log(parents)
    tree.forEach(function(node){
        console.log(node.data.id)
        console.log(node.data.parent)
        if(node.data.id!=0){
            if(!(parents.includes(node.data.parent))){
                console.log("this is the parent node id " + node.data.id)
                node.forEach(function(child){
                    //if(!(parents.includes(node.data.id))){
                        console.log("this is the son node id " + child.data.id)
                   // }
                })
            }
        }
    })

}

function validMove(matrixBoard,lookingFor){
    if(lookingFor==1){
        var playerTurnID = 2
    }
    else if(lookingFor==2){
        var playerTurnID = 1
    }
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
                                origins.push(""+(y+position).toString()+","+ (x-position).toString() +"")
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
                                origins.push(""+(y+position).toString()+","+ (x).toString() +"")
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
                                origins.push(""+(y+position).toString()+","+ (x+position).toString() +"")
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
                                origins.push(""+(y).toString()+","+ (x+position).toString() +"")
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
                                origins.push(""+(y-position).toString()+","+ (x+position).toString() +"")
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
                                origins.push(""+(y-position).toString()+","+ (x).toString() +"")
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
                                origins.push(""+(y-position).toString()+","+ (x-position).toString() +"")
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
                                origins.push(""+(y).toString()+","+ (x-position).toString() +"")
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

function newBoards(moves,origins,actualBoard,playerTurnID){
    var newboards = []
    for(var i=0;i<moves.length;i++){
        newboards.push(constructBoard(moves[i].split(","),origins[i].split(","),actualBoard,playerTurnID));
    }
    return newboards
}

function constructBoard(destiny, origin, board,playerTurnID){
    paths = []
    var xd = destiny[1];
    var yd = destiny[0];
    var xo = origin[1];
    var yo = origin[0];
    var restx = xo-xd
    var resty = yo-yd
    //up
    if(resty>0 && restx==0){
        var newBoard = clone(board);
            for(yd;yd<=yo;yd++){
                newBoard[yd][xd]=playerTurnID
            }
        return [newBoard,count(newBoard,playerTurnID)];
    }
    //down
    else if(resty<0 && restx==0){
        var newBoard = clone(board);
            for(yd;yd>=yo;yd--){
                newBoard[yd][xd]=playerTurnID
            }
        return [newBoard,count(newBoard,playerTurnID)];
    }
    //left
    else if(resty==0 && restx>0){
        var newBoard = clone(board);
            for(xd;xd<=xo;xd++){
                newBoard[yd][xd]=playerTurnID
            }
        return [newBoard,count(newBoard,playerTurnID)];
    }
    //right
    else if(resty==0 && restx<0){
        var newBoard = clone(board);
            for(xd;xd>=xo;xd--){
                newBoard[yd][xd]=playerTurnID
            }
        return [newBoard,count(newBoard,playerTurnID)];
    }
    //upperRight
    else if(resty>0 && restx<0){
        var newBoard = clone(board);
        while(true){
            newBoard[yd][xd]=playerTurnID
            xd--
            yd++
            if(xd==xo && yd==yo){
                break;
            }
        }
        return [newBoard,count(newBoard,playerTurnID)];
    }

    //UpperLeft
    else if(resty>0 && restx>0){
        var newBoard = clone(board);
        while(true){
            newBoard[yd][xd]=playerTurnID
            xd++
            yd++
            if(xd==xo && yd==yo){
                break;
            }
        }
        return [newBoard,count(newBoard,playerTurnID)];
    }
    //LowerRight
    else if(resty<0 && restx<0){
        var newBoard = clone(board);
        while(true){
            newBoard[yd][xd]=playerTurnID
            xd--
            yd--
            if(xd==xo && yd==yo){
                break;
            }
        }
        return [newBoard,count(newBoard,playerTurnID)];
    }
    //LowerLeft
    else if(resty<0 && restx>0){
        var newBoard = clone(board);
        while(true){
            newBoard[yd][xd]=playerTurnID
            xd++
            yd--
            if(xd==xo && yd==yo){
                break;
            }
        }
        return [newBoard,count(newBoard,playerTurnID)];
    }
}

function count(board,playerTurnID){
    var counter = 0
    for(var y=0;y<board.length;y++){
        var row = board[y];
        for(var x=0; x<row.length;x++){
            if(board[y][x]==playerTurnID){
                counter++
            }
        }
    }
    return counter
}


function clone(a) {
    return JSON.parse(JSON.stringify(a));
 }