// Defining my tetromino
class tetromino {
  constructor(name, matrix, color) {
    this.name = name;
    this.matrix = matrix;
    this.color = color;
  }
}

const tetro0 = new tetromino(
  tetro0,
  [
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 0],
  ],
  "yellow"
);

let tetrominoJ = [
  [2, 0, 0],
  [2, 2, 2],
  [0, 0, 0],
];

let tetrominoL = [
  [0, 0, 2],
  [2, 2, 2],
  [0, 0, 0],
];

let tetrominoS = [
  [0, 2, 2],
  [2, 2, 0],
  [0, 0, 0],
];

let tetrominoZ = [
  [2, 2, 0],
  [0, 2, 2],
  [0, 0, 0],
];

let tetrominoT = [
  [0, 2, 0],
  [2, 2, 2],
  [0, 0, 0],
];

let tetrominoI = [
  [0, 0, 0, 0],
  [1, 1, 1, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

export * from "tetromino";
