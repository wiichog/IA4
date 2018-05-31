var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var net = require('net');
var readline = require('readline-sync');
var TreeNode = require('treenode').TreeNode;

var userName = readline.question('May I have your name? ');
var port = 4000// readline.question('May I have the port to connect? ');
var tournamentID = 142857//readline.question('May I have the tournament id? ');
var fs = require('fs');


var socket = require('socket.io-client')("http://192.168.1.142:"+ port +"");  // for example: http://127.0.0.1:3000
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
    console.log(matrixBoard)
    var tree = constructTree(matrixBoard,playerTurnID)
    var random = getBestShoot(tree,playerTurnID).split(",")
    var x = parseInt(random[1])
    var y = parseInt(random[0])
    var number = (y *8) +x
    return number
}

function getBestShoot(treeAndLevel,playerTurnID){
    var tree = treeAndLevel[0]
    var level = treeAndLevel[1]
    //calculate the heuristic to the last level
    tree.forEach(function(node){
        if(node.data.level==level){
            node.data.heuristic = count(node.data.name,playerTurnID)
        }
    })
    while(level>0){
        var fathers = []
        var fathersHeuristics = []
        var childHeuristics = []
        tree.forEach(function(node){
            if(node.data.level==level){
                if(!(fathers.includes(node.data.parent))){
                    fathersHeuristics.push(childHeuristics)
                    childHeuristics.length = 0
                    fathers.push(node.data.parent)
                    childHeuristics.push(node.data.heuristic)
                }
                else{
                    childHeuristics.push(node.data.heuristic)
                }
            
            }
        })
        putHeuristic(tree,level,fathers,fathersHeuristics)
        level = level -1
    }
    var move = []
    var finalHeuristics = []
    tree.forEach(function(node){
        if(node.data.level==1){
            finalHeuristics.push(node.data.heuristic)
            move.push(node.data.move)
        }
    })
    var finalMove = move[finalHeuristics.indexOf(Math.max.apply(null, finalHeuristics))]
    return finalMove
}

function putHeuristic(tree,level,fathers,heuristics){
    var fH = {}
    for(var i=0;i<fathers.length;i++){
        fH[fathers[i]] = heuristics[i]
    }
    if(level % 2 == 0) {
        tree.forEach(function(node){
            if(fathers.includes(node.data.id)){
                node.data.heuristic =  Math.min.apply(null, fH[node.data.id]) 
            }
        })
    }
    else{
        tree.forEach(function(node){
            if(fathers.includes(node.data.id)){
                node.data.heuristic =  Math.max.apply(null, fH[node.data.id]) 
            }
        })
    }
}

function constructTree(board,playerTurnID){
    var level = 0
    if(playerTurnID==1){
        var opplayerTurnID=2
    }
    else if(playerTurnID==2){
        var opplayerTurnID=1
    }
    var tree = new TreeNode({id: 0, name: board, parent: -1}); //root 0 level
    var firstBoard =  tree.data.name;
    var validMovesFB = validMove(firstBoard,playerTurnID);
    console.log(validMovesFB)
    var counter = 1;
    var parents = []
    if(validMovesFB.length>0){
        level = 1
        var boards = newBoards(validMovesFB,firstBoard,playerTurnID);
        for(var i=0;i<boards.length;i++){
            tree.addChild({id: counter, name: boards[i], parent: 0,level:1,heuristic:100,move:validMovesFB[i],alpha:100,beta:-100});//first level
            parents.push(counter)
            counter += 1;
        }
    }
    if(level==1){
        var childsSF = []
        tree.forEach(function(node){
            if(node.data.level==1){
                level = 2
                var nodeBoardSF = node.data.name;
                var validMovesSF = validMove(nodeBoardSF,opplayerTurnID);
                if(validMovesSF.length>0){
                    var boardsSF = newBoards(validMovesSF,nodeBoardSF,opplayerTurnID);
                    for(var j=0;j<boardsSF.length;j++){//second level
                        node.addChild({id:counter,name:boardsSF[j],parent:node.data.id,level:2,heuristic:100,move:validMovesSF[i],alpha:100,beta:-100});
                        counter += 1;
                    }
                }
            }
        })
    }
    
    if(level==2){
        tree.forEach(function(node){
            if(node.data.level==2){
                level = 3
                var nodeBoardTF = node.data.name;
                var validMovesTF = validMove(nodeBoardTF,opplayerTurnID);
                if(validMovesTF.length>0){
                    var boardsTF = newBoards(validMovesTF,nodeBoardTF,playerTurnID);
                    for(var j=0;j<boardsTF.length;j++){//third level
                        node.addChild({id:counter,name:boardsTF[j],parent:node.data.id,level:3,heuristic:100,move:validMovesTF[i],alpha:100,beta:-100});
                        counter += 1;
                    }
                }
            }
        })
    }
    
    if(level==3){
        tree.forEach(function(node){
            if(node.data.level==3){
                level = 4
                var nodeBoardFF = node.data.name;
                var validMovesFF = validMove(nodeBoardFF,opplayerTurnID);
                if(validMovesFF.length>0){
                    var boardsFF = newBoards(validMovesFF,nodeBoardFF,opplayerTurnID);
                    for(var j=0;j<boardsFF.length;j++){//fourth level
                        node.addChild({id:counter,name:boardsFF[j],parent:node.data.id,level:4,heuristic:0,move:validMovesFF[i]});
                        counter += 1;
                    }
                }
            }
        })
    }
    
    /*if(level==4){
        tree.forEach(function(node){
            if(node.data.level==4){
                level = 5
                var nodeBoard5F = node.data.name;
                var validMoves5F = validMove(nodeBoard5F,opplayerTurnID);
                if(validMoves5F.length>0){
                    var boards5F = newBoards(validMoves5F,nodeBoard5F,playerTurnID);
                    for(var j=0;j<boards5F.length;j++){//fifth level
                        node.addChild({id:counter,name:boards5F[j],parent:node.data.id,level:5,heuristic:0,move:validMoves5F[i]});
                        counter += 1;
                    }
                }
            }
        })
    }**/
    return [tree,level];
}

