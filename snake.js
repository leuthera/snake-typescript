var ui = document.getElementById("info-panel");
var ui_ctx = ui.getContext("2d");
var panel = document.getElementById("snake-panel");
var ctx = panel.getContext("2d");
var game_started = false;
var snake = {
    head: { x: 10, y: 10 },
    size: 1,
    trail: []
};
var apple = { x: 15, y: 15 };
var movement = { x: 0, y: 0 };
var direction = 0;
var tile_size = 20;
var score = 0;
function through_walls(allowed) {
    if (allowed) {
        if (snake.head.x < 0)
            snake.head.x = tile_size - 1;
        if (snake.head.x > tile_size - 1)
            snake.head.x = 0;
        if (snake.head.y < 0)
            snake.head.y = tile_size - 1;
        if (snake.head.y > tile_size - 1)
            snake.head.y = 0;
    }
    else {
        if (snake.head.x < 0 || snake.head.x > tile_size - 1 || snake.head.y < 0 || snake.head.y > tile_size - 1) {
            gameover();
        }
    }
}
var gameLoop = window.setInterval(game, 1000 / 10);
function gameover() {
    if (game_started) {
        window.clearInterval(gameLoop);
        ui_ctx.fillStyle = "gray";
        ui_ctx.font = "60px Arial";
        ui_ctx.fillText("GameOver", 60, 50);
    }
}
function game() {
    snake.head.x += movement.x;
    snake.head.y += movement.y;
    through_walls(false);
    // gamespace
    ctx.fillStyle = "#aaa";
    ctx.fillRect(0, 0, panel.width, panel.height);
    // snake
    ctx.fillStyle = "green";
    for (var _i = 0, _a = snake.trail; _i < _a.length; _i++) {
        var pos = _a[_i];
        ctx.fillRect(pos.x * tile_size, pos.y * tile_size, tile_size - 2, tile_size - 2);
        // caught yourself
        if (pos.x == snake.head.x && pos.y == snake.head.y) {
            gameover();
        }
    }
    snake.trail.push({ x: snake.head.x, y: snake.head.y });
    // remove last bit of the tail
    while (snake.trail.length > snake.size) {
        snake.trail.shift();
    }
    // apple
    if (apple.x == snake.head.x && apple.y == snake.head.y) {
        snake.size++;
        score++;
        apple.x = Math.floor(Math.random() * tile_size);
        apple.y = Math.floor(Math.random() * tile_size);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(apple.x * tile_size, apple.y * tile_size, tile_size - 2, tile_size - 2);
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(score.toString(), 10, 30);
}
document.addEventListener("keydown", keyStroke);
function keyStroke(e) {
    switch (e.keyCode) {
        case 37 /* Left */:
            if (direction === 39 /* Right */)
                break;
            direction = 37 /* Left */;
            movement.x = -1;
            movement.y = 0;
            break;
        case 38 /* Top */:
            if (direction === 40 /* Bottom */)
                break;
            direction = 38 /* Top */;
            movement.x = 0;
            movement.y = -1;
            break;
        case 39 /* Right */:
            if (direction === 37 /* Left */)
                break;
            direction = 39 /* Right */;
            movement.x = 1;
            movement.y = 0;
            break;
        case 40 /* Bottom */:
            if (direction === 38 /* Top */)
                break;
            direction = 40 /* Bottom */;
            movement.x = 0;
            movement.y = 1;
            break;
    }
    if (direction)
        game_started = true;
}
