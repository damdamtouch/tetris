import { myListOfTetromino } from "./tetromino.js";

// HTML Elements
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const gridElement = document.querySelector(".grid");
const allTheCells = [];

// Default var
let startX = 4;
let startY = -1;
let theGrid = [];
let cellsToDraw = [];
let colorToApply = "";
let currentTetromino = [];
let intervalId = 0;
let tetrominoPicked = [0, 0, 0, 0, 0, 0, 0];
let tetrominoSZinaRow = 0;
let cantGoDown = Boolean;

//Save data for the rotation test
let savedTetrominoToTest = [];
let savedCurrentCells = [];

// Var for deleting completed row
let listOfColoredCell = [];
let completedRow = 0;
let score = 0;

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

//Function to call tetromino

function callingTetromino() {
  //const index = Math.floor(Math.random() * myListOfTetromino.length);
  const index = 5;
  tetrominoPicked[index] += 1;

  //because you can't have the tetromino S and Z more than for times in a row
  if (index === 3) {
    tetrominoSZinaRow += 1;
  } else if (index === 4) {
    tetrominoSZinaRow += 1;
  } else {
    tetrominoSZinaRow = 0;
  }

  currentTetromino = myListOfTetromino[index].matrix;
  colorToApply = myListOfTetromino[index].color;
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
  console.log("end of getTetrominoCell ", cellsToDraw);
  return cellsToDraw;
}

//Re-Creating the function that create the list of new cell to make test (the above edit "cellToDraw" general variable and make actual change)
function getTetrominoCellToTest(tetrominoToTest) {
  let cellsToTert = [];
  for (let i = 0; i < tetrominoToTest.length; i++) {
    for (let j = 0; j < tetrominoToTest[i].length; j++) {
      if (tetrominoToTest[i][j]) {
        let myInlineRowPosition = startX + i * 10 + j + startY;
        cellsToTert.push(myInlineRowPosition);
      }
    }
  }
  console.log("end of getTetrominoCellToTest ", cellsToTert);
  return cellsToTert;
}

// STARTING THE TESTS

