var readline = require('readline-sync');
var d = 0;

//var user = readline.question('name');
//var port = readline.question('port');
//var tournament = readline.question('tournament');
var user = 'juan'
var port = '4000'
var tournament = '1221'

var socket = require('socket.io-client')("http://127.0.0.1:" + port + "");  // for example: http://127.0.0.1:3000

socket.on('connect', function(){
	console.log("Conectado.")
  socket.emit('signin', {
    user_name: user,
    tournament_id: parseInt(tournament),
    user_role: 'player'
  });
});

socket.on('ok_signin', function(){
  console.log("Registrado exitosamente.");
});


socket.on('ready', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var board = data.board;
  //console.log(data)
});

socket.on('finish', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;
});


socket.on('ready', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var board = data.board;
  if(playerTurnID==1){
	  enemy = 2;
  }
  else{
	  enemy = 1;
  }

  var moves = legalMoves(board,playerTurnID);
    
  //AI ONLY RANDOM between possible moves
  var ran = Math.floor((Math.random() * moves.length) + 0);
  var mov = moves[ran];
   console.log("Antes");
  printBoard(board);
  console.log(moves,moves[ran]);
  var bor = makeMove(board,moves[ran],playerTurnID);
  console.log("Despues");
  printBoard(bor);
  socket.emit('play', {
    tournament_id: parseInt(tournament),
    player_turn_id: playerTurnID,
    game_id: gameID,
    movement: parseInt(mov)
  });
});


socket.on('finish', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;
  
  // TODO: Your cleaning board logic here
  
  socket.emit('player_ready', {
    tournament_id: parseInt(tournament),
    player_turn_id: playerTurnID,
    game_id: gameID
  });
});



function legalMoves(board,yo){
    var moves = [];
	var i;
	if(yo==1){
		player = 2;
	}
	if(yo==2){
		player = 1;
	}
	
    for (i = 0; i < board.length; i++) { 
        if (board[i]==player){
			//console.log(i);
			if(i-9>=0){
				if(board[i-9]==0)
				{
				pos = i + 9;
				while(pos<=63){
					if(board[pos]==yo){
						if(moves.indexOf(i-9)<0){
							moves.push(i-9);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos + 9;
				}
			}
			}
			if(i-8>=0){
				if(board[i-8]==0)
				{
				pos = i + 8;
				while(pos<=63){
					if(board[pos]==yo){
						if(moves.indexOf(i-8)<0){
							moves.push(i-8);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos + 8;
				}
			}	
			}
			if(i-7>=0){
				if(board[i-7]==0)
				{
				pos = i + 7;
				while(pos<=63){
					if(board[pos]==yo){
						if(moves.indexOf(i-7)<0){
							moves.push(i-7);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos + 7;
				}
			}	
			}
			if(i-1>=0){
				if(board[i-1]==0)
				{
				pos = i + 1;
				while(pos<=63){
					if(board[pos]==yo){
						if(moves.indexOf(i-1)<0){
							moves.push(i-1);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos + 1;
				}
			}	
			}
			if(i+8<=63){
				if(board[i+8]==0)
				{
				pos = i - 8;
				while(pos>=0){
					if(board[pos]==yo){
						if(moves.indexOf(i+8)<0){
							moves.push(i+8);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos - 8;
				}
			}
			}
			if(i+1<=63){
				if(board[i+1]==0)
				{
				pos = i - 1;
				while(pos>=0){
					if(board[pos]==yo){
						if(moves.indexOf(i+1)<0){
							moves.push(i+1);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos - 1;
				}
				}
			}
			if(i+7<=63){
				if(board[i+7]==0)
				{
	            pos = i - 7;
				while(pos>=0){
					if(board[pos]==yo){
						if(moves.indexOf(i+7)<0){
						moves.push(i+7);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos - 7;
				}
			}
			}
			if(i+9<=63){
				if(board[i+9]==0)
				{
				pos = i - 9;
				while(pos>=0){
					if(board[pos]==yo){
						if(moves.indexOf(i+9)<0){
						moves.push(i+9);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos - 9;
				}
				}
			}
		}
    }
	//console.log(moves);
	return moves;
}

function printBoard(board){
	var i;
	var row='';
     for(i=0;i<board.length;i++){
        row += String(board[i])
        if(i==7||i==15||i==23||i==31||i==39||i==47||i==55||i==63){
        	console.log(row);
        	row = ''
        } 
     }
}


function getHeuristica(board,yo,el){
	var heuristica = 0;
    for(var i = 0; i < array.length; ++i){
		if(array[i] == yo){
			heuristica++;
		}
		else{	
		   heuristica--;
		}
    }
	return heuristica
}


function makeMove(board,move,yo){
	var pos;
	//console.log(move);
    board[move] = yo;
	
	if(yo==1){
		player = 2;
	}
	if(yo==2){
		player = 1;
	}
	if(move-9>=0){
		if(board[move-9]==player){
			pos = move-9;
		    while(pos>=0){
				if(board[pos] == player){
					pos = pos -9;
				}
				else if(board[pos] == yo){
					pos = pos + 9;
					while(pos!=move){
						board[pos] = yo;
						pos = pos + 9;
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	if(move-8>=0){
		if(board[move-8]==player){
			pos = move-8;
		    while(pos>=0){
				if(board[pos] == player){
					pos = pos -8;
				}
				else if(board[pos] == yo){
					pos = pos + 8;
					while(pos!=move){
						board[pos] = yo;
						pos = pos + 8;
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	if(move-7>=0){
		if(board[move-7]==player){
			pos = move-7;
		    while(pos>=0){
				if(board[pos] == player){
					pos = pos -7;
				}
				else if(board[pos] == yo){
					pos = pos + 7;
					while(pos!=move){
						board[pos] = yo;
						pos = pos + 7;
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	if(move-1>=0){
		if(board[move-1]==player){
			pos = move-1;
		    while(pos>=0){
				if(board[pos] == player){
					pos = pos-1;
				}
				else if(board[pos] == yo){
					pos = pos + 1;
					while(pos!=move){
						board[pos] = yo;
						pos = pos + 1;
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	if(move+1<=63){
		if(board[move+1]==player){
			pos = move+1;
		    while(pos<=63){
				if(board[pos] == player){
					pos = pos+1;
				}
				else if(board[pos] == yo){
					pos = pos - 1;
					while(pos!=move){
						board[pos] = yo;
						pos = pos - 1;
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	if(move+7<=63){
		if(board[move+7]==player){
			pos = move+7;
		    while(pos<=63){
				if(board[pos] == player){
					pos = pos+7;
				}
				else if(board[pos] == yo){
					pos = pos - 7;
					while(pos!=move){
						board[pos] = yo;
						pos = pos - 7;
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	if(move+8<=63){
		if(board[move+8]==player){
			pos = move+8;
		    while(pos<=63){
				
				if(board[pos] == player){
					pos = pos+8;
				}
				else if(board[pos] == yo){
					pos = pos - 8;
					while(pos!=move){
						board[pos] = yo;
						pos = pos - 8;
						
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	if(move+9<=63){
		if(board[move+9]==player){
			pos = move+9;
		    while(pos<=63){
				if(board[pos] == player){
					pos = pos+9;
				}
				else if(board[pos] == yo){
					pos = pos - 9;
					while(pos!=move){
						board[pos] = yo;
						pos = pos - 9;
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	
	return board;
	
}

