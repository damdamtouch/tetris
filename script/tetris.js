import { myListOfTetromino } from "./tetromino.js";
import { activeMobileMode } from "./mobileSupport.js";

// HTML Elements
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const gridElement = document.querySelector(".grid");
const allTheCells = [];
activeMobileMode();

// Default var
let startX = 4;
let startY = -1;
let theGrid = [];
let cellsToDraw = [];
let colorToApply = "";
let currentTetromino = [];
const bagOfTetromino = [];
let tetrominoIndex = 0;
let tetrominoPicked = [0, 0, 0, 0, 0, 0, 0];
let keepedTetromino = [];
let keepedColor = "blue";
let downID = 0;
let newlineID = 0;
let intervalToLock = 0;

//Save data for the rotation test
let savedCurrentCells = [];

// Var for deleting completed row
let listOfColoredCell = [];
let completedRow = 0;

// STARTING THE GAME
function creatingTheGrid() {
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
}

//Function to call the matrix of a tetromino

function creatingTheBagOfTetromino() {
  //Creating a bag of tetromino, with a length of 14 (tetris guidelines)
  myListOfTetromino.sort(() => Math.random() - 0.5);
  //console.log("we are creating the bag", myListOfTetromino);
}
function callingTetromino() {
  if (tetrominoIndex === 7) {
    //console.log("we reached 7");
    creatingTheBagOfTetromino();
    tetrominoIndex = 0;
  }

  currentTetromino = myListOfTetromino[tetrominoIndex].matrix;
  colorToApply = myListOfTetromino[tetrominoIndex].color;
  tetrominoIndex++;
  //console.log(tetrominoPicked);
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
  //console.log("end of getTetrominoCell ", cellsToDraw);
  return cellsToDraw;
}

//Re-Creating the function that create the list of new cell to make test (the above edit "cellToDraw" general variable and make actual change)
function getTetrominoCellToTest(tetrominoToTest) {
  let cellsToTest = [];
  for (let i = 0; i < tetrominoToTest.length; i++) {
    for (let j = 0; j < tetrominoToTest[i].length; j++) {
      if (tetrominoToTest[i][j]) {
        let myInlineRowPosition = startX + i * 10 + j + startY;
        cellsToTest.push(myInlineRowPosition);
      }
    }
  }
  //console.log("end of getTetrominoCellToTest ", cellsToTest);
  return cellsToTest;
}

// STARTING THE TESTS

function checkIfCollide(cellsToDraw, direction) {
  //console.log("check colide with direction", direction);
  //console.log("salut les cells to draw", cellsToDraw, direction);

  //Testing collisions down/left/right
  if (
    direction === "down" ||
    direction === "left" ||
    direction === "right" ||
    direction === "losing"
  ) {
    const touched = cellsToDraw.some((cell, index) => {
      if (direction === "down") {
        //console.log("this is the cell", cell);
        if (cell + 10 >= 200) {
          return true;
        }
        return allTheCells[cell + 10].classList.contains("colored");
      } else if (direction === "losing") {
        return allTheCells[cell].classList.contains("colored");
      } else if (direction === "left") {
        if (cell % 10 === 0) {
          //console.log("found a border left");
          return true;
        } else {
          //console.log("found something on left");
          return allTheCells[cell - 1].classList.contains("colored");
        }
      } else if (direction === "right") {
        if ((cell + 1) % 10 === 0) {
          //console.log("found a border right");
          return true;
        } else {
          return allTheCells[cell + 1].classList.contains("colored");
        }
      }
    });
    //console.log(touched, " touche");
    return touched;
    //Starting to test if the rotation is possible
  } else if (direction === "up") {
    let isColliding = false;
    savedCurrentCells = cellsToDraw;
    //console.log("we saved the cellsToDraw", cellsToDraw);

    //console.log("we gonna rotate to test");
    let rotatedTetromino = structuredClone(currentTetromino);
    rotateTetromino(rotatedTetromino);

    let theNewPosition = getTetrominoCellToTest(rotatedTetromino);
    //console.log("we will now check this position", theNewPosition);
    let sideOfTheScreen = "";
    //Start testing
    theNewPosition.some((cell) => {
      if (cell > 200) {
        //console.log("can't go too down");
        isColliding = true;
        return;
      }
      savedCurrentCells.some((currentCell) => {
        if (currentCell.toString().slice(-1) < 5) {
          //console.log("we're on the left of the screen");
          sideOfTheScreen = "left";
        } else {
          //console.log("we're on the right of the screen");
          sideOfTheScreen = "right";
        }
      });
      if (allTheCells[cell].classList.contains("colored")) {
        //console.log("Hello !!!!! FOUND");
        isColliding = true;
        //console.log("there is a colored where you want to rotate", cell);
      }
      //Here we're testing if the rotated list of cell are going on the other side of the screen
      if (sideOfTheScreen === "left" && (cell % 10).toString().endsWith("9")) {
        //console.log("probleme with border on left");
        //console.log("with cell ", cell);
        isColliding = true;
      } else if (sideOfTheScreen === "right" && cell % 10 === 0) {
        //console.log("probleme with border on right");
        //console.log("with cell ", cell);
        isColliding = true;
      }
    });
    if (!isColliding) {
      rotateTetromino(currentTetromino);
      getTetrominoCell(currentTetromino);
      return isColliding;
    }
  }
}

