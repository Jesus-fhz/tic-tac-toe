//To do NxN tic tac toe 3 Main steps:
//- check values in colums,
//- check values in rows,
//- check values diagonal
let players = {
  p1:{ 
      name: "",
      option:"x",
      type: "human",
      points : 0,
      },
  p2:{
     name:"",
     option:"o",
     type: "ai",
     points : 0,
  }
};
let gameState = [];

//Creating size of board
const createBoard = function (size) {
  
  gameState = [...Array(size)].map(_ => Array(size).fill(null));
  return gameState;
}; 

//Check board horizontal
const checkHorizontal = function (state, symbol) {
    return state.some((value) => value.every((position) => position === symbol))
};

//Convert columns to rows, since's easier to check values horizontally
const convertColumns = function (state) {
  return state.map((_, index) => state.map((column) => column[index])); 
};

//We call the convert Columns to rows to check if win "horizontal"
const checkVertical = function (state, turn) {
  const coloumsToRows = convertColumns(state);
  const checkWinHorizontal = checkHorizontal(coloumsToRows, turn);
  return checkWinHorizontal;
};

const leftDdiagonal = function (state, turn) {
  let result  = [];
  //NOTE: Do the looping using for loop; better performance
  state.forEach((value, index) => { 
    value.forEach((_, index2) => {
        if(index === index2 ){
            result.push(value[index2])
        }
    });
  });
  if(result.every((val) => val === turn)){
    return true
  }
  return false
}

const rightDiagonal = function (state, turn){  
    const currentState = JSON.parse(JSON.stringify(state)); // HARD CLONE COPY OF ARRAY TO AVOID REFERENCE ERRORS
    const reverseDiogonal = currentState.map((value) => value.reverse());
    return leftDdiagonal(reverseDiogonal, turn)
}

const isItDraw= function (state){
  const  draw = state.every((value)=> value.every((value2)=> value2 !== null));
  return draw
}

const gameOver = function(state, turn){
  if(checkHorizontal(state, turn) || checkVertical(state, turn) || leftDdiagonal(state, turn) || rightDiagonal(state, turn)){
    return turn;
  }
}


function calcMoveAI(gameState){
  let keepingScore = -100; //X's the Min player we start we  score < 0  to tell the MinMax algorithm that in the next node we need to find the  best move for the Min Player (O)
  let move;
    for (let i = 0; i < gameState.length; i++) { 
      for (let j = 0; j < gameState[i].length; j++) {
        if(gameState[i][j] === null){
          gameState[i][j] = players.p2.option;
          const currentScore = minimax(gameState, 0, false);
          gameState[i][j] = null;
          if (currentScore > keepingScore) {
            keepingScore = currentScore;
            move = [i,j]; 
          }
        }
      }
    }
    if(move !== undefined){
      gameState[move[0]][move[1]] = players.p2.option;
      return move;
    }
}

function minimax(gameState, maxPlayer, depth = 0){
        if(gameOver(gameState, 'x')){
          return -10;
        }
        if(gameOver(gameState, 'o')){
          return 10;
        }  
        if(isItDraw(gameState)){
          return 0;
        }
          if(maxPlayer === true){
            let  keepingScore = -100;
            for (let i = 0; i < gameState.length; i++) {
              for (let j = 0; j < gameState[i].length; j++) {
                  if(gameState[i][j] == null){
                    gameState[i][j] = players.p2.option;;
                    const curentScore =  minimax(gameState, false, depth +1);
                    gameState[i][j] = null;
                    if (curentScore > keepingScore){
                      keepingScore = curentScore;
                    }
                  }
              }
            }
            return keepingScore 
          }else{
            let keepingScore = 100;
            for (let i = 0; i < gameState.length; i++) {
              for (let j = 0; j < gameState[i].length; j++) {
                if(gameState[i][j] == null){
                  gameState[i][j] = players.p1.option;
                  const curentScore =  minimax(gameState, true, depth +1 );
                  gameState[i][j] = null;
                  if (curentScore < keepingScore){
                    keepingScore = curentScore;
                  }
                }
              }
            } 
            return keepingScore
          }  
        } 