function validMove(matrixBoard,playerTurnID){
    if(playerTurnID==1){
        var lookingFor = 2
    }
    else if(playerTurnID==2){
        var lookingFor = 1
    }
    var posibleMoves = []
    for(var y=0;y<matrixBoard.length;y++){
        for(var x=0;x<matrixBoard[y].length;x++){
            if(matrixBoard[y][x]==playerTurnID){
                var position = 1
                var ones = []
                //up
                while(true){
                    try{
                        var looking = matrixBoard[y-position][x]
                    }
                    catch(err) {break;}
                    if(looking==lookingFor){
                        ones.push(1)
                    }
                    if (looking == null || (ones.length==0 && looking==0) || looking==playerTurnID || (looking==0 && ones.length>0 && (posibleMoves.includes(""+(y-position).toString()+","+ (x).toString() +"")))){break;}
                    if(looking==0 && ones.length>0 && !(posibleMoves.includes(""+(y-position).toString()+","+ (x).toString() +""))){
                        posibleMoves.push(""+(y-position).toString()+","+ (x).toString() +"")
                        break
                    }
                    position += 1 
                }

                //down
                var position = 1
                var ones = []
                while(true){
                    try{
                        var looking = matrixBoard[y+position][x]
                    }
                    catch(err) {break;}
                    if(looking==lookingFor){
                        ones.push(1)
                    }
                    if (looking == null || (ones.length==0 && looking==0) || looking==playerTurnID || (looking==0 && ones.length>0 && (posibleMoves.includes(""+(y+position).toString()+","+ (x).toString() +"")))){break;}
                    if(looking==0 && ones.length>0 && !(posibleMoves.includes(""+(y+position).toString()+","+ (x).toString() +""))){
                        posibleMoves.push(""+(y+position).toString()+","+ (x).toString() +"")
                        break
                    }
                    position += 1 
                }

                //left
                var position = 1
                var ones = []
                while(true){
                    try{
                        var looking = matrixBoard[y][x-position]
                    }
                    catch(err) {break;}
                    if(looking==lookingFor){
                        ones.push(1)
                    }
                    if (looking == null || (ones.length==0 && looking==0) || looking==playerTurnID || (looking==0 && ones.length>0 && (posibleMoves.includes(""+(y).toString()+","+ (x-position).toString() +"")))){break;}
                    if(looking==0 && ones.length>0 && !(posibleMoves.includes(""+(y).toString()+","+ (x-position).toString() +""))){
                        posibleMoves.push(""+(y).toString()+","+ (x-position).toString() +"")
                        break
                    }
                    position += 1 
                }

                //right
                var position = 1
                var ones = []
                while(true){
                    try{
                        var looking = matrixBoard[y][x+position]
                    }
                    catch(err) {break;}
                    if(looking==lookingFor){
                        ones.push(1)
                    }
                    if (looking == null || (ones.length==0 && looking==0) || looking==playerTurnID || (looking==0 && ones.length>0 && (posibleMoves.includes(""+(y).toString()+","+ (x+position).toString() +"")))){break;}
                    if(looking==0 && ones.length>0 && !(posibleMoves.includes(""+(y).toString()+","+ (x+position).toString() +""))){
                        posibleMoves.push(""+(y).toString()+","+ (x+position).toString() +"")
                        break
                    }
                    position += 1 
                }

                //LowerRight
                var position = 1
                var ones = []
                while(true){
                    try{
                        var looking = matrixBoard[y+position][x+position]
                    }
                    catch(err) {break;}
                    if(looking==lookingFor){
                        ones.push(1)
                    }
                    if (looking == null || (ones.length==0 && looking==0) || looking==playerTurnID || (looking==0 && ones.length>0 && (posibleMoves.includes(""+(y+position).toString()+","+ (x+position).toString() +"")))){break;}
                    if(looking==0 && ones.length>0 && !(posibleMoves.includes(""+(y+position).toString()+","+ (x+position).toString() +""))){
                        posibleMoves.push(""+(y+position).toString()+","+ (x+position).toString() +"")
                        break
                    }
                    position += 1 
                }

                //LowerLeft
                var position = 1
                var ones = []
                while(true){
                    try{
                        var looking = matrixBoard[y+position][x-position]
                    }
                    catch(err) {break;}
                    if(looking==lookingFor){
                        ones.push(1)
                    }
                    if (looking == null || (ones.length==0 && looking==0) || looking==playerTurnID || (looking==0 && ones.length>0 && (posibleMoves.includes(""+(y+position).toString()+","+ (x-position).toString() +"")))){break;}
                    if(looking==0 && ones.length>0 && !(posibleMoves.includes(""+(y+position).toString()+","+ (x-position).toString() +""))){
                        posibleMoves.push(""+(y+position).toString()+","+ (x-position).toString() +"")
                        break
                    }
                    position += 1 
                }

                //UpperLeft
                var position = 1
                var ones = []
                while(true){
                    try{
                        var looking = matrixBoard[y-position][x-position]
                    }
                    catch(err) {break;}
                    if(looking==lookingFor){
                        ones.push(1)
                    }
                    if (looking == null || (ones.length==0 && looking==0) || looking==playerTurnID || (looking==0 && ones.length>0 && (posibleMoves.includes(""+(y-position).toString()+","+ (x-position).toString() +"")))){break;}
                    if(looking==0 && ones.length>0 && !(posibleMoves.includes(""+(y-position).toString()+","+ (x-position).toString() +""))){
                        posibleMoves.push(""+(y-position).toString()+","+ (x-position).toString() +"")
                        break
                    }
                    position += 1 
                }

                //UpperRight
                var position = 1
                var ones = []
                while(true){
                    try{
                        var looking = matrixBoard[y-position][x+position]
                    }
                    catch(err) {break;}
                    if(looking==lookingFor){
                        ones.push(1)
                    }
                    if (looking == null || (ones.length==0 && looking==0) || looking==playerTurnID || (looking==0 && ones.length>0 && (posibleMoves.includes(""+(y-position).toString()+","+ (x+position).toString() +"")))){break;}
                    if(looking==0 && ones.length>0 && !(posibleMoves.includes(""+(y-position).toString()+","+ (x+position).toString() +""))){
                        posibleMoves.push(""+(y-position).toString()+","+ (x+position).toString() +"")
                        break
                    }
                    position += 1 
                }



            }



            }
        }
  
    return posibleMoves
}


