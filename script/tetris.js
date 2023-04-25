import { myListOfTetromino } from "./tetromino.js";

const startButton = document.getElementById("start");
const gridElement = document.querySelector(".grid");
const allTheCells = [];
let startX = 4;
let startY = -1;
let theGrid = [];
let savedCurrentCells = [];
let cellsToDraw = [];
let colorToApply = "";
let cantGoDown = Boolean;
let currentTetromino = [];
let listOfColoredCell = [];

// STARTING THE GAME
function creatingTheGrid() {
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
}

//Function to call tetromino

function callingTetromino() {
  //const index = Math.floor(Math.random() * myListOfTetromino.length);
  const index = 4;
  currentTetromino = myListOfTetromino[index].matrix;
  colorToApply = myListOfTetromino[index].color;
}

//function to delete a completed line
function completedLine() {
  let numberOfCellColoredPerRow = 0;
  listOfColoredCell = [];
  allTheCells.forEach((cell, index) => {
    if (cell.classList.contains("colored")) {
      if (index % 10 === 0) {
        console.log("first cell of the row is colored");
        numberOfCellColoredPerRow = 0;
      }
      numberOfCellColoredPerRow++;
      listOfColoredCell.push(index);
      if (numberOfCellColoredPerRow === 10) {
        console.log("there is a complete row");
        console.log("starting from index", index - 9);
        console.log(
          "here is the list of all previosu colored cell" + listOfColoredCell
        );
        //deleting the full line
        for (let i = index - 9; i <= index; i++) {
          allTheCells[i].classList.remove("colored");
          allTheCells[i].setAttribute("color", "");
          console.log(allTheCells[i]);
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
      }
    }
  });
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
  for (let index of cellsToDraw) {
    console.log("drawing ", index, "with color", colorToApply);
    allTheCells[index].classList.add("colored");
    allTheCells[index].setAttribute("color", colorToApply);
  }
}

//Chechink the collisions
function checkIfCollide(cellsToDraw, direction) {
  console.log("check colide with direction", direction);
  return cellsToDraw.some((cell, index) => {
    if (direction === "down") {
      //console.log("this is the cell", cell);
      if (cell + 10 >= 200) {
        return true;
      }
      return allTheCells[cell + 10].classList.contains("colored");
    } else if (direction === "left") {
      if (cell % 10 === 0) {
        console.log("found a border left");
        return true;
      } else {
        return allTheCells[cell - 1].classList.contains("colored");
      }
    } else if (direction === "right") {
      if ((cell + 1) % 10 === 0) {
        console.log("found a border right");
        return true;
      } else {
        return allTheCells[cell + 1].classList.contains("colored");
      }
    } else if (direction === "up") {
      let isColliding = false;
      savedCurrentCells = cellsToDraw;

      rotateTetromino(currentTetromino);
      const theNewPosition = getTetrominoCell(currentTetromino);
      console.log("we will now check this position", theNewPosition);
      theNewPosition.forEach((cell) => {
        if (allTheCells[cell].classList.contains("colored")) {
          console.log("Hello !!!!! FOUND");
          isColliding = true;
          console.log("there is a colored where you want to rotate", cell);
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
    allTheCells[cell].classList.remove("colored");
    allTheCells[cell].setAttribute("color", "");
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
    console.log("checking the cells to draw ", cellsToDraw);
    if (!checkIfCollide(cellsToDraw, "down")) {
      goingDown();
    } else {
      cantGoDown = true;
    }
  } else if (direction === "up") {
    console.log("move ", cellsToDraw);
    //console.log("check cell 61", allTheCells[60].classList.contains("colored"));
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

creatingTheGrid();

function startingTheGame() {
  drawingTetromino(getTetrominoCell(currentTetromino));
}

/*
var intervalId = window.setInterval(function () {
  // call your function here
  move("down");
}, 500);
*/

startButton.addEventListener("click", startingTheGame);


allTheCells[195].classList.add("colored");
allTheCells[194].classList.add("colored");
allTheCells[196].classList.add("colored");
allTheCells[197].classList.add("colored");


allTheCells[60].classList.add("colored");
allTheCells[61].classList.add("colored");
allTheCells[70].classList.add("colored");
allTheCells[71].classList.add("colored");

allTheCells[88].classList.add("colored");
allTheCells[88].setAttribute("color", "violet");
allTheCells[89].classList.add("colored");
allTheCells[89].setAttribute("color", "violet");

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
