const startButton = document.getElementById("start");
const gridElement = document.querySelector(".grid");
const allTheCells = [];
let startX = 4;
let startY = 0;
let playerPosition = [0, 0];
let target = 10;
let theGrid = [];
let currentTetromino2 = [
  [2, 0, 0],
  [2, 2, 2],
  [0, 0, 0],
];

let currentTetromino = [
  [2, 2, 0],
  [0, 2, 0],
  [0, 2, 0],
];

let lineTetrominos = [
  [0, 0, 0, 0],
  [1, 1, 1, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
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

  /*console.log(theGrid);
  console.log(theGrid[0][2]);
  console.log("salut ", playerPosition);
  console.log(playerPosition[0] * 10 + playerPosition[1]);
  console.log(allTheCells); */
  getTetrominoCell(currentTetromino);
}

function getTetrominoCell(currentTetromino) {
  console.log(currentTetromino);
  cellsToDraw = [];
  for (let i = 0; i < currentTetromino.length; i++) {
    for (let j = 0; j < currentTetromino[i].length; j++) {
      if (currentTetromino[i][j]) {
        let myInlineRowPosition = startX + i * 10 + j;
        cellsToDraw.push(myInlineRowPosition);
      }
    }
  }
  drawingTetromino(cellsToDraw);
}

function drawingTetromino(cellsToDraw) {
  for (let cell of cellsToDraw) {
    console.log("drawing ", cell);
    allTheCells[cell].classList.add("player");
  }
  console.log("finished drawing");
}

function cleanTetromino(cellsToClean) {
  for (let cell of cellsToClean) {
    console.log("cleaning ", cell);
    allTheCells[cell].classList.remove("player");
  }
}

function movingTetromino(direction) {
  console.log("can i play with ", cellsToDraw);
  console.log("i have to move", direction);
  console.log(cellsToDraw);
  if (direction === "left") {
    cellsToDraw.forEach((cell, index) => (cellsToDraw[index] = cell - 1));
  } else if (direction === "right") {
    cellsToDraw.forEach((cell, index) => (cellsToDraw[index] = cell + 1));
  } else if (direction === "down") {
    cellsToDraw.forEach((cell, index) => (cellsToDraw[index] = cell + 10));
  } else if (direction === "up") {
    rotateTetromino(currentTetromino);
  }
  drawingTetromino(cellsToDraw);
}

function rotateTetromino(a) {
  console.log("je dois nettoyer ", cellsToDraw);
  cleanTetromino(cellsToDraw);
  currentTetromino = a.map((_, colIndex) => a.map((row) => row[colIndex]));
  console.log(currentTetromino);
  getTetrominoCell(currentTetromino);
}

function move(direction) {
  cleanTetromino(cellsToDraw);
  console.log((direction, " received"));
  movingTetromino(direction);
}

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