function checkIfCollide(cellsToDraw, direction) {
  //console.log("check colide with direction", direction);
  console.log("salut les cells to draw", cellsToDraw, direction);

  //Testing collisions down/left/right
  if (direction === "down" || direction === "left" || direction === "right") {
    return cellsToDraw.some((cell, index) => {
      if (direction === "down") {
        //console.log("this is the cell", cell);
        if (cell + 10 >= 200) {
          cantGoDown = true;
          return true;
        }
        return allTheCells[cell + 10].classList.contains("colored");
      } else if (direction === "left") {
        if (cell % 10 === 0) {
          console.log("found a border left");
          return true;
        } else {
          //console.log("found something on leftt");
          return allTheCells[cell - 1].classList.contains("colored");
        }
      } else if (direction === "right") {
        if ((cell + 1) % 10 === 0) {
          console.log("found a border right");
          return true;
        } else {
          return allTheCells[cell + 1].classList.contains("colored");
        }
      }
    });
    //Starting to test if the rotation is possible
  } else if (direction === "up") {
    let isColliding = false;
    savedCurrentCells = cellsToDraw;
    console.log("we saved the cellsToDraw", cellsToDraw);

    console.log("we gonna rotate to test");
    let rotatedTetromino = currentTetromino;
    rotateTetromino(rotatedTetromino);

    let theNewPosition = getTetrominoCellToTest(rotatedTetromino);
    console.log("we will now check this position", theNewPosition);
    let sideOfTheScreen = "";
    //Start testing
    theNewPosition.some((cell) => {
      if (cell > 200) {
        console.log("can't go too down");
        isColliding = true;
        return;
      }
      cellsToDraw.some((currentCell) => {
        if (currentCell.toString().slice(-1) < 5) {
          console.log("we're on the left of the screen");
          sideOfTheScreen = "left";
        } else {
          console.log("we're on the right of the screen");
          sideOfTheScreen = "right";
        }
      });
      if (allTheCells[cell].classList.contains("colored")) {
        console.log("Hello !!!!! FOUND");
        isColliding = true;
        console.log("there is a colored where you want to rotate", cell);
      }
      //Here we're testing if the rotated list of cell are going on the other side of the screen
      if (sideOfTheScreen === "left" && (cell % 10).toString().endsWith("9")) {
        console.log("probleme with border on left");
        console.log("with cell ", cell);
        isColliding = true;
      } else if (sideOfTheScreen === "right" && cell % 10 === 0) {
        console.log("probleme with border on right");
        console.log("with cell ", cell);
        isColliding = true;
      }
    });
    if (!isColliding) {
      getTetrominoCell(rotatedTetromino);
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

function move(direction) {
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
    } else {
      cantGoDown = true;
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

function rotateTetromino(tetrominoToRotate) {
  for (let y = 0; y < tetrominoToRotate.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [tetrominoToRotate[x][y], tetrominoToRotate[y][x]] = [
        tetrominoToRotate[y][x],
        tetrominoToRotate[x][y],
      ];
    }
  }
  tetrominoToRotate.reverse();
  return tetrominoToRotate;
}

function goingDown() {
  startX += 10;
  cellsToDraw.forEach((cell, index) => (cellsToDraw[index] = cell + 10));
}

document.addEventListener("keydown", (event) => {
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
      cleaningVariables();
      completedLine();
      startingTheGame();
      break;
    case " ":
      for (let i = 0; i < 20; i++) {
        move("down");
      }
      cleaningVariables();
      completedLine();
      startingTheGame();
      break;
  }
});

creatingTheGrid();

function startingTheGame() {
  callingTetromino();
  drawingTetromino(getTetrominoCell(currentTetromino));
  /*
  intervalId = window.setInterval(function () {
    // call your function here
    move("down");
  }, 25000 / 60);*/
}
function pauseTheGame() {
  if (pauseButton.innerText === "Pause") {
    clearInterval(intervalId);
    pauseButton.innerText = "Resume";
  } else {
    intervalId = window.setInterval(function () {
      // call your function here
      move("down");
    }, 25000 / 60);
    pauseButton.innerText = "Pause";
  }
}
function cleaningVariables() {
  startX = 4;
  startY = -1;
  listOfColoredCell = [];
}
/*
var intervalId = window.setInterval(function () {
  // call your function here
  move("down");
}, 500);
*/

//allTheCells[9].classList.add("colored");
//allTheCells[19].classList.add("colored");
startButton.addEventListener("click", startingTheGame);
pauseButton.addEventListener("click", callingTetromino);

allTheCells[60].classList.add("colored");
allTheCells[61].classList.add("colored");
allTheCells[70].classList.add("colored");
allTheCells[71].classList.add("colored");

allTheCells[88].classList.add("colored");
allTheCells[88].setAttribute("color", "violet");
allTheCells[89].classList.add("colored");
allTheCells[89].setAttribute("color", "violet");

/*
allTheCells[195].classList.add("colored");
allTheCells[194].classList.add("colored");
allTheCells[196].classList.add("colored");
allTheCells[197].classList.add("colored");

allTheCells[150].classList.add("colored");
allTheCells[150].setAttribute("color", "violet");
allTheCells[151].classList.add("colored");
allTheCells[151].setAttribute("color", "violet");
allTheCells[152].classList.add("colored");
allTheCells[152].setAttribute("color", "violet");
allTheCells[153].classList.add("colored");
allTheCells[153].setAttribute("color", "violet");
allTheCells[154].classList.add("colored");
allTheCells[154].setAttribute("color", "violet");
allTheCells[155].classList.add("colored");
allTheCells[155].setAttribute("color", "violet");
allTheCells[156].classList.add("colored");
allTheCells[156].setAttribute("color", "violet");
allTheCells[157].classList.add("colored");
allTheCells[157].setAttribute("color", "violet");
allTheCells[158].classList.add("colored");
allTheCells[158].setAttribute("color", "violet");
allTheCells[159].classList.add("colored");
allTheCells[159].setAttribute("color", "violet");

allTheCells[140].classList.add("colored");
allTheCells[140].setAttribute("color", "azure");
allTheCells[141].classList.add("colored");
allTheCells[141].setAttribute("color", "azure");
allTheCells[142].classList.add("colored");
allTheCells[142].setAttribute("color", "azure");
allTheCells[143].classList.add("colored");
allTheCells[143].setAttribute("color", "azure");
allTheCells[144].classList.add("colored");
allTheCells[144].setAttribute("color", "azure");
allTheCells[145].classList.add("colored");
allTheCells[145].setAttribute("color", "orange");
allTheCells[146].classList.add("colored");
allTheCells[146].setAttribute("color", "azure");
allTheCells[147].classList.add("colored");
allTheCells[147].setAttribute("color", "azure");
allTheCells[148].classList.add("colored");
allTheCells[148].setAttribute("color", "azure");
allTheCells[149].classList.add("colored");
allTheCells[149].setAttribute("color", "azure");

allTheCells[165].classList.add("colored");
allTheCells[165].setAttribute("color", "azure");
*/
