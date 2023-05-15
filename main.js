const switchButton = document.querySelector("button");
const body = document.querySelector("body");
let darkUserPrefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
let theme = localStorage.getItem("theme");

let blockVariables;
let backgroundVariables;

if (darkUserPrefers) {
  blockVariables = "white";
  backgroundVariables = "black";
} else {
  blockVariables = "black";
  backgroundVariables = "white";
}

switchButton.addEventListener("click", () => {
  if (theme === "dark") {
    body.classList.remove("dark");
    body.classList.add("light");
    blockVariables = "black";
    backgroundVariables = "white";
    theme = "light";
  } else {
    body.classList.remove("light");
    body.classList.add("dark");
    blockVariables = "white";
    backgroundVariables = "black";
    theme = "dark";
  }

  localStorage.setItem("theme", theme);
});

if (theme === "dark") {
  body.classList.add("dark");
  blockVariables = "white";
  backgroundVariables = "black";
}

if (theme === "light") {
  body.classList.add("light");
  blockVariables = "black";
  backgroundVariables = "white";
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let grid;
const resolution = 5;
const cols = canvas.height / resolution;
const rows = canvas.width / resolution;

function init() {
  grid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = getRandomInteger(0, 1);
    }
  }
  strokeGridInCanvas(grid);
  requestAnimationFrame(update);

  function update() {
    grid = runGameOfLife(grid);
    strokeGridInCanvas(grid);
    requestAnimationFrame(update);
  }
}

function runGameOfLife(oldGrid) {
  const newGrid = arrCopy(oldGrid);

  for (let col = 0; col < oldGrid.length; col++) {
    for (let row = 0; row < oldGrid[col].length; row++) {
      const currentCell = oldGrid[col][row];
      let sumNeighbor = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (
            col + i >= 0 &&
            col + i < oldGrid.length &&
            row + j >= 0 &&
            row + j < oldGrid[col].length
          ) {
            const currentNeighbor = oldGrid[col + i][row + j];
            sumNeighbor += currentNeighbor;
          }
        }
      }
      sumNeighbor -= currentCell;

      if (currentCell == 1 && sumNeighbor < 2) {
        newGrid[col][row] = 0;
      } else if (currentCell == 1 && sumNeighbor > 3) {
        newGrid[col][row] = 0;
      } else if (currentCell == 0 && sumNeighbor == 3) {
        newGrid[col][row] = 1;
      }
    }
  }
  return newGrid;
}

function arrCopy(arr) {
  let arr2 = arr.map((val) => {
    if (Array.isArray(val)) {
      return arrCopy(val);
    } else {
      return val;
    }
  });
  return arr2;
}

function strokeGridInCanvas(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];

      ctx.fillStyle = cell ? blockVariables : backgroundVariables;
      ctx.fillRect(row * resolution, col * resolution, resolution, resolution);
    }
  }
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

init();
