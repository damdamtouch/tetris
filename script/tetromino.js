// Defining my tetromino

class tetromino {
  constructor(name, matrix, color) {
    this.name = name;
    this.matrix = matrix;
    this.color = color;
  }
}
export const myListOfTetromino = [];

export const tetro0 = new tetromino(
  "tetro0",
  [
    [0, 0, 0],
    [1, 1, 0],
    [1, 1, 0],
  ],
  "yellow"
);

export const tetrominoJ = new tetromino(
  "tetroJ",
  [
    [0, 0, 0],
    [2, 0, 0],
    [2, 2, 2],
  ],
  "blue"
);

export const tetrominoL = new tetromino(
  "tetroL",
  [
    [0, 0, 0],
    [0, 0, 2],
    [2, 2, 2],
  ],
  "orange"
);

export const tetrominoS = new tetromino(
  "tetroS",
  [
    [0, 0, 0],
    [0, 2, 2],
    [2, 2, 0],
  ],
  "green"
);

export const tetrominoZ = new tetromino(
  "tetroZ",
  [
    [0, 0, 0],
    [2, 2, 0],
    [0, 2, 2],
  ],
  "red"
);

export const tetrominoT = new tetromino(
  "tetroT",
  [
    [0, 2, 0, 0],
    [2, 2, 2, 0],
    [0, 0, 0, 0],
  ],
  "violet"
);

export const tetrominoI = new tetromino(
  "tetroI",
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  "azure"
);

myListOfTetromino.push(
  tetro0,
  tetrominoJ,
  tetrominoL,
  tetrominoZ,
  tetrominoS,
  tetrominoT,
  tetrominoI
);
//console.log(myListOfTetromino);
