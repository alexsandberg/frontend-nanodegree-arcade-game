// Enemies our player must avoid

class Enemy {
    constructor(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.sprite = 'images/enemy-bug.png';
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (dt*this.speed);
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // get the enemy position
    getPosition() {
        const position = [this.x, this.y];
        return position;
    }
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
    constructor(x=200,y=400) {
        this.character = 'images/char-boy.png';
        this.x = x;
        this.y = y;
    }
    update() {
        // this.x = this.x;
        // this.y = this.y;
    }
    render() {
        ctx.drawImage(Resources.get(this.character), this.x, this.y);
    }
    reset() {
        this.x = 200;
        this.y = 400;
    }
    handleInput(key) {
        switch(key) {
            case 'left': {
                if(this.x===0) {
                    break;
                } else {
                    this.x = this.x - 100;
                    break;
                }
            }
            case 'up': {
                if(this.y<0){
                    break;
                } else {
                    this.y = this.y - 83;
                    if(this.y<68) {
                        winGame();
                    }
                    break;
                }
            }
            case 'right': {
                if(this.x===400) {
                    break;
                } else {
                    this.x = this.x + 100;
                    break;
                }
            } 
            case 'down': {
                if(this.y===400) {
                    break;
                } else {
                    this.y = this.y + 83;
                    break;
                }
            }
        }
    }
    getPosition() {
        const position = [this.x, this.y];
        return position;
    }
}

let player = new Player();

// win function is called when water is reached
function winGame() {
    winCounter++;
    document.querySelector('.score-text').innerHTML = winCounter;
    setTimeout(function() {
        // alert('You win!');
        player.reset();
    }, 100);
}

// game over
function gameOver() {
    // alert('Game over!')
    document.querySelector('.game-over').classList.remove('hide');

    // update score text
    document.querySelector('.score-text-over').innerHTML = winCounter;

    // set score and display sorted leaderboards
    if(difficulty===true) {
        topScoresNormal.setScores(playerName, winCounter);
        displayLeaderboard(scoresSort(topScoresNormal.getScores())); 

    } else {
        topScoresHard.setScores(playerName, winCounter);
        displayLeaderboard(scoresSort(topScoresHard.getScores()));
    }   
}
 
// game defaults to normal mode
let maxSpeed = 500;
let maxEnemies = 4;

// random speed function generates number between 150-maxSpeed
const randomSpeed = function() {
    let result;
    do {
        result = (Math.random() * maxSpeed);
    }
    while(result<150)

    return result
}

// function for choosing random line for enemy generation
function randomLine() {
    // chose line 60, 145, or 230 (y grid location)
    if(Math.random()<=0.33) {
        return 60;
    } else if((Math.random()>0.33)&&(Math.random()<=0.66)) {
        return 145;
    } else {
        return 230;
    }
}

// enemy counters
let enemiesNum = [];
enemiesNum[60] = 1;
enemiesNum[145] = 1;
enemiesNum[230] = 1;

// generate enemy function
function enemyGen(num) {
    let enemy = new Enemy(-100,num,randomSpeed());
    allEnemies.push(enemy);
}

/* Monitor enemy position. When an enemy reaches halfway, send another enemy.
 * When the enemy reaches the end of the screen, remove them from the allEnemies array.
 */
function addEnemies() {
    for(let i=0; i<allEnemies.length; i++) {
        const line = randomLine(); // get a random line

        // only add new enemies if there are less than (maxEnemies) total currently present
        // and if there are less than 2 on the line
        if((allEnemies[i].x>250) && (allEnemies.length<maxEnemies) && (enemiesNum[line]<2)) {
            enemyGen(line);
            // add 1 to appropriate counter
            enemiesNum[line]++;
        }
        if(allEnemies[i].x>505) {
            //remove 1 from appropriate counter
            enemiesNum[allEnemies[i].y]--;   
            // remove from allEnemies array when end of screen is reached
            allEnemies.splice(i,1);
        }
    }
}

const allEnemies = [];

// create first 3 enemies
const enemy1 = new Enemy(-100,60,randomSpeed());
allEnemies.push(enemy1);
const enemy2 = new Enemy(-100,145,randomSpeed());
allEnemies.push(enemy2);
const enemy3 = new Enemy(-100,230,randomSpeed());
allEnemies.push(enemy3);


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// check for collisions between player and enemies
function checkCollisions() {
    const [playerX, playerY] = player.getPosition();

    for(let enemy of allEnemies) {
        const [enemyX, enemyY] = enemy.getPosition();

        // when a collision takes place
        if((Math.abs(playerX-enemyX)<80) && (Math.abs(playerY-enemyY)<50)) {
            // decrement the lives counter
            livesCounter--;
            document.querySelector('.lives-text').innerHTML = livesCounter;

            if(livesCounter===0) {
                setTimeout(function() {
                    gameOver();
                }, 100);
            }
            // reset player position
            player.reset();
        }
    }
}

let winCounter = 0;
let livesCounter = 10;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


const players = document.querySelectorAll('.player-image');
const selected = [players[0]]; // selected defaults with first character

function playerSelection(tempPlayer) {
    // toggle selected class
    selected[0].classList.remove('selection');
    selected.pop();
    selected.push(tempPlayer);
    selected[0].classList.add('selection');
    player.character = tempPlayer.id;
} 

// adds event listeners to character options on selection screen
for(let tempPlayer of players) {
    tempPlayer.addEventListener('click', function(e) {
        playerSelection(tempPlayer)
    });
}

let playerName;
let gameCounter = 1;

function setPlayerName() {
    let input = document.getElementById('name').value;
    if(input==="") {
        playerName = `player-${gameCounter}`;
    } else {
        playerName = input;
    }
}

// button listeners
const playButton = document.getElementById('play-button');

playButton.addEventListener('click', function(e) {
    document.querySelector('.player-select').classList.add('hide');
    gameMode(); // get game mode
    setPlayerName(); // set player name 
})

const playAgainButton = document.getElementById('play-again');

function playAgain() {
    document.querySelector('.game-over').classList.add('hide');
    document.querySelector('.player-select').classList.remove('hide');

    // reset and redisplay lives and score counters
    livesCounter = 10; 
    document.querySelector('.lives-text').innerHTML = livesCounter;
    winCounter = 0;
    document.querySelector('.score-text').innerHTML = winCounter;
}

playAgainButton.addEventListener('click', function(e) {
    playAgain();
})

function setDifficulty(bool) {
    // true for normal mode, false for hard
    let difficulty = bool;

    return difficulty;
}

let difficulty;

//function for choosing difficulty mode     
function gameMode() {
    if(document.getElementById('normal-mode').checked) {
        difficulty = setDifficulty(true);
        maxSpeed = 500;
        maxEnemies = 4;
    } else {
        // hard mode
        difficulty = setDifficulty(false);
        maxSpeed = 700;
        maxEnemies = 5;
    }
}

// class for creating leaderboards
class Leaderboard {
    constructor() {
        this.topScores = new Map();
    }

