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
    update(movementX=this.x, movementY=this.y) {
        this.x = movementX;
        this.y = movementY;
    }
    render() {
        ctx.drawImage(Resources.get(this.character), this.x, this.y);
    }
    reset() {
        this.x = 200;
        this.y = 400;
    }
    handleInput(key) {
        let movement;
        switch(key) {
            case 'left': {
                if(this.x===0) {
                    break;
                } else {
                    movement = this.x - 100;
                    this.update(movement,this.y);
                    break;
                }
            }
            case 'up': {
                if(this.y<0){
                    break;
                } else {
                    movement = this.y - 83;
                    this.update(this.x,movement);
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
                    movement = this.x + 100;
                    this.update(movement,this.y);
                    break;
                }
            } 
            case 'down': {
                if(this.y===400) {
                    break;
                } else {
                    movement = this.y + 83;
                    this.update(this.x,movement);
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

let tempScores = [];

let scoreTimeout;

function scoreText(score) {
    // clear any present timeouts
    clearTimeout(scoreTimeout);

    const winText = document.querySelector('.win-title');

    tempScores.push(score);

    // if title is already open, add the scores
    if(!(winText.classList.contains('hide'))) {
        let total = 0;
        for (let score of tempScores) {
            total += score;
        }

        // set title text
        winText.innerHTML = `Score +${total}!`
    } else {
        // set title text
        winText.innerHTML = `Score +${score}!`
    }

    // show score title
    winText.classList.remove('hide');
    winText.classList.add('win');

    scoreTimeout = setTimeout(function() {
        winText.classList.add('hide');
        winText.classList.remove('win');
        tempScores = [];
    }, 1500);
}

// win function is called when water is reached
function winGame() {
    winCounter++;
    document.querySelector('.score-text').innerHTML = winCounter;

    scoreText(1);

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
                // determine gem color and remove gem
                gemPoints(getGridPos(player.x, player.y));
            }
            
        }
    }
}

let winCounter = 0;
let livesCounter = 10;

//234, 151, 68

const gameCoordinates = 
    [[20,100,0],[20,183,1],[20,266,2],
    [120,100,3],[120,183,4],[120,266,5],
    [220,100,6],[220,183,7],[220,266,8],
    [320,100,9],[320,183,10],[320,266,11],
    [420,100,12],[420,183,13],[420,266,14]];

let activeGrid = 
    [[20,100,0],[20,183,1],[20,266,2],
    [120,100,3],[120,183,4],[120,266,5],
    [220,100,6],[220,183,7],[220,266,8],
    [320,100,9],[320,183,10],[320,266,11],
    [420,100,12],[420,183,13],[420,266,14]];

// returns the grid position of player
function getGridPos(x,y) {
    if((x===0)&&(y===68)) {
        return 0;
    } else if ((x===0)&&(y===151)) {
        return 1;
    } else if ((x===0)&&(y===234)) {
        return 2;
    } else if ((x===100)&&(y===68)) {
        return 3;
    } else if ((x===100)&&(y===151)) {
        return 4;
    } else if ((x===100)&&(y===234)) {
        return 5;
    } else if ((x===200)&&(y===68)) {
        return 6;
    } else if ((x===200)&&(y===151)) {
        return 7;
    } else if ((x===200)&&(y===234)) {
        return 8;
    } else if ((x===300)&&(y===68)) {
        return 9;
    } else if ((x===300)&&(y===151)) {
        return 10;
    } else if ((x===300)&&(y===234)) {
        return 11;
    } else if ((x===400)&&(y===68)) {
        return 12;
    } else if ((x===400)&&(y===151)) {
        return 13;
    } else if ((x===400)&&(y===234)) {
        return 14;
    }
}

// compare player position to gem to get gem color (points)
function gemPoints(playerPos) {
    let color;
    for(let i=0; i<allGems.length; i++) {
        if(allGems[i].getIndex()===playerPos) {
            color = allGems[i].getColor();

            // remove the gem and reset activeGrid
            allGems.splice(i,1); 
            activeGrid[i] = gameCoordinates[i];
        }
    }

    switch(color) {
        case 'blue': {
            winCounter++;
            document.querySelector('.score-text').innerHTML = winCounter;
            scoreText(1);
            break;
        }
        case 'green': {
            winCounter = winCounter + 3;
            document.querySelector('.score-text').innerHTML = winCounter;
            scoreText(3);
            break;
        }
        case 'orange': {
            winCounter = winCounter + 5;
            document.querySelector('.score-text').innerHTML = winCounter;
            scoreText(5);
            break;
        }

    }
}

let allGems = [];

const blue = 'images/Gem Blue.png';
const green = 'images/Gem Green.png';
const orange = 'images/Gem Orange.png';

class Gem {
    constructor(color, sprite,x,y,gridIndex) {
        this.color = color;
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.gridIndex = gridIndex;
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

    getColor() {
        return this.color;
    }

    getIndex() {
        return this.gridIndex;
    }
}

// get random positon for gem placement
function randomPos() {
    let gridPos = randomGemNum(15); // 15 possible positions
    if(!(activeGrid[gridPos]===null)) {
        let [x,y,index] = activeGrid[gridPos];

        // set selected grid position to null
        activeGrid[gridPos] = null;
        return [x,y,index];
    } else {
        // console.log('gem skipped');
        return null;
    }
    
}

function removeGems(index,gridIndex) {
    // remove gem after 30 seconds and reset grid place
    setTimeout(function(gemIndex) {
        allGems.splice(gemIndex,1);
        activeGrid[gridIndex] = gameCoordinates[gridIndex];
    }, 30000);
}

function randomGemNum(num) {
    return Math.floor(Math.random() * num);
}

// add random gems
function addGems() {
    // blue gems
    if(randomGemNum(1000)===29) {
        let pos = randomPos();
        if(!(pos===null)) {
            let [x,y,gridIndex] = pos;
            let blueGem = new Gem('blue',blue,x,y,gridIndex);
            allGems.push(blueGem);

            // remove gem after 30 sec
            let gemIndex = allGems.length;
            removeGems(gemIndex,gridIndex);
        }
    }

    // green gems
    if(randomGemNum(5000)===29) {
        let pos = randomPos();
        if(!(pos===null)) {
            let [x,y,gridIndex] = pos;
            let greenGem = new Gem('green',green,x,y,gridIndex);
            allGems.push(greenGem);

            // remove gem after 30 sec
            let gemIndex = allGems.length;
            removeGems(gemIndex,gridIndex);
        }
    }

    // orange gems
    if(randomGemNum(8000)===29) {
        let pos = randomPos();
        if(!(pos===null)) {
            let [x,y,gridIndex] = pos;
            let orangeGem = new Gem('orange',orange,x,y,gridIndex);
            allGems.push(orangeGem);

            // remove gem after 30 sec
            let gemIndex = allGems.length;
            removeGems(gemIndex,gridIndex);
        }
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
    
    let leaderSorted = topScores.sort(function(a,b) {
        return b[0] - a[0];
    });

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

