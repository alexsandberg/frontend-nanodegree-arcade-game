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
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
    constructor() {
        this.character = 'images/char-boy.png';
    }
    update(dt) {

    }
    render() {
        ctx.drawImage(Resources.get(this.character), this.x, this.y);
    }
    handleInput(key) {

    }
}

const player = new Player();


// random speed function generates number between 100-300
const randomSpeed = function() {
    let result;
    do {
    result = (Math.random() * 300);
    }
    while(result<100)

    return result
}

// generate enemy function

const allEnemies = [];
const enemy1 = new Enemy(0,60,randomSpeed());
allEnemies.push(enemy1);
const enemy2 = new Enemy(0,145,randomSpeed());
allEnemies.push(enemy2);
const enemy3 = new Enemy(0,230,randomSpeed());
allEnemies.push(enemy3);
// const enemy4 = new Enemy(0,300);
// allEnemies.push(enemy4);

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



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
