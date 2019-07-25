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


// Player class
class Player {
    constructor(x=200,y=400) {
        this.character = 'images/char-boy.png';
        this.x = x;
        this.y = y;
    }
    update() {
        // ??
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

    // show score +1 title
    document.querySelector('.win-title').classList.remove('hide');
    document.querySelector('.win-title').classList.add('win');

    setTimeout(function() {
        document.querySelector('.win-title').classList.add('hide');
        document.querySelector('.win-title').classList.remove('win');
    }, 1500);

    setTimeout(function() {
        // alert('You win!');
        player.reset();
    }, 100);
}

// game over
function gameOver() {
    // increment gameCounter
    gameCounter++;

    // remove keyup listener
    document.removeEventListener('keyup', listenerFunc);

    // open and focus on game over modal
    document.querySelector('.game-over').classList.remove('hide');
    document.querySelector('.game-over').focus();

    // update game over text
    document.getElementById('over-text-message').innerHTML = `Nice job, ${playerName}!`;

    // update score text
    document.querySelector('.score-text-over').innerHTML = winCounter;

    // set score and display sorted leaderboards
    if(difficulty===true) {
        topScoresNormal.setScores(winCounter, playerName);
        displayLeaderboard(scoresSort(topScoresNormal.getScores())); 

    } else {
        topScoresHard.setScores(winCounter, playerName);
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
function checkCollisions(array) {
    const [playerX, playerY] = player.getPosition();

    for(let sprite of array) {
        const [spriteX, spriteY] = sprite.getPosition();

        // when a collision takes place
        if((Math.abs(playerX-spriteX)<80) && (Math.abs(playerY-spriteY)<50)) {
            
            if(array===allEnemies) {
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

            if(array===allGems) {
                console.log('Got a gem!');
            }
            
        }
    }
}

let winCounter = 0;
let livesCounter = 10;

//234, 151, 68

const gameCoordinates = 
    [[20,266],[20,183],[20,100],
    [120,266],[120,183],[120,100],
    [220,266],[220,183],[220,100],
    [320,266],[320,183],[320,100],
    [420,266],[420,183],[420,100]];

let allGems = [];

const blue = 'images/Gem Blue.png';
const green = 'images/Gem Green.png';
const orange = 'images/Gem Orange.png';

class Gem {
    constructor(sprite,x,y) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
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

// get random positon for gem placement
function randomPos() {
    let gridPos = randomGemNum(15); // 15 possible positions
    let [x,y] = gameCoordinates[gridPos];
    return [x,y];
}

function randomGemNum(num) {
    return Math.floor(Math.random() * num);
}

// add random gems
function addGems() {
    // blue gems
    if(randomGemNum(1000)===29) {
        let [x,y] = randomPos();
        let blueGem = new Gem(blue,x,y);
        allGems.push(blueGem);
    }

    // green gems
    if(randomGemNum(5000)===29) {
        let [x,y] = randomPos();
        let greenGem = new Gem(green,x,y);
        allGems.push(greenGem);
    }

    // orange gems
    if(randomGemNum(8000)===29) {
        let [x,y] = randomPos();
        let orangeGem = new Gem(orange,x,y);
        allGems.push(orangeGem);
    }
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method.
function addListener() {
    document.addEventListener('keyup', listenerFunc);
}

function listenerFunc(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
};

// focus on new game window upon startup
document.querySelector('.player-select').focus();

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
    addListener(); // add keyboard listener for gameplay
})

const playAgainButton = document.getElementById('play-again');

function playAgain() {
    // close game over window and open new game window
    document.querySelector('.game-over').classList.add('hide');
    document.querySelector('.player-select').classList.remove('hide');
    document.querySelector('.player-select').focus();

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
    constructor(topScores) {
        this.topScores = [];
    }

    setScores(winCounter, playerName) {    
        this.topScores.push([winCounter, playerName]);
    }

    getScores() {
        return this.topScores;
    }
}

// create leaderboards for both game modes
const topScoresNormal = new Leaderboard();
const topScoresHard = new Leaderboard();

let leaderTableNormal = document.querySelector('.leader-table-normal');
let leaderTableHard = document.querySelector('.leader-table-hard');

// sort the leaderboard based on score (value)
function scoresSort(topScores) {
    let leaderSorted = topScores.sort();
    leaderSorted = leaderSorted.reverse();

    //only keep top 5
    if(!(leaderSorted[5]===undefined)) {
        leaderSorted.splice(5,1);
    }
    return leaderSorted;
} 


// display leaderboard 
function displayLeaderboard(sortedScores) {
    //debugger;
    let names =[];
    let scores =[];

    for(let score of sortedScores) {
        scores.push(score[0,0]);
        names.push(score[0,1]);
    }

    let currentHead;
    let currentTable;

    // set the current table
    if(difficulty===true) {
        currentTable = leaderTableNormal;
    } else {
        currentTable = leaderTableHard;
    }

    // clear current table children
    while (currentTable.firstChild) {
        currentTable.removeChild(currentTable.firstChild);
    }
    
    let tableNormalHead = leaderTableNormal.createTHead();
    let tableHardHead = leaderTableHard.createTHead();
   
    // set the current head
    if(difficulty===true) {
        currentHead = tableNormalHead;
    } else {
        currentHead = tableHardHead;
    }
    
    // create and add table header
    let header = currentHead.insertRow();
    header.id = 'table-header';
    let blank = document.createElement('td');
    let nameTitle = document.createElement('td');
    let scoreTitle = document.createElement('td');
    nameTitle.innerHTML = 'Name';
    scoreTitle.innerHTML = 'Score';
    header.appendChild(blank);
    header.appendChild(nameTitle);
    header.appendChild(scoreTitle);

    for(let i=1; i<(sortedScores.length+1); i++) { 
        let entry = currentHead.insertRow();
        let number = document.createElement('td');
        let name = document.createElement('td');
        let score = document.createElement('td');
        
        number.innerHTML = `${i}.`;
        name.innerHTML = names[i-1];
        score.innerHTML = scores[i-1];

        entry.appendChild(number);
        entry.appendChild(name);
        entry.appendChild(score);
        currentTable.appendChild(entry);
    }
}

