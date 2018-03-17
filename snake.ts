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
let move = {
    top() {
        movement.x = 0;
        movement.y = -1;
        return Nav.Top;
    },
    right() {
        movement.x = 1;
        movement.y = 0;
        return Nav.Right;
    },
    left() {
        movement.x = -1;
        movement.y = 0;
        return Nav.Left;
    },
    bottom() {
        movement.x = 0;
        movement.y = 1;
        return Nav.Bottom;
    }
}

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
        ui_ctx.font      = "60px Arial";
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

const gamepad = (idx) => navigator.getGamepads()[ idx ];
const axes = ( pad, idx ) => pad && pad.axes && pad.axes[ idx ] ? pad.axes[ idx ].toFixed( 2 ) : null;

function inputloop() {
    const pad = gamepad(0);
    if (pad) {
        let axis  = axes(pad, 9);
        let btn   = pad.buttons;

        if (axis) {
            if ( axis < -0.7 )                move.top();
            if ( axis > 0.4  && axis < 1 )    move.left() && ( game_started = true )
            if ( axis < -0.2 && axis > -0.6 ) move.right();
            if ( axis < 0.3  && axis > -0.1 ) move.bottom();
        } 
        else {
            if ( btn[12].pressed ) move.top();
            if ( btn[14].pressed ) move.left() && ( game_started = true )
            if ( btn[15].pressed ) move.right();
            if ( btn[13].pressed ) move.bottom();
        }
        
        requestAnimationFrame( inputloop );
    }
};

requestAnimationFrame( inputloop );
window.addEventListener( "gamepadconnected", (e) => {
    requestAnimationFrame( inputloop );
    console.log(e, "inputloop started");
});


document.addEventListener( "keydown", keyStroke );
function keyStroke( e: KeyboardEvent ) {
    switch ( e.keyCode ) {
        case Nav.Left:
            if ( direction === Nav.Right ) break;
            direction = move.left();
            break;
        case Nav.Top:
            if ( direction === Nav.Bottom ) break;
            direction = move.top();
            break;
        case Nav.Right:
            if ( direction === Nav.Left ) break;
            direction = move.right();
            break;
        case Nav.Bottom:
            if ( direction === Nav.Top ) break;
            direction = move.bottom();
            break;
    }

    if ( direction ) game_started = true;
}