//function to delete a completed line
function completedLine() {
  let numberOfCellColoredPerRow = 0;
  listOfColoredCell = [];
  allTheCells.forEach((cell, index) => {
    if (index % 10 === 0) {
      //Reseting the compteur on first cell of each line
      numberOfCellColoredPerRow = 0;
    }
    if (cell.classList.contains("colored")) {
      numberOfCellColoredPerRow++;
      listOfColoredCell.push(index);
      if (numberOfCellColoredPerRow === 10) {
        for (let i = index - 9; i <= index; i++) {
          allTheCells[i].classList.remove("colored");
          allTheCells[i].setAttribute("color", "");
        }
        //shift down all the previous lines
        listOfColoredCell
          .slice()
          .reverse()
          .forEach((coloredLineIndex) => {
            if (coloredLineIndex < index - 9) {
              allTheCells[coloredLineIndex].classList.remove("colored");
              let theColorAttribute =
                allTheCells[coloredLineIndex].getAttribute("color");
              allTheCells[coloredLineIndex].setAttribute("color", "");
              allTheCells[coloredLineIndex + 10].classList.add("colored");
              allTheCells[coloredLineIndex + 10].setAttribute(
                "color",
                theColorAttribute
              );
            }
          });
        //Recalling the function in the case of several completed row
        completedLine();
        completedRow++;
        document.getElementById("lines").innerText = completedRow;
        document.getElementById("score").innerText = completedRow * 200;
      }
    }
  });
}

// DRAWING AND DELETING
//Actually applying the class to the cell to color them
function drawingTetromino(cellsToDraw) {
  for (let index of cellsToDraw) {
    //console.log("drawing ", index, "with color", colorToApply);
    allTheCells[index].classList.add("colored");
    allTheCells[index].setAttribute("color", colorToApply);
  }
}

function cleanTetromino(cellsToClean) {
  //console.log("using cleanTetromino");
  for (let cell of cellsToClean) {
    allTheCells[cell].classList.remove("colored");
    allTheCells[cell].setAttribute("color", "");
  }
}
//END OF DRAWING AND DELETING

//MOVING FUNCTION => Will launch the collisions tests

export function move(direction) {
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
    //console.log("checking the cells to draw ", cellsToDraw);
    if (!checkIfCollide(cellsToDraw, "down")) {
      goingDown();
    }
  } else if (direction === "up") {
    if (!checkIfCollide(cellsToDraw, direction)) {
      //getTetrominoCell(rotateTetromino(currentTetromino));
    } else {
      console.log("reseting the cells edited cells ", cellsToDraw);
      console.log("restoring cells to ", savedCurrentCells);

      //cellsToDraw = savedCurrentCells;
    }
  }

  drawingTetromino(cellsToDraw);
}

//Rotate the Matrix of the selected tetromino  : Honesty force me to admit this is not my code... tried to use .map()
function rotateTetromino(tetrominoToRotate) {
  let n = tetrominoToRotate.length;
  for (let i = 0; i < n / 2; i++) {
    for (let j = i; j < n - i - 1; j++) {
      let tmp = tetrominoToRotate[i][j];
      tetrominoToRotate[i][j] = tetrominoToRotate[n - j - 1][i];
      tetrominoToRotate[n - j - 1][i] = tetrominoToRotate[n - i - 1][n - j - 1];
      tetrominoToRotate[n - i - 1][n - j - 1] = tetrominoToRotate[j][n - i - 1];
      tetrominoToRotate[j][n - i - 1] = tmp;
    }
  }
  return tetrominoToRotate;
}

//Function to go down

function spaceBarPressed() {
  for (let i = 0; i < 20; i++) {
    move("down");
  }
  cleaningVariables();
  completedLine();
  startingTheGame();
}

