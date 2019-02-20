var canvas = $('#canvas')
var canvasWidth = 800;
var canvasHeight = 600;
var boxWidth = canvasWidth / 9;
var boxHeight = canvasHeight / 7;

/* 1 - Player1
 * 2 - Player2
 * 0 - Battlefield
 */
let gameBoard = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2]
]

canvas.attr({'width': canvasWidth, 'height': canvasHeight}).css({
    'border': '1px solid black',
    'display': 'block',
    'padding-left': '0',
    'padding-right': '0',
    'margin-left': 'auto',
    'margin-right': 'auto'}).on('click', function(ev) {
        console.log(`X: ${ev.offsetX} Y: ${ev.offsetY}`);
    });

let ctx = canvas[0].getContext('2d');

function drawBoard() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    let white = true;
    gameBoard.forEach((y, yIdx) => {
        y.forEach((x, xIdx) => {
            switch (x) {
                case 0:
                    ctx.fillStyle = '#dfdfdf';
                    break;
                case 1:
                    if (white)
                        ctx.fillStyle = '#d0d0d0';
                    else
                        ctx.fillStyle = '#555555';

                    white = !white;
                    break;
                case 2:
                    if (white)
                        ctx.fillStyle = '#555555';
                    else
                        ctx.fillStyle = '#d0d0d0';

                    white = !white;
                    break;
            }

            ctx.fillRect((xIdx * boxWidth), (yIdx * boxHeight), boxWidth, boxHeight);
        });
    });
}

function redraw() {
    drawBoard();
};

redraw();
