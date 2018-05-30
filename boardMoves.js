var board = 
[ [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 2, 1, 0, 0, 0 ],
  [ 0, 0, 0, 1, 2, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0 ] ]

var playerTurnID =1


console.log(validMove(board,playerTurnID))

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
                        console.log("up")
                        console.log(y,x)
                        console.log(""+(y-position).toString()+","+ (x).toString() +"")
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
                        console.log("down")
                        console.log(y,x)
                        console.log(""+(y+position).toString()+","+ (x).toString() +"")
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
                        console.log("left")
                        console.log(y,x)
                        console.log(""+(y).toString()+","+ (x-position).toString() +"")
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
                        console.log("right")
                        console.log(y,x)
                        console.log(""+(y).toString()+","+ (x+position).toString() +"")
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
                        console.log("LowerRight")
                        console.log(y,x)
                        console.log(""+(y+position).toString()+","+ (x+position).toString() +"")
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
                        console.log("LowerLeft")
                        console.log(y,x)
                        console.log(""+(y+position).toString()+","+ (x-position).toString() +"")
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
                        console.log("UpperLeft")
                        console.log(y,x)
                        console.log(""+(y-position).toString()+","+ (x-position).toString() +"")
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
                        console.log("UpperRight")
                        console.log(y,x)
                        console.log(""+(y-position).toString()+","+ (x+position).toString() +"")
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
