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

const player = new Player();

// win function

function winGame() {
    // winCounter++;
    // document.querySelector('.score').innerHtml = winCounter;
    setTimeout(function() {
        alert('You win!');
        player.reset();
    }, 100);
}
 

// random speed function generates number between 150-500
const randomSpeed = function() {
    let result;
    do {
        result = (Math.random() * 500);
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

        // only add new enemies if there are less than 4 total currently present
        // and if there are less than 2 on the line
        if((allEnemies[i].x>250) && (allEnemies.length<4) && (enemiesNum[line]<2)) {
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
            // console.log('crash!');
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
