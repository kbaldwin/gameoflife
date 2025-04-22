const gridContainer = document.getElementById("grid-container");
const clearBtn = document.getElementById("clear-btn");
const randomizeBtn = document.getElementById("randomize-btn");
const stepBtn = document.getElementById("step-btn");
const animateBtn = document.getElementById("animate-btn");
const speedSlider = document.getElementById("speed-slider");

const GRID_WIDTH = 120;
const GRID_HEIGHT = 80;

let grid = createGrid();
let animationInterval;
let isDrawing = false;

function createGrid() {
  let grid = new Array(GRID_HEIGHT);
  for (let i = 0; i < GRID_HEIGHT; i++) {
    grid[i] = new Array(GRID_WIDTH).fill(0);
  }
  return grid;
}

function drawGrid() {
  gridContainer.innerHTML = "";
  for (let i = 0; i < GRID_HEIGHT; i++) {
    for (let j = 0; j < GRID_WIDTH; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      if (grid[i][j] === 1) {
        cell.classList.add("alive");
      }
      cell.addEventListener("mouseover", () => {
        if (isDrawing) {
          grid[i][j] = 1;
          cell.classList.add("alive");
        }
      });
      cell.addEventListener("click", () => {
        grid[i][j] = grid[i][j] === 0 ? 1 : 0;
        drawGrid();
      });
      gridContainer.appendChild(cell);
    }
  }
}

function updateGrid() {
  let nextGrid = createGrid();
  for (let i = 0; i < GRID_HEIGHT; i++) {
    for (let j = 0; j < GRID_WIDTH; j++) {
      let neighbors = countNeighbors(i, j);
      if (grid[i][j] === 1) {
        if (neighbors < 2 || neighbors > 3) {
          nextGrid[i][j] = 0;
        } else {
          nextGrid[i][j] = 1;
        }
      } else {
        if (neighbors === 3) {
          nextGrid[i][j] = 1;
        }
      }
    }
  }
  grid = nextGrid;
}

function countNeighbors(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      let newRow = row + i;
      let newCol = col + j;
      if (
        newRow >= 0 &&
        newRow < GRID_HEIGHT &&
        newCol >= 0 &&
        newCol < GRID_WIDTH
      ) {
        count += grid[newRow][newCol];
      }
    }
  }
  return count;
}

function clearGrid() {
  grid = createGrid();
  drawGrid();
}

function randomizeGrid() {
  for (let i = 0; i < GRID_HEIGHT; i++) {
    for (let j = 0; j < GRID_WIDTH; j++) {
      grid[i][j] = Math.random() < 0.5 ? 0 : 1;
    }
  }
  drawGrid();
}

function step() {
  updateGrid();
  drawGrid();
}

function animate() {
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
    animateBtn.textContent = "Animate";
  } else {
    animationInterval = setInterval(() => {
      step();
    }, 1000 / speedSlider.value);
    animateBtn.textContent = "Stop";
  }
}

clearBtn.addEventListener("click", clearGrid);
randomizeBtn.addEventListener("click", randomizeGrid);
stepBtn.addEventListener("click", step);
animateBtn.addEventListener("click", animate);
speedSlider.addEventListener("change", () => {
  if (animationInterval) {
    animate(); // Stop and restart animation with new speed
  }
});

drawGrid();

gridContainer.addEventListener("mousedown", () => {
  isDrawing = true;
});

document.addEventListener("mouseup", () => {
  isDrawing = false;
});
