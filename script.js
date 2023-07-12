const fields = document.querySelectorAll('.field');
const newGameBtn = document.getElementById('new-game');
const info = document.getElementById('info');

// Player
const Player = (symbol) => {
    return { symbol };
};

// GameBoard
const GameBoard = (() => {

    // empty game board array
    let gameboard = ['', '', '', '', '', '', '', '', ''];

    // reset array to default values
    const reset = () => {
        for (let i = 0; i < 9; i++) {
            gameboard[i] = '';
        }
    }

    // check if array includes empty fields
    const leftSpace = (gameboard) => gameboard.includes('');

    // print array values on the screen
    const printOnScreen = () => {
        fields.forEach((field, index) => {
            field.textContent = gameboard[index];
        });
    };

    // add "X" or "O" to array 
    const addSymbol = (symbol, index) => {
        gameboard[index] = symbol;
    };
    
    return { gameboard, addSymbol, printOnScreen, leftSpace, reset };
})();

// GameController
const GameController = (() => {

    // creating players
    const playerX = Player("X");
    const playerO = Player("O");

    // winning patterns
    const winPattern = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], 
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    // active player and if game over
    let activePlayer;
    let endGame;

    // check if someone won
    const checkWin = () => {
        for (let i = 0; i < winPattern.length; i++) {
            const pattern = winPattern[i];
            if (GameBoard.gameboard[pattern[0]] === activePlayer.symbol 
                && GameBoard.gameboard[pattern[1]] === activePlayer.symbol 
                && GameBoard.gameboard[pattern[2]] === activePlayer.symbol) {
                    endGame = true;
                    return;
            }
        }
    }; 

    // check if there is end game
    const checkGame = () => {
        checkWin();
        if (endGame == false) {
            if (!GameBoard.leftSpace(GameBoard.gameboard)) {
                info.textContent = "Game over, it's a draw!";
                fields.forEach((field, index) => {
                    field.removeEventListener('click', handleFieldClick);
                });
            }
        } else {
            info.textContent = `Game over, ${activePlayer.symbol} won the game!`;
            fields.forEach((field, index) => {
                field.removeEventListener('click', handleFieldClick);
            });
        }
    };

    // change active player
    const changePlayer = () => {
        activePlayer = activePlayer === playerX ? playerO : playerX;
    };

    // check if clicked field is empty
    const isEmpty = (field) => field.textContent === '';

    // handle field click
    const handleFieldClick = (event) => {
        const field = event.target;
        const index = field.getAttribute('data-index');
        if (isEmpty(field)) { 
            GameBoard.addSymbol(activePlayer.symbol, index);
            GameBoard.printOnScreen();
            checkGame();
            changePlayer();
        }
    };

    // new game
    newGameBtn.addEventListener('click', () => {
        initGame();
    });

    // initialize game
    const initGame = () => {
        // add event listener to fields
        fields.forEach((field) => {
            field.addEventListener('click', handleFieldClick);
        });

        info.textContent = "Remember X starts first!";
        GameBoard.reset('');
        activePlayer = playerX;
        endGame = false;
        GameBoard.printOnScreen();
    }

    return { activePlayer, changePlayer, initGame };
})();

window.addEventListener('DOMContentLoaded', GameController.initGame);
