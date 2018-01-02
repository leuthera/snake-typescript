let ui     = document.getElementById("info-panel") as HTMLCanvasElement;
let ui_ctx = ui.getContext("2d") as CanvasRenderingContext2D;

let panel = document.getElementById("snake-panel") as HTMLCanvasElement;
let ctx   = panel.getContext("2d") as CanvasRenderingContext2D;

let game_started: boolean = false;

type Vector = { x: number, y: number };

let snake: { head: Vector, size: number, trail: Vector[] } = {
    head  : { x: 10, y: 10 },
    size  : 1,
    trail : []
}

let apple     : Vector = { x: 15, y: 15 };

let movement  : Vector = { x: 0, y: 0 };
let direction : number = 0;

let tile_size : number = 20;

const enum Nav {
    Left = 37,
    Top,
    Right,
    Bottom,
}

let score: number = 0;

function through_walls( allowed: boolean ) {
    if ( allowed ) {
        if ( snake.head.x < 0 )
            snake.head.x = tile_size - 1;

        if ( snake.head.x > tile_size - 1 )
            snake.head.x = 0;

        if ( snake.head.y < 0 )
            snake.head.y = tile_size - 1;

        if ( snake.head.y > tile_size - 1 )
            snake.head.y = 0;
    }
    else {
        if ( snake.head.x < 0 || snake.head.x > tile_size - 1 || snake.head.y < 0 ||  snake.head.y > tile_size - 1 ) {
            gameover();
        }
    }
}

let gameLoop: number = window.setInterval( game, 1000 / 10 );

function gameover(): void {
    if ( game_started ) {
        window.clearInterval( gameLoop );

        ui_ctx.fillStyle = "gray";
        ui_ctx.font = "60px Arial";
        ui_ctx.fillText( "GameOver", 60, 50 );
    }
}

function game(): void {
    snake.head.x += movement.x;
    snake.head.y += movement.y;

    through_walls( false );

    // gamespace
    ctx.fillStyle = "#aaa";
    ctx.fillRect( 0, 0, panel.width, panel.height );

    // snake
    ctx.fillStyle = "green";
    for ( let pos of snake.trail ) {
        ctx.fillRect( pos.x * tile_size , pos.y * tile_size, tile_size - 2, tile_size - 2 );
        // caught yourself
        if ( pos.x == snake.head.x && pos.y == snake.head.y ) {
            gameover();
        }
    }
    snake.trail.push( { x: snake.head.x, y: snake.head.y } );

    // remove last bit of the tail
    while( snake.trail.length > snake.size ) {
        snake.trail.shift();
    }

    // apple
    if ( apple.x == snake.head.x && apple.y == snake.head.y ) {
        snake.size++;
        score++;

        apple.x = Math.floor( Math.random() * tile_size );
        apple.y = Math.floor( Math.random() * tile_size );
    }
    ctx.fillStyle = "red";
    ctx.fillRect( apple.x * tile_size, apple.y * tile_size, tile_size - 2, tile_size - 2 );

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText( score.toString(), 10, 30 );
}

document.addEventListener( "keydown", keyStroke );
function keyStroke( e: KeyboardEvent ) {
    switch ( e.keyCode ) {
        case Nav.Left:
            if ( direction === Nav.Right ) break;
            direction = Nav.Left;
            movement.x = -1;
            movement.y = 0;
            break;
        case Nav.Top:
            if ( direction === Nav.Bottom ) break;
            direction = Nav.Top;
            movement.x = 0;
            movement.y = -1;
            break;
        case Nav.Right:
            if ( direction === Nav.Left ) break;
            direction = Nav.Right;
            movement.x = 1;
            movement.y = 0;
            break;
        case Nav.Bottom:
            if ( direction === Nav.Top ) break;
            direction = Nav.Bottom;
            movement.x = 0;
            movement.y = 1;
            break;
    }

    if ( direction ) game_started = true;
}