// The function to go down, it resets automaticaly the interval that will call a new piece after 1,5sec without moving
function goingDown() {
  startX += 10;
  clearInterval(intervalToLock);
  intervalToLock = setTimeout(() => startingNewPiece(), 1500);
  cellsToDraw.forEach((cell, index) => (cellsToDraw[index] = cell + 10));
}

let test = document.addEventListener("keydown", (event) => {
  //console.log(event.key);
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
    case "Enter":
      pauseTheGame();
      break;
    case " ":
      spaceBarPressed();
      break;
    case "k":
      //creatingTheBagOfTetromino();
      keepThePiece();
      break;
  }
});

creatingTheGrid();

function startingTheGame(storedTetromino) {
  //console.log("hello from starting the game");
  if (storedTetromino) {
    cleanTetromino(cellsToDraw);
    cleaningVariables();
    getTetrominoCell(storedTetromino);
    drawingTetromino(cellsToDraw);
  } else {
    callingTetromino();
    getTetrominoCell(currentTetromino);
    //console.log(cellsToDraw);
    if (!checkIfCollide(cellsToDraw, "losing")) {
      drawingTetromino(cellsToDraw);
    } else {
      if (alert("you lose looser")) {
      } else window.location.reload();
    }
  }
}

function keepThePiece() {
  //console.log("you want to keep ", currentTetromino);
  if (keepedTetromino.length !== 0) {
    // console.log("and now here");
    const currentTetrominoToStore = currentTetromino;
    const currentColorToStore = colorToApply;
    colorToApply = keepedColor;
    currentTetromino = keepedTetromino;
    startingTheGame(keepedTetromino);
    keepedTetromino = currentTetrominoToStore;
    keepedColor = currentColorToStore;
  } else {
    //console.log("i shlould be here");
    keepedTetromino = currentTetromino;
    keepedColor = colorToApply;
    cleanTetromino(cellsToDraw);
    cleaningVariables();
    completedLine();
    startingTheGame();
  }
}

function pauseTheGame() {
  if (pauseButton.innerText === "Pause") {
    clearInterval(newlineID);
    clearInterval(intervalToLock);
    clearInterval(downID);
    document.removeEventListener("keydown", (event) => {});
    pauseButton.innerText = "Resume";
  } else {
    newlineID = window.setInterval(createNewBottomLine, 10000);
    intervalToLock = setTimeout(() => startingNewPiece(), 2000);
    downID = window.setInterval(function () {
      // call your function here
      move("down");
    }, 1000);
    pauseButton.innerText = "Pause";
  }
}

function cleaningVariables() {
  startX = 4;
  startY = -1;
  listOfColoredCell = [];
  cellsToDraw = [];
}

function startingNewPiece() {
  //console.log("create new piece");
  cleaningVariables();
  completedLine();
  startingTheGame();
}

function createNewBottomLine() {
  //console.log("actual place of tetromino", cellsToDraw);
  cleanTetromino(cellsToDraw);
  let listOfColoredCellToMoveUp = [];
  allTheCells.forEach((cell, index) => {
    if (cell.classList.contains("colored")) {
      if (cell - 10 < 0) {
        alert("you loose");
      } else {
        listOfColoredCellToMoveUp.push(index);
      }
    }
  });
  listOfColoredCellToMoveUp.forEach((coloredLineIndex) => {
    if (coloredLineIndex) {
      allTheCells[coloredLineIndex].classList.remove("colored");
      let theColorAttribute =
        allTheCells[coloredLineIndex].getAttribute("color");
      allTheCells[coloredLineIndex].setAttribute("color", "");
      allTheCells[coloredLineIndex - 10].classList.add("colored");
      allTheCells[coloredLineIndex - 10].setAttribute(
        "color",
        theColorAttribute
      );
    }
  });
  const cellToLetEmpty = Math.floor(Math.random() * 9 + 190);
  //console.log(cellToLetEmpty);
  for (let i = 190; i < 200; i++) {
    if (i !== cellToLetEmpty) {
      allTheCells[i].classList.add("colored");
      allTheCells[i].setAttribute("color", "gray");
    }
  }
}

function playButton() {
  newlineID = window.setInterval(createNewBottomLine, 10000);
  downID = window.setInterval(function () {
    move("down");
  }, 1000);
  startingTheGame();
  startButton.disabled = true;
}

startButton.addEventListener("click", playButton);
pauseButton.addEventListener("click", pauseTheGame);
