const difficulties = {
    easy: { size: 8, mines: 12 },
    normal: { size: 10, mines: 20 },
    hard: { size: 25, mines: 125 }
};

let boardSize = difficulties.normal.size;
let mineCount = difficulties.normal.mines;
let board = [];
let minePositions = [];

function setDifficulty(level) {
    boardSize = difficulties[level].size;
    mineCount = difficulties[level].mines;
    resetGame();
}

function initBoard() {
    board = [];
    minePositions = [];
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;
    boardElement.style.gridTemplateRows = `repeat(${boardSize}, 30px)`;

    for (let x = 0; x < boardSize; x++) {
        const row = [];
        for (let y = 0; y < boardSize; y++) {
            const cell = {
                x,
                y,
                revealed: false,
                mine: false,
                flagged: false,
                element: document.createElement('div')
            };
            cell.element.classList.add('cell');
            cell.element.addEventListener('click', () => revealCell(cell));
            cell.element.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleFlag(cell);
            });
            boardElement.appendChild(cell.element);
            row.push(cell);
        }
        board.push(row);
    }

    placeMines();
}

function placeMines() {
    let placedMines = 0;
    while (placedMines < mineCount) {
        const x = Math.floor(Math.random() * boardSize);
        const y = Math.floor(Math.random() * boardSize);
        if (!board[x][y].mine) {
            board[x][y].mine = true;
            minePositions.push({ x, y });
            placedMines++;
        }
    }
}

function revealCell(cell) {
    if (cell.revealed || cell.flagged) return;
    cell.revealed = true;
    cell.element.classList.add('revealed');
    if (cell.mine) {
        cell.element.classList.add('mine');
        alert('Game Over!');
        resetGame();
    } else {
        const adjacentMines = countAdjacentMines(cell);
        if (adjacentMines > 0) {
            cell.element.textContent = adjacentMines;
        } else {
            revealAdjacentCells(cell);
        }
    }
}

function countAdjacentMines(cell) {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            const x = cell.x + dx;
            const y = cell.y + dy;
            if (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y].mine) {
                count++;
            }
        }
    }
    return count;
}

function revealAdjacentCells(cell) {
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            const x = cell.x + dx;
            const y = cell.y + dy;
            if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
                revealCell(board[x][y]);
            }
        }
    }
}

function toggleFlag(cell) {
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    cell.element.classList.toggle('flagged');
    cell.element.textContent = cell.flagged ? '🚩' : '';
    checkWinCondition();
}

function checkWinCondition() {
    let allMinesFlagged = true;
    for (const pos of minePositions) {
        const cell = board[pos.x][pos.y];
        if (!cell.flagged) {
            allMinesFlagged = false;
            break;
        }
    }
    if (allMinesFlagged) {
        alert('Congratulations! You won the game!');
    }
}

function resetGame() {
    initBoard();
}

document.addEventListener('DOMContentLoaded', () => {
    initBoard();
});