    setScores(playerName, winCounter) {
        this.topScores.set(playerName, winCounter);
    }

    getScores() {
        return this.topScores;
    }
}

// create leaderboards for both game modes
const topScoresNormal = new Leaderboard();
const topScoresHard = new Leaderboard();

// function for storing scores
// function topScores() {
//     const leaderboard = new Map();

//     return function(playerName, winCounter) {
//             leaderboard.set(playerName, winCounter);
//         }
// }

// let setScores = topScores();


let leaderTableNormal = document.querySelector('.leader-table-normal');
let leaderTableHard = document.querySelector('.leader-table-hard');
let tableNormalHead = leaderTableNormal.createTHead();
let tableHardHead = leaderTableHard.createTHead();

// sort the leaderboard based on score (value)
function scoresSort(board) {
    let leaderSorted = new Map([...board.entries()].sort((a, b) => b[1] - a[1]));
    return leaderSorted;
} 


// display leaderboard 
function displayLeaderboard(board) {
    let keys =[ ...board.keys() ];
    let values =[ ...board.values() ];

    let currentHead;
    let currentTable;
    if(difficulty===true) {
        currentHead = tableNormalHead;
        currentTable = leaderTableNormal;
    } else {
        currentHead = tableHardHead;
        currentTable = leaderTableHard;
    }

    for(let i=1; i<6; i++) {
        let entry = currentHead.insertRow();
        let number = document.createElement('td');
        let name = document.createElement('td');
        let score = document.createElement('td');
        
        number.innerHTML = `${i}.`;
        name.innerHTML = keys[i-1];
        score.innerHTML = values[i-1];

        entry.appendChild(number);
        entry.appendChild(name);
        entry.appendChild(score);
        currentTable.appendChild(entry);

        if(keys[i]===undefined) {
            break;
        }
    }
}

