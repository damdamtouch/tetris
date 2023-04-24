//import * as tetromino from tetromino
const startButton = document.getElementById("start");
const gridElement = document.querySelector(".grid");
const allTheCells = [];
let startX = 4;
let startY = 0;
let playerPosition = [0, 0];
let target = 10;
let theGrid = [];

let currentTetromino = [
  [2, 2, 0],
  [0, 2, 0],
  [0, 2, 0],
];

//console.log(tetromino.tetro0)
let cellsToDraw = [];

//startButton.addEventListener("click", startTheGame);

// STARTING THE GAME
function startTheGame() {
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
  getTetrominoCell(currentTetromino);
}

function callingTetromino() {}
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
  drawingTetromino(cellsToDraw);
}

function drawingTetromino(cellsToDraw) {
  for (let cell of cellsToDraw) {
    console.log("drawing ", cell);
    allTheCells[cell].classList.add("player");
  }
}

function checkIfCollide(cellsToDraw, direction) {
  console.log("check colide with directoin", direction);

  return cellsToDraw.some((cell, index) => {
    if (direction === "down") {
      return allTheCells[cell + 10].classList.contains("player");
    } else if (direction === "left") {
      let isBorderLeft = false;
      cellsToDraw.forEach((cell, index) => {
        if (cellsToDraw[index] % 10 === 0) {
          console.log("found a 0");
          isBorderLeft = true;
        }
      });
      if (isBorderLeft) {
        return true;
      } else {
        return allTheCells[cell - 1].classList.contains("player");
      }
    } else if (direction === "right") {
      let isBorderRight = false;
      cellsToDraw.forEach((cell, index) => {
        if ((cellsToDraw[index] + 1) % 10 === 0) {
          console.log("found a 0");
          isBorderRight = true;
        }
      });
      if (isBorderRight) {
        return true;
      } else {
        return allTheCells[cell - 1].classList.contains("player");
      }
    }
  });
}

function cleanTetromino(cellsToClean) {
  for (let cell of cellsToClean) {
    //console.log("cleaning ", cell);
    allTheCells[cell].classList.remove("player");
  }
}

function move(direction) {
  const currentCells = cellsToDraw;
  cleanTetromino(cellsToDraw);
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
    goingDown();
  } else if (direction === "up") {
    rotateTetromino(currentTetromino);
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
  getTetrominoCell(currentTetromino);
}

function goingDown() {
  if (checkIfCollide(cellsToDraw, "down")) {
    return;
  }
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

/* Legacy move function
function move(direction) {
  cleanTetromino();
  if (direction === "right") {
    if ((playerPosition + 1) % 10 === 0) {
      return movingTetromino();
    }
    playerPosition += 1;
  }

  if (direction === "left") {
    if (playerPosition % 10 === 0) {
      return movingTetromino();
    }
    playerPosition -= 1;
  }
  if (direction === "up") {
    if (playerPosition < 10) {
      return movingTetromino();
    }
    playerPosition -= 10;
  }
  if (direction === "down") {
    if (playerPosition >= 90) {
      return movingTetromino();
    }
    playerPosition += 10;
  }
  movingTetromino();
  // console.log(allTheCells[playerPosition].classList.contains("target"))
  if (allTheCells[playerPosition].classList.contains("target")) {
    allTheCells[playerPosition].classList.remove("target");
  }
}
*/

let tetrominoS = [
  [0, 2, 2],
  [2, 2, 0],
  [0, 0, 0],
];

allTheCells[60].classList.add("player");
allTheCells[61].classList.add("player");
allTheCells[70].classList.add("player");
allTheCells[71].classList.add("player");
