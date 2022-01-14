//Globals
let turn = players.p1.option;
let minSizeBoard = document.querySelector("#boardSize");
let display = document.querySelector(".display");
let containerBox = document.querySelector(".game-board");
let scoreP1 = document.querySelector("#scoreP1");
let scoreP2 = document.querySelector("#scoreP2");
let aiCheck = document.querySelector('#ai');
let mainState;
players.p1.name = document.querySelector("#player1").value; //Default value
players.p2.name = document.querySelector("#player2").value; //Default value

const generateBoard = function(number) {
    selectNames();
    const size = createBoard(number);
    containerBox.innerHTML = "";
    containerBox.style.gridTemplate = `repeat(${number}, 1fr) / repeat(${number}, 1fr)`;
    for (let i = 0; i < size.length; i++) {
        for (let j = 0; j < size[i].length; j++) {
            const box = document.createElement("div");
            box.classList.add("box")
            box.setAttribute("lvl", i);
            box.setAttribute("index", j);
            containerBox.append(box);
        }
    }
}

const skynet = function() {
    document.querySelectorAll(".box")
        .forEach((box) => box.addEventListener("click", function() {
            const lvl = box.getAttribute("lvl");
            const index = box.getAttribute("index");
            if (turn === players.p1.option) {
                if (gameState[lvl][index] === null) {
                    box.innerText = turn;
                    gameState[lvl][index] = turn;
                    turn = players.p2.option;
                    let aiMoves = calcMoveAI(gameState);
                    if (aiMoves !== undefined) {
                        const aiCell = document.querySelector(`[lvl="${aiMoves[0]}"][index="${aiMoves[1]}"]`);
                        aiCell.innerText = turn;
                        gameState[aiMoves[0]][aiMoves[1]] = turn;
                    }
                    console.log(gameState);
                    checkState(gameState);
                    turn = players.p1.option;
                }

            }
        }));
}

const getState = function(){
    document.querySelectorAll(".box")
            .forEach((box) => box.addEventListener("click", function(){
            const lvl = box.getAttribute("lvl");
            const index = box.getAttribute("index");     
            if(gameState[lvl][index] === null){
               gameState[lvl][index] = turn;
               box.innerText = turn;
               checkState(gameState);
               turn = turn  === players.p1.option ? players.p2.option: players.p1.option;  //Change turn
           }
    }));
} 

//Set Names
const selectNames = function() {
    const option = document.querySelectorAll(".playersName");
    option.forEach((option) => option.addEventListener("change", function() {
        if (this.getAttribute('id') === "player1") {
            players.p1.name = this.value;
        }
        players.p2.name = this.value;
    }));
}

//Handle winner/tie and reset game and set points
const handleGame = function(turn, draw) {
    let winner;
    if (draw) {
        display.innerText = `It was a tie`;
    } else {
        if (turn === players.p1.option) {
            winner = players.p1.name;
            players.p1.points += 1;
        } else {
            winner = players.p2.name;
            players.p2.points += 1;
        }
        display.innerText = `The winner is ${winner}`;
        containerBox.style.pointerEvents = "none";
    }
    resetGame();
}

//Check state of current game
const checkState = function(gameState) {
    if (gameOver(gameState, turn)) return handleGame(turn);
    if (isItDraw(gameState)) return handleGame(turn, true);
}

//Change Board Size
const changeBoardSize = function() {
    const showValue = document.querySelector("#showSize");
    showValue.innerHTML = minSizeBoard.value;
    minSizeBoard.addEventListener("input", function() {
        showValue.innerHTML = this.value;
        generateBoard(parseInt(this.value));
        containerBox.style.pointerEvents = "";
        mainState();
    });

}

//Reset Game function
const resetGame = function() {
    const restart = document.querySelector("#restartGame")
    restart.addEventListener("click", function() {
        turn = players.p1.option;
        generateBoard(parseInt(minSizeBoard.value));
        mainState();
        containerBox.style.pointerEvents = "";
        display.innerHTML = "";
    })
}

const start = function(){
    generateBoard(parseInt(minSizeBoard.value));
    mainState();
    changeBoardSize();
    resetGame();
}

window.addEventListener('load', () => {
    mainState = getState;
    start();
    aiCheck.addEventListener("change", function(){
        if(this.checked){
            minSizeBoard.value = 3;
            minSizeBoard.disabled = true;
            mainState = skynet;
            start();
        }else{
            minSizeBoard.disabled = false;
            mainState = getState;
            start();
        }
    })
});