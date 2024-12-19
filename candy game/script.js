document.addEventListener("DOMContentLoaded", () => {
    candyCrushGame();
});

function candyCrushGame() {
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const movesDisplay = document.getElementById("moves");
    const width = 8;
    const squares = [];
    const candyColors = [
        "url('https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/red-candy.png')",
        "url('https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/blue-candy.png')",
        "url('https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/green-candy.png')",
        "url('https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/yellow-candy.png')",
        "url('https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/orange-candy.png')",
        "url('https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/purple-candy.png')",
    ];
    let score = 0;
    let moves = 0; // Counter for moves
    let gameOver = false;

    // Sound effects
    const moveSound = new Audio('sounds/move.mp3.wav');
    const gameOverSound = new Audio('sounds/gameover.mp3.wav');

    // Create the game board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);
            const randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = candyColors[randomColor];
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    let colorBeingDragged, colorBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced;
    squares.forEach((square) => square.addEventListener("dragstart", dragStart));
    squares.forEach((square) => square.addEventListener("dragend", dragEnd));
    squares.forEach((square) => square.addEventListener("dragover", dragOver));
    squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
    squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
    squares.forEach((square) => square.addEventListener("drop", dragDrop));

    function dragStart() {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
        moveSound.play(); // Play move sound when a candy is dragged
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {}

    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }

    function dragEnd() {
        const validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width,
        ];
        const validMove = validMoves.includes(squareIdBeingReplaced);
        if (squareIdBeingReplaced && validMove) {
            moves += 1; // Increment the move counter when a valid move is made
            movesDisplay.innerHTML = `Moves: ${moves}`; // Update the display
            squareIdBeingReplaced = null;
        } else {
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
        }
    }

    function checkRowForThree() {
        for (let i = 0; i < 61; i++) {
            const rowOfThree = [i, i + 1, i + 2];
            const decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (
                rowOfThree.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                score += 3;
                scoreDisplay.innerHTML = score; // This updates the score number
                rowOfThree.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
                scoreSound.play(); // Play score sound when candies match
            }
        }
    }

    function checkColumnForThree() {
        for (let i = 0; i < 47; i++) {
            const columnOfThree = [i, i + width, i + width * 2];
            const decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (
                columnOfThree.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                score += 3;
                scoreDisplay.innerHTML = score;
                columnOfThree.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
                scoreSound.play(); // Play score sound when candies match
            }
        }
    }

    // Function to move candies down to fill empty spaces
    function moveCandiesDown() {
        for (let i = 0; i < 55; i++) {
            if (squares[i + width].style.backgroundImage === "") {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = "";
            }
        }
    }

    // Fill empty spaces at the top with random candies
    function fillEmptySpaces() {
        for (let i = 0; i < width; i++) {
            if (squares[i].style.backgroundImage === "") {
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundImage = candyColors[randomColor];
            }
        }
    }

    // Function to check if there are any valid moves left
    function checkValidMoves() {
        for (let i = 0; i < width * width; i++) {
            const validMoves = [
                i - 1,
                i + 1,
                i - width,
                i + width,
            ];

            const currentColor = squares[i].style.backgroundImage;

            for (let move of validMoves) {
                if (move >= 0 && move < width * width) {
                    if (squares[move].style.backgroundImage !== "" && squares[move].style.backgroundImage !== currentColor) {
                        return true; // There is a valid move
                    }
                }
            }
        }
        return false; // No valid moves left
    }

    // Check game over condition when no valid moves left
    function checkGameOver() {
        if (!checkValidMoves()) {
            gameOver = true;
            gameOverSound.play(); // Play game over sound
            alert("Game Over! Your score is: " + score);
        }
    }

    window.setInterval(() => {
        if (!gameOver) {
            checkRowForThree();
            checkColumnForThree();
            moveCandiesDown();
            fillEmptySpaces();
            checkGameOver();
        }
    }, 100);
}
