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
    constructor(x,y) {
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

const player = new Player(200,400);


// random speed function generates number between 150-300
const randomSpeed = function() {
    let result;
    do {
    result = (Math.random() * 300);
    }
    while(result<150)

    return result
}

// generate enemy function
function enemyGen(y) {
    let enemy = new Enemy(-100,y,randomSpeed());
    allEnemies.push(enemy);
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

        if((Math.abs(playerX-enemyX)<80) && (Math.abs(playerY-enemyY)<50)) {
            console.log('crash!');
        }
    }
}



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
