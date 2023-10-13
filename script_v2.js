let gridDisplay = document.querySelector(".grid");
const width = 4;

document.addEventListener("DOMContentLoaded", () => {
    gridDisplay = document.querySelector(".grid");
    let resultBoard = document.querySelector(".result-board");
    let squares = [];
    let highscore = document.getElementById("bestscore");
    let score = document.getElementById("score");
    let result = document.getElementById("result");
    let previous_squares = [];

    if (loadHighscore())
        highscore.innerText = loadHighscore();
    else
        highscore.innerText = 0;

    function generateNewNumber(arr = []) {
        if (arr.length != 0) {
            squares[arr[0]].innerText = 2;
            squares[arr[1]].innerText = 2;
            squares[arr[2]].innerText = 2;
            squares[arr[3]].innerText = 2;
        }
        else {
            let randomPosition = Math.floor(Math.random() * squares.length);
            if (squares[randomPosition].innerText == 0) {
                squares[randomPosition].innerText = 2;
                checkLose();
            }
            else {
                generateNewNumber();
            }
        }
    }

    function deepCopyArr(squares) {
        squares_value = squares.map((square) => square.innerText);
        copy_square = JSON.parse(JSON.stringify(squares_value));
        return copy_square;
    }

    function condition_generateNewNumber(prev_arr, aft_arr) {
        aft_arr = aft_arr.map((element) => element.innerText);
        if (prev_arr.every((element, index) => element === aft_arr[index])) {
            console.log("stuck");
        }
        else
            generateNewNumber();
    }


    function createGameBoard() {
        for (let i = 0; i < width * width; i++) {
            let square = document.createElement("div");
            square.classList.add("cell");
            let num = document.createElement("p");
            num.innerText = 0;
            square.appendChild(num);
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        generateNewNumber([]);
        generateNewNumber();
        previous_squares = squares;

    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    function rgbToHex(color) {
        color.r = Math.abs(color.r);
        color.g = Math.abs(color.g);
        color.b = Math.abs(color.b);

        if (color.r < 0) color.r = 0;
        if (color.g < 0) color.g = 0;
        if (color.b < 0) color.b = 0;

        if (color.r > 255) color.r -= 255;
        if (color.g > 255) color.g -= 255;
        if (color.b > 255) color.b -= 255;

        return '#' + [color.r, color.g, color.b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex
        }).join('');
    }

    function makeColor() {
        baseColor = "#afa192";
        base_rgb = hexToRgb(baseColor);
        color_2 = "#E0CDB7";
        rgb_2 = hexToRgb(color_2);
        baseFontSize = 60;

        for (let i in squares) {
            if (squares[i].innerText == 0) {
                squares[i].style.backgroundColor = baseColor;
                squares[i].style.color = baseColor;
            }
            else {

                new_color_rgb = {
                    r: rgb_2.r + 32 * Math.ceil(Math.log2(squares[i].innerText - 1)),
                    g: rgb_2.g + 32 * Math.ceil(Math.log2(squares[i].innerText - 1)),
                    b: rgb_2.b + -32 * Math.ceil(Math.log2(squares[i].innerText - 1))
                };
                new_color_hex = rgbToHex(new_color_rgb);
                squares[i].style.backgroundColor = new_color_hex;
                squares[i].style.color = "white";
                fontSize = baseFontSize - Math.ceil(Math.log2(squares[i].innerText)) - 5;
                squares[i].style.fontSize = fontSize.toString() + "px";
            }
        }
    }

    function assertArray(array) {
        const size = 4;
        const resultArray = [];

        for (let i = 0; i < array.length; i++) {
            const row = Math.floor(i / size);
            const col = i % size;

            if (array[i].innerText !== 0) {
                const neighbors = [
                    [row - 1, col], // above
                    [row + 1, col], // below
                    [row, col - 1], // left
                    [row, col + 1], // right
                ];

                let isSame = false;

                for (const [neighborRow, neighborCol] of neighbors) {

                    if (
                        neighborRow >= 0 &&
                        neighborRow < size &&
                        neighborCol >= 0 &&
                        neighborCol < size
                    ) {
                        const neighborIndex = neighborRow * size + neighborCol;

                        if (array[i].innerText === array[neighborIndex].innerText) {
                            isSame = true;
                            break;
                        }
                    }
                }

                resultArray.push(!isSame);
            } else {
                resultArray.push(false);
            }
        }

        return resultArray;
    }

    function stopGame() {
        document.reactionEventListener('keyup', detectKey);
        setTimeout(() => clearInterval(myTimer), 100);

    }

    function checkWin() {
        for (let i in squares)
            if (squares[i].innerText == 2048) {
                console.log("You Win!");
                result.innerText = "You Win!";
                result.style.visibility = "visible";
                result.style.color = "yellow";
                resultBoard.style.visibility = "visible";
                stopGame();
            }
    }


    function checkLose() {
        const res = assertArray(squares);
        let count = 0
        for (let i in res) {
            if (res[i] == false)
                count++;
        }
        if (count === 0 && squares.every((square) => square.innerText != 0)) {
            result.innerText = "You Lose!";
            result.style.visibility = "visible";
            resultBoard.style.visibility = "visible";
            stopGame();
        }
    }

    function saveHighScore() {
        localStorage.setItem("highscore", highscore.innerText)
    }

    function loadHighscore() {
        return localStorage.getItem("highscore")
    }

    function scoring() {
        let sum = 0;
        for (let i in squares)
            sum += parseInt(squares[i].innerText);
        score.innerText = sum;
        if (parseInt(highscore.innerText) < parseInt(score.innerText)) {

            highscore.innerText = parseInt(score.innerText);
            saveHighScore();
        }
    }


    function moveUp() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < width * (width - 1); j++) {
                if (squares[j].innerText == "0") {
                    squares[j].innerText = parseInt(squares[j + width].innerText);
                    squares[j + width].innerText = 0;
                }
            }
        }
    }

    function moveDown() {
        for (let i = 0; i < 4; i++) {
            for (let j = width * width - 1; j >= width; j--) {
                if (squares[j].innerText == "0") {
                    squares[j].innerText = parseInt(squares[j].innerText) +
                        parseInt(squares[j - width].innerText);
                    squares[j - width].innerText = 0;
                }
            }
        }
    }

    function moveLeft() {
        for (let i = 0; i < width; i++) {
            for (let i = 0; i < width - 1; i++) {
                for (let j = i; j <= i + width * (width - 1); j += width) {
                    if (squares[j].innerText == 0) {
                        squares[j].innerText = parseInt(squares[j].innerText) +
                            parseInt(squares[j + 1].innerText);
                        squares[j + 1].innerText = 0;
                    }
                }
            }
        }
    }

    function moveRight() {
        for (let i = 0; i < width; i++) {
            for (let i = width - 1; i > 0; i--) {
                for (let j = i; j <= i + width * (width - 1); j += width) {
                    if (squares[j].innerText == 0) {
                        squares[j].innerText = parseInt(squares[j].innerText) +
                            parseInt(squares[j - 1].innerText);
                        squares[j - 1].innerText = 0;
                    }
                }
            }
        }
    }

    function actionUp() {
        moveUp();

        for (let j = 0; j < width * (width - 1); j++) {
            if (squares[j].innerText == squares[j + width].innerText) {
                squares[j].innerText = parseInt(squares[j].innerText) +
                    parseInt(squares[j + width].innerText);
                squares[j + width].innerText = 0;
            }
        }

        moveUp();
        checkWin();
    }

    function actionDown() {
        moveDown();

        for (let j = width * width - 1; j >= width; j--) {
            if (squares[j].innerText == squares[j - width].innerText) {
                squares[j].innerText = parseInt(squares[j].innerText) +
                    parseInt(squares[j - width].innerText);
                squares[j - width].innerText = 0;
            }
        }

        moveDown();
        checkWin();
    }

    function actionLeft() {
        moveLeft();

        for (let i = 0; i < width - 1; i++) {
            for (let j = i; j <= i + width * (width - 1); j += width) {
                if (squares[j].innerText == squares[j + 1].innerText) {
                    squares[j].innerText = parseInt(squares[j].innerText) +
                        parseInt(squares[j + 1].innerText);
                    squares[j + 1].innerText = 0;
                }
            }
        }

        moveLeft();
        checkWin();
    }

    function actionRight() {
        moveRight();

        for (let i = width - 1; i > 0; i--) {
            for (let j = i; j <= i + width * (width - 1); j += width) {
                if (squares[j].innerText == squares[j - 1].innerText) {
                    squares[j].innerText = parseInt(squares[j].innerText) +
                        parseInt(squares[j - 1].innerText);
                    squares[j - 1].innerText = 0;
                }
            }
        }

        moveRight();
        checkWin();
    }

    function detectKey(e) {
        if (e.keyCode === 37) {
            previous_squares = deepCopyArr(squares);
            actionLeft();
            condition_generateNewNumber(previous_squares, squares);
            scoring();
        } else if (e.keyCode === 38) {
            previous_squares = deepCopyArr(squares);
            actionUp();
            condition_generateNewNumber(previous_squares, squares);
            scoring();
        } else if (e.keyCode === 39) {
            previous_squares = deepCopyArr(squares);
            actionRight();
            condition_generateNewNumber(previous_squares, squares);
            scoring();
        } else if (e.keyCode === 40) {
            previous_squares = deepCopyArr(squares);
            actionDown();
            condition_generateNewNumber(previous_squares, squares);
            scoring();
        }
    }

    createGameBoard();

    document.addEventListener('keyup', detectKey);
    var myTimer = setInterval(makeColor, 10);

});

function restart() {
    location.reload();
}