function newBoards(moves,actualBoard,playerTurnID){
    var newboards = []
    for(var i=0;i<moves.length;i++){
        newboards.push(constructBoard(moves[i].split(","),actualBoard,playerTurnID));
    }
    return newboards
}

function constructBoard(destiny, originalBoard,playerTurnID){
    var board = clone(originalBoard)
    paths = []
    var x = parseInt(destiny[1]);
    var y = parseInt(destiny[0]);
    var positions = []
    var position = 1
    positions.push(""+(y).toString()+","+(x).toString()+"")
    while(true){
        try{
            var newPosition = board[y-position][x];
            positions.push(""+(y-position).toString()+","+(x).toString()+"")
            position= position +1
            if(newPosition==playerTurnID){
                for(var i=0;i<positions.length;i++){
                    var coords = positions[i].split(",")
                    board[coords[0]][coords[1]] = playerTurnID
                }
                break;
            }
        }catch(err) {break;}
    }
    //Down
    var position = 1
    positions.length = 0;
    positions.push(""+(y).toString()+","+(x).toString()+"")
    while(true){
        try{
            var newPosition = board[y+position][x];
            positions.push(""+(y+position).toString()+","+(x).toString()+"")
            position= position +1
            if(newPosition==playerTurnID){
                for(var i=0;i<positions.length;i++){
                    var coords = positions[i].split(",")
                    board[coords[0]][coords[1]] = playerTurnID
                }
                break;
            }
        }catch(err) {break;}
    }


    //right
    var position = 1
    positions.length = 0;
    positions.push(""+(y).toString()+","+(x).toString()+"")
    while(true){
        try{
            var newPosition = board[y][x+position];
            if(newPosition==null){break;}
            positions.push(""+(y).toString()+","+(x+position).toString()+"")
            position= position +1
            if(newPosition==playerTurnID){
                for(var i=0;i<positions.length;i++){
                    var coords = positions[i].split(",")
                    board[coords[0]][coords[1]] = playerTurnID
                }
                break;
            }
        }catch(err) {break;}
    }
    //left
    var position = 1
    positions.length = 0;
    positions.push(""+(y).toString()+","+(x).toString()+"")
    while(true){
        try{
            var newPosition = board[y][x-position];
            if(newPosition==null){break;}
            positions.push(""+(y).toString()+","+(x-position).toString()+"")
            position= position +1
            if(newPosition==playerTurnID){
                for(var i=0;i<positions.length;i++){
                    var coords = positions[i].split(",")
                    board[coords[0]][coords[1]] = playerTurnID
                }
                break;
            }
        }catch(err) {break;}
    }
    //UpperRight
    var position = 1
    positions.length = 0;
    positions.push(""+(y).toString()+","+(x).toString()+"")
    while(true){
        try{
            var newPosition = board[y-position][x+position];
            if(newPosition==null){break;}
            positions.push(""+(y-position).toString()+","+(x+position).toString()+"")
            position= position +1
            if(newPosition==playerTurnID){
                for(var i=0;i<positions.length;i++){
                    var coords = positions[i].split(",")
                    board[coords[0]][coords[1]] = playerTurnID
                }
                break;
            }
        }catch(err) {break;}
    }
    //UpperLeft
    var position = 1
    positions.length = 0;
    positions.push(""+(y).toString()+","+(x).toString()+"")
    while(true){
        try{
            var newPosition = board[y-position][x-position];
            if(newPosition==null){break;}
            positions.push(""+(y-position).toString()+","+(x-position).toString()+"")
            position= position +1
            if(newPosition==playerTurnID){
                for(var i=0;i<positions.length;i++){
                    var coords = positions[i].split(",")
                    board[coords[0]][coords[1]] = playerTurnID
                }
                break;
            }
        }catch(err) {break;}
    }
    //LowerRight
    var position = 1
    positions.length = 0;
    positions.push(""+(y).toString()+","+(x).toString()+"")
    while(true){
        try{
            var newPosition = board[y+position][x+position];
            if(newPosition==null){break;}
            positions.push(""+(y+position).toString()+","+(x+position).toString()+"")
            position= position +1
            if(newPosition==playerTurnID){
                for(var i=0;i<positions.length;i++){
                    var coords = positions[i].split(",")
                    board[coords[0]][coords[1]] = playerTurnID
                }
                break;
            }
        }catch(err) {break;}
    }
    //LowerLeft
    var position = 1
    positions.length = 0;
    positions.push(""+(y).toString()+","+(x).toString()+"")
    while(true){
        try{
            var newPosition = board[y+position][x-position];
            if(newPosition==null){break;}
            positions.push(""+(y+position).toString()+","+(x-position).toString()+"")
            position= position +1
            if(newPosition==playerTurnID){
                for(var i=0;i<positions.length;i++){
                    var coords = positions[i].split(",")
                    board[coords[0]][coords[1]] = playerTurnID
                }
                break;
            }
        }catch(err) {break;}
    }
    return board
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