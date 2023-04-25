import { myListOfTetromino } from "./tetromino.js";

const startButton = document.getElementById("start");
const gridElement = document.querySelector(".grid");
const allTheCells = [];
let startX = 4;
let startY = -1;
let playerPosition = [0, 0];
let target = 10;
let theGrid = [];
let savedCurrentCells = [];
let cellsToDraw = [];
let cantGoDown = Boolean;
let currentTetromino = [];

// STARTING THE GAME
function startTheGame() {
  callingTetromino();
  for (let row = 0; row < 20; row++) {
    theGrid.push([]);
    for (let col = 0; col < 10; col++) {
      const div = document.createElement("div");
      theGrid[row].push(col + 1);
      div.classList.add("cell");
      div.setAttribute("row", row);
      div.setAttribute("col", col);
      gridElement.append(div);
      allTheCells.push(div);
    }
  }
  drawingTetromino(getTetrominoCell(currentTetromino));
}

function callingTetromino() {
  const index = Math.floor(Math.random() * myListOfTetromino.length);
  currentTetromino = myListOfTetromino[index].matrix;
}

//Function to get the new cell of a tetromino (when created and/or rotated)
function getTetrominoCell(currentTetromino) {
  cellsToDraw = [];
  for (let i = 0; i < currentTetromino.length; i++) {
    for (let j = 0; j < currentTetromino[i].length; j++) {
      if (currentTetromino[i][j]) {
        let myInlineRowPosition = startX + i * 10 + j + startY;
        cellsToDraw.push(myInlineRowPosition);
      }
    }
  }
  console.log("end of getTetrominoCell ", cellsToDraw);
  return cellsToDraw;
}

//Actually applying the class to the cell to color them
function drawingTetromino(cellsToDraw) {
  for (let cell of cellsToDraw) {
    console.log("drawing ", cell);
    allTheCells[cell].classList.add("player");
  }
}

//Chechink the collisions
function checkIfCollide(cellsToDraw, direction) {
  console.log("check colide with direction", direction);
  return cellsToDraw.some((cell, index) => {
    if (direction === "down") {
      console.log("this is the cell", cell);
      if (cell + 10 >= 200) {
        return true;
      }
      return allTheCells[cell + 10].classList.contains("player");
    } else if (direction === "left") {
      if (cell % 10 === 0) {
        console.log("found a border left");
        return true;
      } else {
        return allTheCells[cell - 1].classList.contains("player");
      }
    } else if (direction === "right") {
      if ((cell + 1) % 10 === 0) {
        console.log("found a border right");
        return true;
      } else {
        return allTheCells[cell + 1].classList.contains("player");
      }
    } else if (direction === "up") {
      let isColliding = false;
      savedCurrentCells = cellsToDraw;

      rotateTetromino(currentTetromino);
      const theNewPosition = getTetrominoCell(currentTetromino);
      console.log("we will now check this position", theNewPosition);
      theNewPosition.forEach((cell) => {
        if (allTheCells[cell].classList.contains("player")) {
          console.log("Hello !!!!! FOUND");
          isColliding = true;
          console.log("there is a player where you want to rotate", cell);
        } else if ((cell + 1) % 10 === 0 || cell % 10 === 0) {
          isColliding = true;
        }
      });
      return isColliding;
    }
  });
}

function cleanTetromino(cellsToClean) {
  for (let cell of cellsToClean) {
    allTheCells[cell].classList.remove("player");
  }
}

function move(direction) {
  cleanTetromino(cellsToDraw);
  console.log("move launched with ", direction);
  if (direction === "left") {
    if (!checkIfCollide(cellsToDraw, direction)) {
      startY -= 1;
      cellsToDraw.forEach((cell, index) => (cellsToDraw[index] = cell - 1));
    }
  } else if (direction === "right") {
    if (!checkIfCollide(cellsToDraw, direction)) {
      startY += 1;
      cellsToDraw.forEach((cell, index) => (cellsToDraw[index] = cell + 1));
    }
  } else if (direction === "down") {
    if (!checkIfCollide(cellsToDraw, "down")) {
      goingDown();
    } else {
      cantGoDown = true;
    }
  } else if (direction === "up") {
    console.log("move ", cellsToDraw);
    //console.log("check cell 61", allTheCells[60].classList.contains("player"));
    if (!checkIfCollide(cellsToDraw, direction)) {
      getTetrominoCell(rotateTetromino(currentTetromino));
    } else {
      console.log("reseting the cells");
      cellsToDraw = savedCurrentCells;
    }
  }

  drawingTetromino(cellsToDraw);
}

function rotateTetromino(currentTetromino) {
  for (let y = 0; y < currentTetromino.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [currentTetromino[x][y], currentTetromino[y][x]] = [
        currentTetromino[y][x],
        currentTetromino[x][y],
      ];
    }
  }
  currentTetromino.reverse();
  //getTetrominoCell(currentTetromino);
  return currentTetromino;
}

function goingDown() {
  startX += 10;
  cellsToDraw.forEach((cell, index) => (cellsToDraw[index] = cell + 10));
}

document.addEventListener("keydown", (event) => {
  console.log(event.key);
  switch (event.key) {
    case "ArrowRight":
      move("right");
      break;
    case "ArrowLeft":
      move("left");
      break;
    case "ArrowDown":
      move("down");
      break;
    case "ArrowUp":
      move("up");
      break;
  }
});

startTheGame();

allTheCells[60].classList.add("player");
allTheCells[61].classList.add("player");
allTheCells[70].classList.add("player");
allTheCells[71].classList.add("player");


allTheCells[18].classList.add("player");
allTheCells[19].classList.add("player");
allTheCells[28].classList.add("player");
allTheCells[29].classList.add("player");

/*
var intervalId = window.setInterval(function () {
  // call your function here
  move("down");
}, 500);
*/

//startButton.addEventListener("click", startTheGame);

/*
allTheCells[195].classList.add("player");
allTheCells[194].classList.add("player");
allTheCells[196].classList.add("player");
allTheCells[197].classList.add("player");
*/
